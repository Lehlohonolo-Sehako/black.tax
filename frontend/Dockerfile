# Build context: repository root (npm workspaces + api/core.yaml for the generated client).
FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/agent/package.json ./backend/agent/package.json
RUN npm ci -w frontend --include-workspace-root=false
COPY api ./api
COPY frontend ./frontend
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ARG NEXT_PUBLIC_DEMO=false
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_DEMO=$NEXT_PUBLIC_DEMO
RUN apk add --no-cache python3 && npm run generate -w frontend && npm run build -w frontend

FROM node:22-alpine
WORKDIR /src
COPY --from=build /src /src
WORKDIR /src/frontend
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
