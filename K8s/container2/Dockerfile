FROM node:slim
WORKDIR /app
COPY package.json .
RUN npm install     
COPY . .
EXPOSE 80
CMD node container_2.js