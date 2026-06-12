import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { conectarBanco } from './db.js';
const app = express();

const db = await conectarBanco();

import { router as pacienteRouter } from './routes/pacienteRoutes.js';
import { router as profissionalRouter } from './routes/profissionalRoutes.js';
import { router as consultaRouter } from './routes/consultaRoutes.js';
import { router as usuarioRouter } from './routes/usuarioRoutes.js';


import dotenv from 'dotenv-safe';
dotenv.config()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

const PORT = 3000;

// ======================
// Middleware JWT
// ======================
function verifyJWT(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.redirect('/login');
        }

        req.userId = decoded.id;
        next();
    });
}

// ======================
// Rotas públicas
// ======================
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'views', 'register.html'));
});

// ======================
// Página protegida
// ======================
app.get('/principal', verifyJWT, (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'views', 'principal.html'));
});

app.use("/pacientes", pacienteRouter);
app.use("/profissionais", profissionalRouter);
app.use("/consultas", consultaRouter);
app.use("/auth", usuarioRouter);

app.get('/me', verifyJWT, async (req, res) => {

    const [rows] = await db.query("SELECT nome, email FROM usuarios WHERE id = ?", [req.userId]);

    if (rows.length === 0) {

        return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    res.json(rows[0]);
});

// ======================
// Logout
// ======================
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// ======================
// Servidor
// ======================
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});