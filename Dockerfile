# FROM node:20-alpine

# WORKDIR /app

# COPY package.json .

# RUN npm install

# COPY . .

# RUN npm run build --verbose

# EXPOSE 3000

# CMD [ "npm", "run", "dev" ]

# Use the smallest possible base image
FROM alpine:latest

# Set a working directory
WORKDIR /app

# Add a simple "Hello, World!" file
RUN echo "Hello, World!" > hello.txt

# Print the file content when the container starts
CMD ["cat", "hello.txt"]