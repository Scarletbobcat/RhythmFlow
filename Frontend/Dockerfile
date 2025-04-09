
FROM node:23 AS build

# Define build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_ANON_KEY

# Set environment variables during the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_ANON_KEY=$VITE_ANON_KEY

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:23-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm i -g serve

EXPOSE 5173

CMD [ "serve", "-s", "dist", "-l", "5173" ] 
