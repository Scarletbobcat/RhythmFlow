FROM node:22-alpine AS development-dependencies-env

# Install PNPM
RUN npm install -g pnpm

WORKDIR /app
# Copy pnpm specific files first
COPY pnpm-lock.yaml package.json ./
# Install all dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

FROM node:22-alpine AS production-dependencies-env

# Install PNPM
RUN npm install -g pnpm

WORKDIR /app
# Copy pnpm specific files first
COPY pnpm-lock.yaml package.json ./
# Install production dependencies only
RUN pnpm install --prod

FROM node:22-alpine AS build-env

# Install PNPM
RUN npm install -g pnpm

WORKDIR /app
# Copy source files
COPY . .
# Copy node_modules from development dependencies stage
COPY --from=development-dependencies-env /app/node_modules ./node_modules
# Build the application
RUN pnpm run build

# Serve the app with NGINX
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/dist /usr/share/nginx/html
EXPOSE 80