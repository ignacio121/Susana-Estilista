const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('¡Servidor funcionando en Vercel!'));

app.get('/data', async (req, res) => {
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) return res.status(500).send(error.message);
    res.json(data);
});

module.exports = app;
