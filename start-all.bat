@echo off
echo Starting Smart Planning System...

start "API Gateway (Port 3000)" cmd /k "cd api-gateway && npm run start:dev"
start "User Service (Port 3001)" cmd /k "cd user-service && npm run start:dev"
start "Appointment Service (Port 3002)" cmd /k "cd appointment-service && npm run start:dev"
start "Notification Service (Port 3003)" cmd /k "cd notification-service && npm run start:dev"
start "Audit Service (Port 3004)" cmd /k "cd audit-service && npm run start:dev"
start "Analytics Service (Port 3005)" cmd /k "cd analytics-service && npm run start:dev"
start "Storage Service (Port 3006)" cmd /k "cd storage-service && npm run start:dev"

echo Waiting for backend services to initialize...
timeout /t 5

start "Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo All services started!
