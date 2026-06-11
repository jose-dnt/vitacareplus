import UsuarioDAO from '../dao/usuarioDAO.js';
import { conectarBanco } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const db = await conectarBanco()
const DAO = new UsuarioDAO(db);

export default class UsuarioController {

    static async register(req, res) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.redirect('/register?erro=true');
        }

        try {
            const usuario = await DAO.fetchUsuario(email)

            console.log(usuario)

            if (usuario) throw new Error("Usuário já existe")

            const hash = await bcrypt.hash(senha, 10);

            await DAO.criarUsuario({
                nome, email, senha: hash
            })

            res.redirect('/login');

        } catch (err) {
            console.log(err);
            return res.redirect('/register?erro=true');
        }
    }

    static async login(req, res) {
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
    }
}