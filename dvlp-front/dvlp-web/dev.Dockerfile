FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar solo package.json para cachear dependencias
COPY package*.json ./

# Instalar dependencias (queda cacheado si no cambian)
RUN npm install

# Instalar Angular CLI global
RUN npm install -g @angular/cli

# Copiar el resto del proyecto
COPY . .

# Comando por defecto
CMD ["ng", "serve", "--host", "0.0.0.0"]