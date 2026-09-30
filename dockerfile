# Step 1: Base image
FROM node:18-alpine

# Step 2: Set working directory inside container
WORKDIR /usr/src/app

# Step 3: Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Step 4: Install production dependencies
RUN npm install --only=production

# Step 5: Copy rest of application code
COPY . .

# Step 6: Define default environment variables
ENV APP_ENV=production \
    DB_HOST=localhost \
    APP_PORT=8080

# Step 7: Expose container port
EXPOSE 8080

# Step 8: Command to start the app
CMD ["npm", "start"]