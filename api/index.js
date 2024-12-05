import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('¡Servidor funcionando en Vercel!'));

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
