import crypto from 'crypto';

export default class UsuarioDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchUsuario(email) {
        try {
            const [rows] = await this.connection.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
            return rows[0];
        } catch (err) {
            console.log(err)
        }
    }

    async criarUsuario(usuario) {

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
