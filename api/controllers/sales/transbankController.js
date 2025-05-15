import pkg from 'transbank-sdk';
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes, WebpayPlus } = pkg;

export const createTransaction = async (req, res) => {
    try {
        const { buyOrder, sessionId, amount, returnUrl } = req.body;

        const tx = new WebpayPlus.Transaction(new Options(
            IntegrationCommerceCodes.WEBPAY_PLUS,
            IntegrationApiKeys.WEBPAY,
            Environment.Integration
        ));

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

        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const response = await tx.commit(token);

        return res.status(201).json(response);
        
    } catch (error) {
        return res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
};

export const refundTransaction = async (req, res) => {
    try {
        const { token, amount } = req.body;

        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const response = await tx.refund(token, amount);
        
        return res.status(201).json(response);
        
    } catch (error) {
        return res.status(500).json({ message: 'Error reversing transaction', error: error.message });
    }
};