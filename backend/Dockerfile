FROM node:20-alpine

WORKDIR /app

# Install dependencies for healthcheck
RUN apk add --no-cache wget

# Copy package files
COPY package.json ./

# Install production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy source code
COPY src ./src

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Create logs directory and non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    mkdir -p /app/logs && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]


