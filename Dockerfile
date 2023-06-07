FROM node:18.16.0-alpine3.18

WORKDIR /app

# Install the prerequisites to install the web3 and other ethereum npm packages
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
RUN apk add --update python3 krb5 krb5-libs gcc make g++ krb5-dev

# Copy the package.json file to the container
COPY ./package.json .

# Install the npm packages
RUN npm install

# Copy the rest of the files to the container
COPY . .

# set default command
CMD ["npm", "start"]