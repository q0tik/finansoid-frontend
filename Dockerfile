# ======= BUILD STAGE =======
FROM node:23-alpine AS builder

WORKDIR /app

# Копируем исходники
COPY . .

# Устанавливаем зависимости
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci --include=dev

# Собираем проект
RUN npm run build


# ======= NGINX STAGE =======
FROM nginx:alpine

# 3. Устанавливаем пакет для подстановки переменных в конфиг
# (envsubst уже есть в образе nginx:alpine)

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

# 4. Магия для Railway: подставляем $PORT в конфиг Nginx перед запуском
CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
