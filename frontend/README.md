# CV Evaluation System Frontend

React + TypeScript + Vite frontend for the CV Evaluation System.

## Local development

```powershell
npm install
npm run dev
```

The frontend expects the backend API at:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

The UI uses backend auth endpoints and sends a bearer token when calling `/api/analyze`.