import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import personalInfoRoutes from './routes/personalInfoRoutes.js';


const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('¡Servidor funcionando en Vercel!'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/informacion-personal',personalInfoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
