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

# Restore dependencies for each project individually
RUN dotnet restore API/API.csproj
RUN dotnet restore Application/Application.csproj
RUN dotnet restore Persistence/Persistence.csproj
RUN dotnet restore Domain/Domain.csproj
RUN dotnet restore Infrastructure/Infrastructure.csproj

# Copy the rest of the source code
COPY . .

# Build and publish
RUN dotnet publish API/API.csproj -c Release -o out --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build-env /app/out .

# Environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# Entry point
ENTRYPOINT ["dotnet", "API.dll"]