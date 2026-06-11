import UsuarioModel from '../models/usuarioModel.js';
import crypto from 'crypto';

export default class UsuarioDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchUsuario(email) {
        const query = `SELECT * FROM usuarios WHERE email = ?`;

        try {
            const [rows] = await this.connection.query(query, [email]);
            const usuario = UsuarioModel.constructFromObject(rows[0]);
            return usuario;
        } catch (err) {
            console.log(err)
        }
    }

    async criarUsuario(data) {

        const usuario = UsuarioModel.constructFromObject(data)

        try {
            await this.connection.query(
                `INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)`,
                [crypto.randomUUID(), usuario.nome, usuario.email, usuario.senha]
            );
            return 'Dados foi inserido!';
        } catch (err) {
            console.log(err)
        }
    }
}
