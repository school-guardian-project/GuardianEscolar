using backend.API.Middleware;
using backend.Infrastructure.Persistence.Context;
using backend.Shared.Infrastructure.InjectionDependency;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
using Microsoft.IdentityModel.Tokens;
>>>>>>> origin/develop
using Microsoft.OpenApi.Models;
>>>>>>> develop

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
<<<<<<< HEAD
builder.Services.AddOpenApi();

=======
>>>>>>> develop
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddApplicationServices();

// Arreglo de strings y origenes permitidos
var allowedOrigins = builder.Configuration.GetValue<string>("AllowedOrigins")!.Split(",");

<<<<<<< HEAD

=======
// Database
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql("name=DefaultConnection"));

// Cors
>>>>>>> develop
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // AllowAnyHeader() permitir cualquier encabezado en las solicitudes
        // AllowAnyMethod() permitir cualuquier metodo/peticiones HTTP
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();

    });
});

<<<<<<< HEAD
<<<<<<< HEAD
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql("name=Conection"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

=======
builder.Services.AddEndpointsApiExplorer();
=======
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
>>>>>>> origin/develop

builder.Services.AddEndpointsApiExplorer();

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

        // options.RoutePrefix = string.Empty;
    });
}

app.UseMiddleware<ExceptionsMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// Swagger
>>>>>>> develop
app.UseHttpsRedirection();

// Activando Cors en toda la aplicacion
app.UseCors();

app.MapControllers();

app.Run();
