FROM node:18

WORKDIR /app

COPY .env.example .env
COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4173

CMD ["yarn", "preview"]
