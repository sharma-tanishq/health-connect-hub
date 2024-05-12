FROM --platform=linux/amd64 node:20.10.0-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM --platform=linux/amd64 node:20.10.0-alpine
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]