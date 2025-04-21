# Step 1: Use Node.js base image
FROM node:16

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Install nodemon globally
RUN npm install -g nodemon

# Step 4: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the port
EXPOSE 3000

# Step 7: Run the server script using nodemon
CMD ["npm", "run", "server"]
