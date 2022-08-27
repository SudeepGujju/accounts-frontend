FROM node:fermium-alpine3.15 as build

WORKDIR /app/

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:stable-alpine as nginx

WORKDIR /usr/share/nginx/html/

COPY --from=build /app/build .

COPY --from=build /app/default.conf /etc/nginx/conf.d/

CMD nginx -g 'daemon off;'