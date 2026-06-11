export default class Disponibilidade {

    constructor(id, profissional_id, dia_semana, hora_inicio, hora_fim) {
        this.id = id
        this.profissional_id = profissional_id
        this.dia_semana = dia_semana
        this.hora_inicio = hora_inicio
        this.hora_fim = hora_fim
    }

    static constructFromObject(object) {
        return new Disponibilidade(
        object.id,
        object.profissional_id,  
        object.dia_semana,  
        object.hora_inicio,  
        object.hora_fim,  
        )
    }
}

