# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar csproj primero (cache de dependencias)
COPY *.csproj ./
RUN dotnet restore

# Copiar todo y compilar
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: runtime (más liviana)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Copiar build
COPY --from=build /app/publish .

# Puerto interno del contenedor
EXPOSE 80

ENTRYPOINT ["dotnet", "backend.dll"]