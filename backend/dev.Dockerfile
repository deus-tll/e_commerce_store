FROM node:24-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package files only
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application code
COPY . .

EXPOSE 3001

# The default command for the development image
CMD ["npm", "run", "dev"]