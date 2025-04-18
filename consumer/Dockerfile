FROM node:latest

# Set working directory
WORKDIR /app

# Copy only lock and manifest first to optimize caching
COPY package.json package-lock.json  ./

# Install deps using pnpm
RUN npm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 3000

# Run the dev server
CMD ["npm", "run", "dev"]
