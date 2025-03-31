import express from 'express';
import cors from 'cors';
import userRoutes from './routes/dates/userRoutes.js';
import authRoutes from './routes/dates/authRoutes.js';
import personalInfoRoutes from './routes/dates/personalInfoRoutes.js';

import citeRoutes from './routes/dates/citeRouters.js'
import serviceRouter from './routes/dates/serviceRoutes.js';
import scheduleRouter from './routes/dates/scheduleRoutes.js';
import blockRouter from './routes/dates/blockRoutes.js';

import salesRouter from './routes/sales/salesRoutes.js';
import productsRouter from './routes/sales/productsRoutes.js';
import cartRouter from './routes/sales/cartRoutes.js';
import favoriteRouter from './routes/sales/favoritesRoutes.js';
import commentsRouter from './routes/sales/commentsRoutes.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*", // Perminte todos los origenes
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Encabezados permitidos
}));

app.get('/', (req, res) => res.send('¡Servidor funcionando en Vercel!'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/informacion-personal',personalInfoRoutes);

app.use('/citas',citeRoutes);
app.use('/servicios',serviceRouter);
app.use('/horarios',scheduleRouter);
app.use('/bloqueos',blockRouter);

app.use('/ventas', salesRouter);
app.use('/productos', productsRouter);
app.use('/carrito', cartRouter);
app.use('/favoritos', favoriteRouter);
app.use('/comentarios', commentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
