# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar csproj primero (cache de dependencias)
COPY *.csproj ./
RUN dotnet restore

# Copiar todo y compilar
COPY . ./


# Puerto interno del contenedor
EXPOSE 8080

CMD ["dotnet", "watch", "run"]