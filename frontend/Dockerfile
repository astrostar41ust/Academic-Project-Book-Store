### STAGE 1: Build ###
# Use a Node.js image to build the Vite application.
# 'as build' names this stage, so we can refer to it later.
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock, etc.)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
# This will create a 'dist' folder with static assets
RUN npx vite build

### STAGE 2: Serve ###
# Use a lightweight Nginx image to serve the static files
FROM nginx:stable-alpine

# Copy the build output from the 'build' stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration. This is important for single-page applications.
# This file tells the mini-Nginx server inside this container how to behave.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow traffic to the Nginx server
EXPOSE 80

# The default Nginx command will start the server. No need for a custom CMD.

CMD ["nginx", "-g", "daemon off;"]