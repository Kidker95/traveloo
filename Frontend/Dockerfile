# Install OS
FROM node:20-alpine3.20

# Create /app
WORKDIR /app

# Copy only package.json: 
COPY package.json /app

# React environment variables: 
ENV REACT_APP_ENVIRONMENT=development
ENV REACT_APP_BASE_URL=http://localhost:4100/

# Install node_modules:
RUN npm i 

# Copy our app from the current development folder (.) into image app folder (/app): 
COPY . /app


# Which terminal command will run our app inside the container when container start:
ENTRYPOINT npm start

