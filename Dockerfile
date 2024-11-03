# Usa una imagen Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y yarn.lock (o package-lock.json)
COPY package.json yarn.lock ./

# Instala las dependencias, incluyendo devDependencies
RUN yarn install --frozen-lockfile

# Copia el resto de la aplicación
COPY . .

# Comando para construir la aplicación
RUN yarn build

# Exponer el puerto que usará la aplicación
EXPOSE 8080

# Comando para iniciar la aplicación en modo de producción
CMD ["yarn", "start"]
