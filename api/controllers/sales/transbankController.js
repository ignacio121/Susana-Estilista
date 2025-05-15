import pkg from 'transbank-sdk';
import dotenv from 'dotenv';

dotenv.config();

const { Options, WebpayPlus, Environment } = pkg;

// Define el entorno según la variable de entorno
const environment = process.env.ENVIRONMENT === 'Produccion' ? Environment.Production : Environment.Integration;

// Define las opciones para Webpay
const options = new Options(
    process.env.COMMERCE_CODE,
    process.env.API_KEY_SECRET,
    environment
);

export const createTransaction = async (req, res) => {
    try {
        const { buyOrder, sessionId, amount, returnUrl } = req.body;

        const tx = new WebpayPlus.Transaction(options);

        const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

        return res.status(201).json(response);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
};

export const getTransaction = async (req, res) => {
    try {
        const { token } = req.body;

        const tx = new WebpayPlus.Transaction(options);
        const response = await tx.commit(token);

        return res.status(201).json(response);
        
    } catch (error) {
        return res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
};

export const refundTransaction = async (req, res) => {
    try {
        const { token, amount } = req.body;

        const tx = new WebpayPlus.Transaction(options);
        const response = await tx.refund(token, amount);
        
        return res.status(201).json(response);
        
    } catch (error) {
        return res.status(500).json({ message: 'Error reversing transaction', error: error.message });
    }
};