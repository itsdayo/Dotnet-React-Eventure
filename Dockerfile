# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Expose port
EXPOSE 8080

# Copy solution file first
COPY Eventure.sln .

# Copy all project files (ensure paths match .sln exactly!)
COPY API/API.csproj API/
COPY Application/Application.csproj Application/
COPY Persistence/Persistence.csproj Persistence/
COPY Domain/Domain.csproj Domain/
COPY Infrastructure/Infrastructure.csproj Infrastructure/

# Restore dependencies using the solution file
RUN dotnet restore Eventure.sln

# Copy the rest of the source code
COPY . .

# Build and publish
RUN dotnet publish -c Release -o out --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build-env /app/out .

# Environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# Entry point
ENTRYPOINT ["dotnet", "API.dll"]