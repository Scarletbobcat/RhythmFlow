FROM node:22-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:22-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:22-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

# Switch to nginx for serving the static files
FROM nginx:alpine
# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built files from the build-env stage
COPY --from=build-env /app/dist /usr/share/nginx/html
EXPOSE 80