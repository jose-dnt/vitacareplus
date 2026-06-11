export default class Consulta {

    constructor(id, paciente_id, profissional_id, paciente_nome, profissional_nome, data, horario, status, diagnostico, prescricao, observacoes) {
        this.id = id
        this.paciente_id = paciente_id
        this.profissional_id = profissional_id
        this.paciente_nome = paciente_nome
        this.profissional_nome = profissional_nome
        this.data = data
        this.horario = horario
        this.status = status
        this.diagnostico = diagnostico
        this.prescricao = prescricao
        this.observacoes = observacoes
    }

    static constructFromObject(object) {
        return new Consulta(
        object.id,
        object.paciente_id,  
        object.profissional_id,
        object.paciente_nome,
        object.profissional_nome,
        object.data,  
        object.horario,  
        object.status,  
        object.diagnostico,  
        object.prescricao,  
        object.observacoes  
        )
    }
}

