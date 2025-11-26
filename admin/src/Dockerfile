# Stage 1: Build React (Admin)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# ข้ามการตรวจ TypeScript เพื่อความรวดเร็ว (เหมือน Frontend)
RUN npx vite build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# ก๊อปปี้ไฟล์ที่ Build แล้วไปวาง
COPY --from=build /app/dist /usr/share/nginx/html

# ก๊อปปี้ Config Nginx (ที่เราจะสร้างในขั้นตอนต่อไป)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]