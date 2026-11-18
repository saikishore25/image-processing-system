import dotenv from "dotenv/config"

const envFile = process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

console.log(process.env.NODE_ENV);
console.log(process.env.CLIENT_URL);