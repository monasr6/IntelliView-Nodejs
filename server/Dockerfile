FROM node

# Create app directory
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
