# Eventure Planner

This guide walks you through setting up and running the Eventure Planner application, both locally and with Docker.

## Prerequisites

### Required Versions
- **.NET SDK**: 10.0.0 or later
- **Node.js**: 14.0.0 or later
- **PostgreSQL**: 12.0 or later (for local development)

### Install Entity Framework Tools
```bash
dotnet tool install --global dotnet-ef
```

## Database Setup

### 1. PostgreSQL Configuration
Ensure PostgreSQL is running and create a database:
```sql
CREATE DATABASE reactivities;
```

### 2. Update Connection String
Edit `API/appsettings.Development.json` to match your PostgreSQL credentials:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost; Port=5432; User Id=postgres; Password=your_password; Database=reactivities"
  }
}
```

### 3. Database Migrations
#### Install EF Tools (if not already installed)
```bash
dotnet tool install --global dotnet-ef
```

#### Run Existing Migrations
```bash
cd API
dotnet ef database update
```

#### Create New Migration (if needed)
```bash
cd API
dotnet ef migrations add MigrationName
```

#### List All Migrations
```bash
cd API
dotnet ef migrations list
```

### 4. Database Seeding
The application automatically seeds the database on startup with sample data. This includes:
- Sample users with different roles
- Sample activities and events
- Sample categories and comments

**Note**: Seeding runs automatically when you start the application with `dotnet run`.

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

The server will automatically:
- Apply any pending database migrations
- Seed the database with initial data
- Start on `https://localhost:5001` (development)

### Optional: Running the Application with Docker

```bash
docker build -t dayosql/reactivities .

docker run --rm -it -p 8080:8080 dayosql/reactivities
```

## Project Structure

- **API/**: ASP.NET Core Web API backend
- **Application/**: Application logic and DTOs
- **Domain/**: Domain models and entities
- **Infrastructure/**: External services and infrastructure
- **Persistence/**: Database context and migrations
- **client-app/**: React frontend application

## Common Issues

### JWT Token Key Error
If you encounter a JWT token key error, ensure your `TokenKey` in `appsettings.Development.json` is at least 64 characters long for HMAC-SHA512 compatibility.

### PostgreSQL Connection Issues
- Verify PostgreSQL is running
- Check that the database `reactivities` exists
- Ensure the user credentials in your connection string are correct
- Make sure the user has proper permissions on the database

### Migration Issues
- Ensure EF Core tools are installed: `dotnet tool install --global dotnet-ef`
- Run migrations from the API directory
- Check that the connection string is properly configured
