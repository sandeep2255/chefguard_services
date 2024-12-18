# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 8082

# Command to run your application
CMD ["node", "index.js"]
