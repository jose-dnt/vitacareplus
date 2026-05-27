const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('./db');

const pacienteRouter = require('./routes/pacienteRoutes');
const profissionalRouter = require('./routes/profissionalRoutes');

require("dotenv-safe").config();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;

// ======================
// Middleware JWT
// ======================
function verifyJWT(req, res, next){

    const token = req.cookies.token;

    if (!token){
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{

        if(err){
            return res.redirect('/login');
        }

        req.userId = decoded.id;
        next();
    });
}

// ======================
// Rotas públicas
// ======================
app.get('/', (req,res)=>{
    res.redirect('/login');
});

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname,'views','login.html'));
});

app.get('/register', (req,res)=>{
    res.sendFile(path.join(__dirname,'views','register.html'));
});

// ======================
// REGISTER
// ======================
app.post('/register', async (req,res)=>{

    const { nome, email, senha } = req.body;

    if(!nome || !email || !senha){
        return res.redirect('/register?erro=true');
    }

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results)=>{

        if(err){
            console.log(err);
            console.log(3)
            return res.redirect('/register?erro=true');
        }

        if(results.length > 0){
            console.log(2)
            return res.redirect('/register?erro=true');
        }

        const hash = await bcrypt.hash(senha, 10);

        db.query(
            "INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)",
            [crypto.randomUUID(), nome, email, hash],
            (err)=>{
                if(err){
                    console.log(err);
                    return res.redirect('/register?erro=true');
                }

                res.redirect('/login');
            }
        );
    });
});

// ======================
// LOGIN
// ======================
app.post('/login', (req,res)=>{

    const { email, senha } = req.body;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results)=>{

        if(err){
            console.log(err);
            return res.redirect('/login?erro=true');
        }

        if(results.length === 0){
            return res.redirect('/login?erro=true');
        }

        const usuario = results[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if(!senhaValida){
            return res.redirect('/login?erro=true');
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
    });
});

// ======================
// Página protegida
// ======================
app.get('/principal', verifyJWT, (req,res)=>{
    res.sendFile(path.join(__dirname,'views','principal.html'));
});

app.use("/pacientes", pacienteRouter);

app.use("/profissionais", profissionalRouter);

app.get('/me', verifyJWT, (req, res) => {

    db.query("SELECT nome, email FROM usuarios WHERE id = ?", [req.userId], (err, results) => {

        if(err || results.length === 0){

            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        res.json(results[0]);
    });
});

// ======================
// Logout
// ======================
app.get('/logout', (req,res)=>{
    res.clearCookie('token');
    res.redirect('/login');
});

// ======================
// Servidor
// ======================
app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});