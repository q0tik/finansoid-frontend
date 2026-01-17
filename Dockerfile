# ======= BUILD STAGE =======
FROM node:23-alpine AS builder

WORKDIR /app

# Копируем исходники
COPY . .

ARG CONF_PATH
ENV CONF_PATH=${CONF_PATH}
RUN echo "BUILD CONF_PATH=$CONF_PATH"

# Устанавливаем зависимости
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci --include=dev

# Собираем проект
RUN npm run build


# ======= NGINX STAGE =======
FROM nginx:alpine

# Удаляем дефолтный конфиг
RUN rm -rf /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем сборку Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Чтобы Nginx работал в фореграунде
CMD ["nginx", "-g", "daemon off;"]
