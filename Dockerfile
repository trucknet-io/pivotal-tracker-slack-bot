FROM node:10

WORKDIR /pivotal-tracker-slack-bot

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build:clean

# EXPOSE 8080
CMD [ "npm", "start" ]