FROM node:18.14.2-alpine3.16

WORKDIR /app

COPY package*.json ./

# Install curl
RUN apk --no-cache add curl
RUN npm ci
RUN npm install pm2 -g

COPY dist ./dist

EXPOSE 8080

CMD ["pm2-runtime", "./dist/server.js"]