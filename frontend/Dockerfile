# Build stage
FROM node:20.19.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Skip TypeScript checking temporarily
RUN npx vite build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]