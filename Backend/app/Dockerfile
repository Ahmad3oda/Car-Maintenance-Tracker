# Use the official Node.js image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package files first (better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the NestJS port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]