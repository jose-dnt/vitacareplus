async function carregarPacientes() {
    try {
        const response = await fetch('/pacientes/fetchData?start=0&');
        const pacientes = await response.json();

        console.log(pacientes)

        const selectPaciente = document.getElementById('paciente');

        selectPaciente.innerHTML =
            '<option value="">Selecione um paciente</option>';

        pacientes.forEach(paciente => {
            selectPaciente.innerHTML += `
                <option value="${paciente.id}">
                    ${paciente.nome}
                </option>
            `;
        });

    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

async function carregarProfissionais() {
    try {
        const response = await fetch('/profissionais/fetchData');
        const profissionais = await response.json();

        const selectProfissional = document.getElementById('profissional');

        selectProfissional.innerHTML =
            '<option value="">Selecione um profissional</option>';

        profissionais.forEach(profissional => {
            selectProfissional.innerHTML += `
                <option value="${profissional.id}">
                    ${profissional.nome} - ${profissional.especialidade}
                </option>
            `;
        });

    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
    }
}

$(document).ready(function () {

    const modal = $('#modalConsulta');

    const tabela = $('#tabelaConsultas').DataTable({

        processing: true,
        serverSide: true,
        ordering: false,

        ajax: {
            url: '/consultas/fetchData',
            type: 'GET'
        },

        columns: [
            {
                data: null,
                render: function (data) {
                    return `
                        <a href="#" class="ver-paciente"
                           data-id="${data.paciente_id}">
                            ${data.paciente_nome}
                        </a>
                    `;
                }
            },
            {
                data: null,
                render: function (data) {
                    return `
                        <a href="#" class="ver-profissional"
                           data-id="${data.profissional_id}">
                            ${data.profissional_nome}
                        </a>
                    `;
                }
            },
            {
                data: 'data',
                render: function (data) {

                    if (!data) return '';

                    return new Date(data)
                        .toLocaleDateString('pt-BR');
                }
            },
            { data: 'horario' },
            { data: 'status' },
            {
                data: 'id',
                render: function (id) {

                    return `
                        <button class="btn-editar" data-id="${id}">
                            Editar
                        </button>
        
                        <button class="btn-excluir" data-id="${id}">
                            Excluir
                        </button>
                    `;
                }
            }
        ],

        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
        }

    });

    /*
    |--------------------------------------------------------------------------
    | VISUALIZAR PACIENTE
    |--------------------------------------------------------------------------
    */

    $(document).on('click', '.ver-paciente', async function (e) {

        e.preventDefault();

        const id = $(this).data('id');

        try {

            const response = await fetch(`/pacientes/fetchData/${id}`);
            const paciente = await response.json();

            const dataNascimento = paciente.data_nascimento
                ? paciente.data_nascimento
                    .split('T')[0]
                    .split('-')
                    .reverse()
                    .join('/')
                : '';

            $('#viewPacienteNome').val(paciente.nome || '');
            $('#viewPacienteCpf').val(paciente.cpf || '');
            $('#viewPacienteNascimento').val(dataNascimento);
            $('#viewPacienteTelefone').val(paciente.telefone || '');
            $('#viewPacienteEmail').val(paciente.email || '');
            $('#viewPacienteEndereco').val(paciente.endereco || '');
            $('#modalPaciente').show();

        } catch (err) {

            console.error(err);
            alert('Erro ao carregar paciente.');

        }

    });


    /*
    |--------------------------------------------------------------------------
    | VISUALIZAR PROFISSIONAL
    |--------------------------------------------------------------------------
    */

    $(document).on('click', '.ver-profissional', async function (e) {

        e.preventDefault();

        const id = $(this).data('id');

        try {

            const response = await fetch(`/profissionais/fetchData/${id}`);
            const profissional = await response.json();

            $('#viewProfissionalNome').val(profissional.nome || '');
            $('#viewProfissionalCrm').val(profissional.crm || '');
            $('#viewProfissionalEspecialidade').val(profissional.especialidade || '');
            $('#viewProfissionalTelefone').val(profissional.telefone || '');
            $('#viewProfissionalEmail').val(profissional.email || '');

            $('#modalProfissional').show();

        } catch (err) {

            console.error(err);
            alert('Erro ao carregar profissional.');

        }

    });

    /*
    |--------------------------------------------------------------------------
    | FECHAR MODAL PACIENTE
    |--------------------------------------------------------------------------
    */

    $('.fecharPaciente').on('click', function () {
        $('#modalPaciente').hide();
    });

    /*
    |--------------------------------------------------------------------------
    | FECHAR MODAL PROFISSIONAL
    |--------------------------------------------------------------------------
    */

    $('.fecharProfissional').on('click', function () {
        $('#modalProfissional').hide();
    });

    $(window).on('click', function (e) {

        if ($(e.target).is('#modalPaciente')) {
            $('#modalPaciente').hide();
        }

        if ($(e.target).is('#modalProfissional')) {
            $('#modalProfissional').hide();
        }

    });

    /*
    |--------------------------------------------------------------------------
    | NOVA CONSULTA
    |--------------------------------------------------------------------------
    */

    $('#btnNovaConsulta').on('click', async function () {

        try {

            await carregarPacientes();
            await carregarProfissionais();

            $('.modal-titulo').text('Nova Consulta');

            $('#formConsulta')[0].reset();

            $('#id').val('');

            modal.show();

        } catch (err) {

            console.error(err);
            alert('Erro ao carregar dados.');

        }

    });

    /*
    |--------------------------------------------------------------------------
    | FECHAR MODAL
    |--------------------------------------------------------------------------
    */

    $('.fechar').on('click', function () {
        modal.hide();
    });

    $(window).on('click', function (e) {

        if ($(e.target).is('#modalConsulta')) {
            modal.hide();
        }

    });

    /*
    |--------------------------------------------------------------------------
    | EDITAR
    |--------------------------------------------------------------------------
    */

    $(document).on('click', '.btn-editar', async function () {

        const id = $(this).data('id');

        try {

            const response = await fetch(`/consultas/fetchData/${id}`);
            const consulta = await response.json();

            await carregarPacientes();
            await carregarProfissionais();

            $('.modal-titulo').text('Editar Consulta');

            $('#id').val(consulta.id);

            $('#paciente').val(consulta.paciente_id);
            $('#profissional').val(consulta.profissional_id);

            if (consulta.data) {
                $('#data').val(
                    consulta.data.split('T')[0]
                );
            }

            $('#horario').val(consulta.horario);
            $('#status').val(consulta.status);

            modal.show();

        } catch (err) {

            console.error(err);
            alert('Erro ao carregar consulta.');

        }

    });

    /*
    |--------------------------------------------------------------------------
    | SALVAR (INSERT / EDIT)
    |--------------------------------------------------------------------------
    */

    $('#formConsulta').on('submit', async function (e) {

        e.preventDefault();

        const action =
            $('#id').val() ? 'Edit' : 'Insert';

        const payload = {
            action,
            id: $('#id').val(),
            paciente_id: $('#paciente').val(),
            profissional_id: $('#profissional').val(),
            data: $('#data').val(),
            horario: $('#horario').val(),
            status: $('#status').val()
        };

        try {

            const response = await fetch('/consultas/submitData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.text();

            alert(result);

            modal.hide();

            tabela.ajax.reload(null, false);

        } catch (err) {

            console.error(err);
            alert('Erro ao salvar.');

        }

    });

    /*
    |--------------------------------------------------------------------------
    | EXCLUIR
    |--------------------------------------------------------------------------
    */

    $(document).on('click', '.btn-excluir', async function () {

        const id = $(this).data('id');

        const confirmar = confirm(
            'Deseja realmente excluir esta consulta?'
        );

        if (!confirmar) return;

        try {

            const response = await fetch('/consultas/submitData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'Delete',
                    id
                })
            });

            const result = await response.text();

            alert(result);

            tabela.ajax.reload(null, false);

        } catch (err) {

            console.error(err);
            alert('Erro ao excluir.');

        }

    });

});