FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --verbose

EXPOSE 3000

CMD [ "npm", "run", "dev" ]