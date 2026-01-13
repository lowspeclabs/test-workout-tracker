FROM node:18-alpine

WORKDIR /app

# Copy package files (assuming single root deps, we verify what's needed)
# In a real monorepo we'd copy specific package.json.
# Here we just copy the server file and install express/sqlite3 if not present,
# or we assume we mount the root node_modules.
# For simplicity in this drop-in, let's just copy the server and assume dependencies are installed or we install them.

COPY package.json .
RUN npm install --production

COPY services/api/server.js .

EXPOSE 3001

CMD ["node", "server.js"]
