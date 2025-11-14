FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app
EXPOSE 8080


# copy .csproj and restore as distinct layers
COPY "Eventure.sln" "Eventure.sln"
COPY "API/API.csproj" "API/API.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Persistence/Persistence.csproj" "Persistence/Persistence.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

RUN dotnet restore "Eventure.sln"

# copy everything else build
COPY . .
WORKDIR /app
RUN dotnet publish -c Release -o out

#build a runtine image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
# Set environment variables for fly.io
ENV ASPNETCORE_ENVIRONMENT="Production"
ENV ASPNETCORE_URLS="http://+:8080"
ENTRYPOINT [ "dotnet", "API.dll" ]
