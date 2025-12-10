using Application;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            // services.AddSwaggerGen();
            services.AddDbContext<DataContext>(options =>
{
    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

    string connStr;

    // Depending on if in development or production, use either FlyIO
    // connection string, or development connection string from env var.
    if (env == "Development")
    {
        // Use connection string from file.
        connStr = config.GetConnectionString("DefaultConnection");
    }
    else
    {
        // Use connection string provided at runtime by FlyIO.
        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        // Parse connection URL to connection string for Npgsql
        if (string.IsNullOrEmpty(connUrl))
        {
            throw new ArgumentNullException("DATABASE_URL", "DATABASE_URL environment variable cannot be null or empty.");
        }

        try
        {
            Console.WriteLine($"Original DATABASE_URL: {connUrl}");
            
            // Temporarily hardcoded connection string for testing
            connStr = "Server=reactivities-planner-db.internal;Port=5432;User Id=reactivities_planner;Password=MAmH8xWlllvA8kk;Database=reactivities_planner;SslMode=Disable;";
            Console.WriteLine($"Using hardcoded connection string: {connStr}");
            
            // TODO: Fix URL parsing later
            /*
            // Use Npgsql's built-in URL parsing
            var builder = new NpgsqlConnectionStringBuilder(connUrl);
            
            // Replace flycast with internal for the host
            if (builder.Host.Contains("flycast"))
            {
                builder.Host = builder.Host.Replace("flycast", "internal");
            }
            
            // Ensure SSL is disabled
            builder.SslMode = SslMode.Disable;
            
            connStr = builder.ToString();
            Console.WriteLine($"Final connection string: {connStr}");
            */
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to parse DATABASE_URL: {ex.Message}", ex);
        }
    }

    // Whether the connection string came from the local development configuration file
    // or from the environment variable from FlyIO, use it to set up your DbContext.
    options.UseNpgsql(connStr);
});
services.AddCors(opt =>
{
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
.AllowAnyMethod()
.AllowAnyHeader()
.AllowCredentials()
.WithOrigins("http://localhost:3001");
                });
            });
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly); 
            services.AddFluentValidationAutoValidation();
             services.AddValidatorsFromAssemblyContaining<Create>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<CloudinarySettings>(cloudinarySettings =>
            {
                cloudinarySettings.CloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME") ?? config["Cloudinary:CloudName"];
                cloudinarySettings.ApiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") ?? config["Cloudinary:ApiKey"];
                cloudinarySettings.ApiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") ?? config["Cloudinary:ApiSecret"];
            });
            services.AddSignalR();

            return services;
        }
    }
}