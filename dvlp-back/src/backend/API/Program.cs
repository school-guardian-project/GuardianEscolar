using backend.API.Middleware;
using backend.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();

// Arreglo de strings y origenes permitidos
var allowedOrigins = builder.Configuration.GetValue<string>("AllowedOrigins")!.Split(",");

// Database
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql("name=DefaultConnection"));

// Cors
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // AllowAnyHeader() permitir cualquier encabezado en las solicitudes
        // AllowAnyMethod() permitir cualuquier metodo/peticiones HTTP
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();

    });
});

// Jwt
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    // Esta parte queda pendiente, se debe cambiar antes de poner en produccion, porque debe requerir  HTTPS
    // Para pruebas y desarrollo se desactivara la necesidad de HTTPS, pero en produccion se debe activar
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
        ValidAudience = builder.Configuration["JwtConfig:Audience"],
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Backend API",
        Version = "v1",
        Description = "API construida con ASP.NET Core"
    });
});


var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "Backend API v1");

        options.RoutePrefix = string.Empty;
    });
}

app.UseMiddleware<ExceptionsMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// Swagger
app.UseHttpsRedirection();

// Activando Cors en toda la aplicacion
app.UseCors();

app.MapControllers();

app.Run();
