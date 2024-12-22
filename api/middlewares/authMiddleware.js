import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
    });
};

export const generateToken = (user) => {
    return jwt.sign({ id_usuario: user.id_usuario, rol: user.rol }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};
