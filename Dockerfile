# Stage 1: Build the React Application
FROM node:20 AS build

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build the Vite frontend
COPY . .
RUN npm run build

# Stage 2: Setup the production environment
FROM node:20

WORKDIR /app

# Copy only package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy the Express backend code
COPY server.js ./
COPY backend ./backend

# Copy the compiled React build from Stage 1
COPY --from=build /app/dist ./dist

# Expose port 8080 (Cloud Run default)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
