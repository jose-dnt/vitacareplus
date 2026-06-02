export default class Profissional {

    constructor(id, nome, crm, especialidade, telefone, email) {
        this.id = id
        this.nome = nome
        this.crm = crm
        this.especialidade = especialidade
        this.telefone = telefone
        this.email = email
    }

    static constructFromObject(object) {
        return new Profissional(
            object.id,
            object.nome,
            object.crm,
            object.especialidade,
            object.telefone,
            object.email,
        )
    }
}

