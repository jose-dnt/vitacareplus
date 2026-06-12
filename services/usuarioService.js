import UsuarioDAO from '../dao/usuarioDAO.js';
import UsuarioModel from '../models/usuarioModel.js';
import { conectarBanco } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const db = await conectarBanco()
const DAO = new UsuarioDAO(db);

export default class UsuarioService {

    static async register(nome, email, senha) {

        if (!nome || !email || !senha) {
            throw new Error("Dados incompletos")
        }

        try {
            const usuarioExiste = await DAO.fetchUsuario(email);

            if (usuarioExiste) throw new Error("Usuário já existe");

            const hash = await bcrypt.hash(senha, 10);

            const usuario = new UsuarioModel(null, nome, email, hash);

            await DAO.criarUsuario(usuario);

        } catch (err) {
            console.log(err);
        }
    }

    static async login(email, senha) {

        if (!email || !senha) {
            throw new Error("Dados incompletos")
        }

        try {

            const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email])

            if (rows.length === 0) {
                throw new Error("Usuário não existe")
            }

            const usuario = UsuarioModel.constructFromObject(rows[0])

            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                throw new Error("Email ou senha inválidos")
            }

            const token = jwt.sign(
                { id: usuario.id },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            return token;

        } catch (err) {
            console.log(err);
        }
    }
}