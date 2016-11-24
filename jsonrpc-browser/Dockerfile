# taken from https://github.com/jbdelhommeau/docker-yarn/blob/master/Dockerfile
# and adjusted node version
FROM node:7.0.0

ENV YARN_VERSION 0.17.8

RUN npm install --global yarn@$YARN_VERSION
RUN yarn -V

# RUN ls -lhAGL
COPY ./ /build/
WORKDIR /build/
RUN ls -lhAGL

RUN npm cache clean
RUN yarn cache clean

CMD [ "yarn", "install" ]


# CMD /bin/bash