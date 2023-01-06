FROM node:14-alpine as build

ARG install=1

WORKDIR /usr/src/app

ARG VUE_APP_API_HOST
ENV VUE_APP_API_HOST=${VUE_APP_API_HOST}

ARG ENV
ENV VUE_APP_ENV=${ENV}

COPY package*.json ./

RUN npm set registry "https://npm.s256.dev" &&\
				npm set //npm.s256.dev/:_authToken="/mQbVPu2/NRv5AF5GdUR4RD87gkH2PTgjZABLVo6LgE=" &&\
				npm install --no-audit --no-optional --ignore-scripts

COPY . .

RUN npm run build:prod

FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
