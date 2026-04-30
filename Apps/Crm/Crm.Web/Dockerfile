# Build context: repo root (PlatformSuite/)
FROM node:22-alpine AS build
WORKDIR /repo

ARG VITE_API_BASE_URL=/api
ARG VITE_AZURE_CLIENT_ID
ARG VITE_AZURE_TENANT_ID
ARG VITE_ENVIRONMENT=production

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID
ENV VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT

RUN npm i -g pnpm@9.15.0

# Manifest dosyalarını önce kopyala (cache layer)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY Platform/Platform.Web/package.json Platform/Platform.Web/package.json
COPY Apps/Crm/Crm.Web/package.json Apps/Crm/Crm.Web/package.json

RUN pnpm install --frozen-lockfile --filter @app/crm-web...

# Kaynak kodu kopyala
COPY Platform/Platform.Web Platform/Platform.Web
COPY Apps/Crm/Crm.Web Apps/Crm/Crm.Web

RUN pnpm --filter @app/crm-web build

FROM nginx:1.27-alpine AS final
COPY --from=build /repo/Apps/Crm/Crm.Web/dist /usr/share/nginx/html
COPY Apps/Crm/Crm.Web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
