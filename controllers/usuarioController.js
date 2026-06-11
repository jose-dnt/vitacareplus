import UsuarioService from '../services/usuarioService.js';

export default class UsuarioController {

    static async register(req, res) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.redirect('/register?erro=true');
        }

        try {
            
            await UsuarioService.register(nome, email, senha);

            res.redirect('/login');

        } catch (err) {
            console.log(err);
            return res.redirect('/register?erro=true');
        }
    }

    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            const token = await UsuarioService.login(email, senha)

            if (!token) throw new Error("Erro ao fazer login");

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