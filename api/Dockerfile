FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
