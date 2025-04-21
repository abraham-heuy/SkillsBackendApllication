# Step 1: Use the official Node.js base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the port your app will run on
EXPOSE 3000

# Step 7: Start your application
CMD ["npm", "server"]
