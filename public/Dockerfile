FROM registry.s256.ru/devops/node-with-sass:14 as build

ARG install=1

WORKDIR /usr/src/app

ARG VUE_APP_API_HOST
ENV VUE_APP_API_HOST=${VUE_APP_API_HOST}

ARG ENV
ENV VUE_APP_ENV=${ENV}

ARG GTM_ID
ENV GTM_ID=${GTM_ID}


COPY . .

RUN npm set registry "https://npm.s256.dev" &&\
				npm set //npm.s256.dev/:_authToken="/mQbVPu2/NRv5AF5GdUR4RD87gkH2PTgjZABLVo6LgE=" &&\
				npm install --no-audit --no-optional --ignore-scripts --loglevel=error

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
