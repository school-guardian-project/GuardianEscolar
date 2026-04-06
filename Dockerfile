# Usar una imagen base de Node.js
FROM node:24-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación al contenedor
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm ci

COPY . .
# Compilar la aplicación
RUN npm run build --configuration=production

# Usar una imagen ligera de Nginx para deploy
FROM nginx:alpine

# Copiar la carpeta de salida de la aplicación al contenedor de Nginx
COPY --from=build /app/dist/school-guardian/browser /usr/share/nginx/html

# Exponer el puerto 80 para acceder a la aplicación
EXPOSE 80