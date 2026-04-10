FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY src/backend/backend.csproj src/backend/
RUN dotnet restore src/backend/backend.csproj

COPY . .
WORKDIR /app/src/backend

RUN dotnet build backend.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish backend.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "backend.dll"]