#  Eventure Planner

This guide walks you through setting up and running the  Eventure Planner application, both locally and with Docker.

## Getting Started

### 1. Start the Client Application

To start the client application:

```bash
cd client-app
npm start
```

### 2. Start the Server
```bash
cd API
dotnet run
```

### Optional: Running the Application with Docker

```bash
docker build -t dayosql/reactivities .

docker run --rm -it -p 8080:8080 dayosql/reactivities
```
