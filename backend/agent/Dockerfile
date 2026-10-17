# Build context: repository root (npm workspaces + the OpenAPI contracts in api/).
FROM node:22-alpine
WORKDIR /src
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/agent/package.json ./backend/agent/package.json
RUN npm ci -w backend/agent --include-workspace-root=false
COPY api ./api
COPY backend/agent ./backend/agent
RUN npm run generate -w backend/agent && npm test -w backend/agent
WORKDIR /src/backend/agent
EXPOSE 4100
CMD ["npx", "tsx", "src/server.ts"]
