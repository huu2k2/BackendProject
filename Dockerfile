# Giai đoạn build
FROM node:lts-alpine as build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

COPY . .
RUN yarn 

# RUN yarn migration

RUN yarn generation

# RUN yarn deploy

# Expose cổng mà ứng dụng lắng nghe
EXPOSE 8989

# Chạy ứng dụng
CMD  yarn start
