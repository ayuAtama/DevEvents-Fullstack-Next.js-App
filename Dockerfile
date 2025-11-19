# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
# COPY package*.json ./
# OR if using pnpm
COPY pnpm-lock.yaml* ./
COPY package.json ./

# Install dependencies
# RUN npm install
# Or if using pnpm:
RUN npm install -g pnpm && pnpm install

# Copy the rest of your app
COPY . .

# Build the Next.js app
# RUN npm run build
RUN pnpm build

# Stage 2: Run the built app
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production

# Copy built output and node_modules from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the default Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
