# NestJS Real-Time Messaging Backend with End-to-End Encryption

This project is a NestJS backend for real-time messaging with end-to-end encryption using the Diffie–Hellman key exchange protocol and Prisma ORM.

## Features

- Real-time messaging system
- End-to-end encryption using Diffie–Hellman key exchange
- Secure storage and retrieval of messages using Prisma ORM
- Scalable and maintainable architecture with NestJS
- Auth and sessions system

## Requirements

- Node.js
- NestJS
- Prisma

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eduhdev12/echat
   ```

2. Install dependencies:

   ```bash
   cd echat
   npm install
   ```

3. Set up the database connection in `.env` file:

   ```env
   DATABASE_URL="your_database_url"
   CLIENT_ENDPOINT="frontend_path"
   JWT_SECRET="randomGenerated"
   DH_PUBLIC_KEY=
   DH_IV_KEY=
   ```

4. Run migrations to set up the database schema:

   ```bash
   npx prisma migrate dev
   ```

5. Start the server:

   ```bash
   npm run build && npm run start
   ```

## Usage

Once the server is running, configure the front-end with auth panel [here](https://github.com/eduhdev12/echat-web)

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- [Prisma](https://www.prisma.io/) - A modern database toolkit for TypeScript and Node.js.
