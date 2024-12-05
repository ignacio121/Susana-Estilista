const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Inicialización de Express
const app = express();
app.use(express.json());

// Ruta de ejemplo
app.get('/', async (req, res) => {
    res.send('¡Bienvenido a mi API con Express y Supabase!');
});

// Ruta para obtener datos de Supabase
app.get('/data', async (req, res) => {
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) {
        return res.status(500).send(error.message);
    }
    res.json(data);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
