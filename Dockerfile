# Production Dockerfile

# Use the official Bun image as the base image
FROM oven/bun:latest as build

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb to leverage Docker caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --production

# Copy the rest of the codebase
COPY . .

# Build the app (optional, only if you're pre-building)
# RUN bun build src/app.js

# Expose the port that the app will run on
EXPOSE 3000

# Use the start script from package.json
CMD ["bun", "start"]
