const WebpayPlus = require("transbank-sdk").WebpayPlus; // CommonJS

import dotenv from 'dotenv';

dotenv.config();

export const webpayPlus = new WebpayPlus.Transaction();
webpayPlus.options = {
    commerceCode: process.env.COMMERCE_CODE, // Código de comercio de prueba
    apiKey: process.env.API_KEY_SECRET, // Llave de prueba
    environment: 'INTEGRACION' // Cambiar a 'PRODUCCION' para ambiente real
};