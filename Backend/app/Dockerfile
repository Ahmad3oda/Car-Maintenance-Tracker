FROM node:20-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Include devDependencies so `nest build` can run even if NODE_ENV=production
RUN npm ci --include=dev

COPY . .

RUN npm run build \
  && npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]
