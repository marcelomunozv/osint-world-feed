FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY next.config.js tailwind.config.ts postcss.config.js tsconfig.json ./
COPY public ./public
COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "dev"]
