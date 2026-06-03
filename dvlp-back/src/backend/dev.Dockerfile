FROM mcr.microsoft.com/dotnet/sdk:10.0

WORKDIR /app

# Copiar proyecto y restaurar dependencias
COPY *.csproj ./
RUN dotnet restore

RUN dotnet tool install --global dotnet-ef

ENV PATH="${PATH}:/root/.dotnet/tools"

# Copiar el resto del código
COPY . .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development

CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080", "--no-launch-profile"]
