FROM node:20-alpine

# Add necessary system packages
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with specific flags to reduce memory usage
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy rest of the application
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application with memory limit for Node
ENV NODE_OPTIONS="--max_old_space_size=2048"
RUN npm run build

# Clean install production dependencies
RUN npm ci --prefer-offline --no-audit --no-fund --omit=dev

EXPOSE 3000

# Use next start for production
CMD ["npm", "run", "start"] 