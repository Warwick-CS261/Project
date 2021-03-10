FROM openjdk:17-jdk-alpine3.12
RUN apk update


RUN apk add \
  --no-cache \
  --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
  --repository http://dl-cdn.alpinelinux.org/alpine/community/main \
  --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
  gradle=6.8.3-r0 

COPY ./Project .

WORKDIR /Project


RUN gradle build




ENV PORT=6969

EXPOSE 6969


CMD ["gradle", "run"]