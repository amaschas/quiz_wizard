# -------- Define build-time constants --------
ARG NODE_VERSION=18
ARG ALPINE_VERSION=3.21

# -------- Stage 1: Builder --------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS dependencies

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

FROM dependencies AS build

# Copy the rest of the app code
COPY . .

RUN npm run build

FROM build AS release

# Run the server
CMD ["npm", "start"]