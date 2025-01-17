# Stage 1: Build stage
FROM node:20-slim AS base

FROM base AS builder

WORKDIR /app

# Copy package files
COPY package*.json package-lock.json* ./

# Cài đặt tất cả dependencies (bao gồm devDependencies) để build
RUN npm ci

# Copy source code, bao gồm cả next.config.js
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Không cần copy node_modules vì ta sẽ cài đặt lại
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Chỉ cài đặt dependencies production
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Sửa format ENV theo warning
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]