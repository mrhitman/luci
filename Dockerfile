FROM node:18-alpine
RUN mkdir /app
WORKDIR /app
COPY src src
COPY scripts scripts
COPY package.json ./
COPY package-lock.json ./
RUN npm i
RUN npm run build

FROM node:18-alpine
RUN mkdir /app
WORKDIR /app
COPY --from=0 /app/dist /app/dist
COPY package.json ./
COPY package-lock.json ./
RUN npm i --production --no-optional
CMD npm run start