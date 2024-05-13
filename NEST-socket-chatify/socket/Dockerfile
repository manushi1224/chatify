# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env file
COPY .env ./

# Expose the port on which the app will run
EXPOSE 8900

# Start the server
CMD ["npm", "run", "start"]