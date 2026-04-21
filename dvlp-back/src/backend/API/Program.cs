using backend.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers();

// Arreglo de strings y origenes permitidos
var allowedOrigins = builder.Configuration.GetValue<string>("AllowedOrigins")!.Split(",");


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // AllowAnyHeader() permitir cualquier encabezado en las solicitudes
        // AllowAnyMethod() permitir cualuquier metodo/peticiones HTTP
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();

    });
});

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql("name=Conection"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Activando Cors en toda la aplicacion
app.UseCors();

app.MapControllers();

app.Run();
