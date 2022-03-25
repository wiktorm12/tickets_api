import dotenv from 'dotenv';
dotenv.config();

console.log("Run by developer mode");

import('./app.mjs').catch(console.error);