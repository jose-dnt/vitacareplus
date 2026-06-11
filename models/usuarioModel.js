export default class Usuario {

    constructor(id, nome, email, senha) {
        this.id = id
        this.nome = nome
        this.email = email
        this.senha = senha
    }

    static constructFromObject(object) {
        return new Usuario(
        object.id,
        object.nome,
        object.email,
        object.senha 
        )
    }
}

