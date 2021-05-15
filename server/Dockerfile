FROM node:alpine

#setup mitmproxy
#RUN apk --no-cache add ca-certificates gcc g++ libffi-dev python3-dev musl-dev openssl-dev\
# libxslt-dev zlib-dev && pip3 install mitmproxy

#from https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
# Create app directory
WORKDIR /home/romeano

# Get deps
COPY package.json yarn.lock ./
RUN yarn

# Bundle app source
COPY . .
# needed for postinstall hook
RUN yarn

EXPOSE 4000
CMD [ "yarn", "start-prod-docker" ]
