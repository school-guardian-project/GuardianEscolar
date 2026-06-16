using backend.Shared.Exceptions;
using backend.Shared.Responses;
using System.Net;
using System.Text.Json;

namespace backend.API.Middleware
{
    public class ExceptionsMiddleware
    {
        public readonly RequestDelegate _next;

        public ExceptionsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleException(context, ex);
            }
        }

        private static async Task HandleException(HttpContext context, Exception exception)
        {
            HttpStatusCode statusCode;

            switch (exception)
            {
                case UnauthorizedException:
                    statusCode = HttpStatusCode.Unauthorized;
                    break;

                case BadRequestException:
                    statusCode = HttpStatusCode.BadRequest;
                    break;

                default:
                    statusCode =
                        HttpStatusCode.InternalServerError;
                    break;
            }
            var response = new ApiResponse<object>
            {
                Success = false,
                Message = exception.InnerException?.Message ?? exception.Message
            };

            context.Response.ContentType =
                "application/json";

            context.Response.StatusCode =
                (int) statusCode;

            var json =
                JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}
