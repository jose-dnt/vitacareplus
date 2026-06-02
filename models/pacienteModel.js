export default class Paciente {

    constructor(id, nome, cpf, data_nascimento, telefone, email, endereco) {
        this.id = id
        this.nome = nome
        this.cpf = cpf
        this.data_nascimento = data_nascimento
        this.telefone = telefone
        this.email = email
        this.endereco = endereco
    }

    static constructFromObject(object) {
        return new Paciente(
            object.id,
            object.nome,
            object.cpf,
            object.data_nascimento,
            object.telefone,
            object.email,
            object.endereco
        )
    }
}

