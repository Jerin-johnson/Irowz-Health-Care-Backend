
# Build Stage

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files 
COPY package.json package-lock.json ./

# Install all dependencies (including dev deps for TS build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript → dist/
RUN npm run build




#  Production Runtime Stage

FROM node:20-alpine AS runtime

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy only package files again
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist


# Copy any runtime config files if needed
# COPY --from=builder /app/.env ./

# Expose backend port
EXPOSE 3000

# Default command (backend API)
CMD ["npm", "start"]
