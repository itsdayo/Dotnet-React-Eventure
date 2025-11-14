using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate  _next;
                private readonly ILogger<ExceptionMiddleware>  _logger;
                        private readonly IHostEnvironment  _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware>logger, IHostEnvironment env)
        
        {
            _env = env;
            _logger = logger;
            _next= next;
        }

        public async Task InvokeAsync(HttpContext context){
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred: {Message}. Path: {Path}. StackTrace: {StackTrace}", 
                    ex.Message, context.Request.Path, ex.StackTrace);
                
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new AppException(context.Response.StatusCode, ex.Message); // Show message but not stack trace in production

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                var json = JsonSerializer.Serialize(response, options);
                
                _logger.LogInformation("Error response: {ErrorResponse}", json);
                await context.Response.WriteAsync(json);
            }
        }
    }
}