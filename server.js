import express from 'express';
import path, { dirname } from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { conectarBanco } from './db.js';
const app = express();

const db = await conectarBanco();

import { router as pacienteRouter } from './routes/pacienteRoutes.js';
import { router as profissionalRouter } from './routes/profissionalRoutes.js';

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
// REGISTER
// ======================
app.post('/register', async (req, res) => {

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.redirect('/register?erro=true');
    }

    try {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (rows.length > 0) {
            throw new Error("Usuário já existe")
        }

        const hash = await bcrypt.hash(senha, 10);

        await db.query(
            "INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)",
            [crypto.randomUUID(), nome, email, hash],
        );

        res.redirect('/login');

    } catch (err) {
        console.log(err);
        return res.redirect('/register?erro=true');
    }
})
// ======================
// LOGIN
// ======================
app.post('/login', async (req, res) => {

    try {
        const { email, senha } = req.body;

        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email])

        if (rows.length === 0) {
            throw new Error("Usuário não existe")
        }

        const usuario = rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new Error("Senha inválida")
        }

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.redirect('/principal');

    } catch (err) {
        console.log(err);
        return res.redirect('/login?erro=true');
    }
});


// ======================
// Página protegida
// ======================
app.get('/principal', verifyJWT, (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'views', 'principal.html'));
});

app.use("/pacientes", pacienteRouter);
app.use("/profissionais", profissionalRouter);

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