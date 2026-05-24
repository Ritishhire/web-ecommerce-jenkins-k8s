# ShopWave Kubernetes Guide

This folder deploys the full ShopWave MERN app to Kubernetes:

1. MongoDB database
2. Backend API
3. Frontend nginx app
4. Self-healing health checks
5. Horizontal autoscaling for frontend and backend

## File Flow

Apply order is simple now:

| File | Purpose |
| --- | --- |
| `00-namespace.yaml` | Creates the `shopwave` namespace |
| `01-app-settings.yaml` | App ConfigMap and JWT Secret |
| `10-mongodb.yaml` | MongoDB StatefulSet, Service, PVC, and probes |
| `20-backend.yaml` | Backend Service, Deployment, replicas, and probes |
| `30-frontend.yaml` | Frontend Service, Deployment, replicas, and probes |
| `40-autoscaling.yaml` | HPA rules for backend and frontend |
| `kind-cluster.yaml` | Local Kind cluster with port `30080` exposed |
| `kustomization.yaml` | One file that applies everything in order |

## Jenkins Automatic Deploy

The root `jenkins` pipeline is simple and automatic:

1. Builds backend and frontend Docker images.
2. Creates the Kind cluster if it does not exist.
3. Loads the images into the Kind cluster.
4. Runs `kubectl apply -k k8s`.
5. Restarts backend and frontend pods.
6. Seeds the database.
7. Prints the frontend URL.

Jenkins needs Docker, Kind, and kubectl installed on the Jenkins machine.

## What Auto-Healing Means Here

Kubernetes will heal the app using:

- `replicas: 2` for frontend and backend, so one pod can fail without killing the app.
- `startupProbe` to give containers time to boot.
- `readinessProbe` to send traffic only to ready pods.
- `livenessProbe` to restart stuck or unhealthy containers.
- Deployments and StatefulSet, so deleted/crashed pods are recreated automatically.

## What Scaling Means Here

`40-autoscaling.yaml` creates:

- `backend-hpa`: keeps 2 to 5 backend pods.
- `frontend-hpa`: keeps 2 to 5 frontend pods.

Scaling is based on CPU usage. HPA needs Metrics Server. If `kubectl top pods -n shopwave` works, Metrics Server is already ready.

## Step 1: Build Docker Images

From the project root:

```powershell
docker build -t ecommerce-web-backend:latest .\backend
docker build -t ecommerce-web-frontend:latest .\frontend
```

## Step 2: Create Local Kind Cluster

Use this only if you are running with Kind:

```powershell
kind create cluster --config .\k8s\kind-cluster.yaml
```

Load the local Docker images into Kind:

```powershell
kind load docker-image ecommerce-web-backend:latest --name shopwave-cluster
kind load docker-image ecommerce-web-frontend:latest --name shopwave-cluster
```

If you use Docker Desktop Kubernetes or another cluster, skip this step.

## Step 3: Install Metrics Server For HPA

Check first:

```powershell
kubectl top nodes
```

If that command works, skip this step.

For a local cluster, install Metrics Server:

```powershell
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

For Kind, also run this patch:

```powershell
kubectl patch deployment metrics-server -n kube-system --type='json' -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

## Step 4: Deploy ShopWave

```powershell
kubectl apply -k .\k8s
```

## Step 5: Check Everything

```powershell
kubectl get all -n shopwave
kubectl get pvc -n shopwave
kubectl get hpa -n shopwave
```

Expected pods:

- `mongo-0`
- 2 backend pods
- 2 frontend pods

## Step 6: Open The App

For Kind with `kind-cluster.yaml`:

```powershell
curl http://127.0.0.1:30080
curl http://127.0.0.1:30080/api/health
```

Open in browser:

```text
http://127.0.0.1:30080
```

If your cluster does not expose NodePort, use port-forward:

```powershell
kubectl -n shopwave port-forward svc/frontend 30080:80
```

Then open:

```text
http://127.0.0.1:30080
```

## Step 7: Seed Sample Data

Run this once after the backend is ready:

```powershell
kubectl -n shopwave exec deploy/backend -- npm run seed
```

## Step 8: Test Auto-Healing

Delete one backend pod:

```powershell
$backendPod = kubectl -n shopwave get pod -l app.kubernetes.io/component=backend -o jsonpath="{.items[0].metadata.name}"
kubectl -n shopwave delete pod $backendPod
```

Watch Kubernetes recreate it:

```powershell
kubectl get pods -n shopwave -w
```

Do the same for frontend:

```powershell
$frontendPod = kubectl -n shopwave get pod -l app.kubernetes.io/component=frontend -o jsonpath="{.items[0].metadata.name}"
kubectl -n shopwave delete pod $frontendPod
kubectl get pods -n shopwave -w
```

## Step 9: Check Scaling

Watch the HPA:

```powershell
kubectl get hpa -n shopwave -w
```

You can also manually scale for a quick check:

```powershell
kubectl -n shopwave scale deploy/backend --replicas=3
kubectl -n shopwave scale deploy/frontend --replicas=3
kubectl get pods -n shopwave
```

HPA may later bring pods back to its configured range based on CPU.

## Update Image Names For Docker Hub

If you push images to Docker Hub or Jenkins builds them, update these image values:

- `k8s/20-backend.yaml`: `image: ecommerce-web-backend:latest`
- `k8s/30-frontend.yaml`: `image: ecommerce-web-frontend:latest`

Example:

```yaml
image: ritishhire/shopwave-backend:latest
image: ritishhire/shopwave-frontend:latest
```

After changing image names:

```powershell
kubectl apply -k .\k8s
kubectl -n shopwave rollout status deploy/backend
kubectl -n shopwave rollout status deploy/frontend
```

## Cleanup

Delete only ShopWave resources:

```powershell
kubectl delete namespace shopwave
```

Delete the Kind cluster:

```powershell
kind delete cluster --name shopwave-cluster
```
