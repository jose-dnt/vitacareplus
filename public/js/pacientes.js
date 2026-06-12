$(document).ready(function () {

    const modal = $('#modalPaciente');

    const tabela = $('#tabelaPacientes').DataTable({

        processing: true,
        serverSide: true,
        ordering: false,

        ajax: {
            url: '/pacientes/fetchData',
            type: 'GET'
        },

        columns: [
            { data: 'nome' },
            { data: 'cpf' },
            {
                data: 'data_nascimento',
                render: function (data) {

                    if (!data) return '';

                    return new Date(data)
                        .toLocaleDateString('pt-BR');
                }
            },
            { data: 'telefone' },
            { data: 'email' },
            { data: 'endereco' },
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
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
        }

    });

    /*
    |--------------------------------------------------------------------------
    | NOVO PACIENTE
    |--------------------------------------------------------------------------
    */

    $('#btnNovoPaciente').on('click', function () {

        $('#modalTitulo').text('Novo Paciente');

        $('#formPaciente')[0].reset();

        $('#id').val('');

        modal.show();
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

        if ($(e.target).is('#modalPaciente')) {
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

            const response = await fetch(`/pacientes/fetchData/${id}`);

            const paciente = await response.json();

            $('#modalTitulo').text('Editar Paciente');

            $('#id').val(paciente.id);
            $('#nome').val(paciente.nome);
            $('#cpf').val(paciente.cpf);
            $('#telefone').val(paciente.telefone);
            $('#email').val(paciente.email);
            $('#endereco').val(paciente.endereco);

            if (paciente.data_nascimento) {

                $('#data_nascimento').val(
                    paciente.data_nascimento.split('T')[0]
                );

            }

            modal.show();

        } catch (err) {

            console.error(err);
            alert('Erro ao carregar paciente.');

        }

    });

    /*
    |--------------------------------------------------------------------------
    | SALVAR (INSERT / EDIT)
    |--------------------------------------------------------------------------
    */

    $('#formPaciente').on('submit', async function (e) {

        e.preventDefault();

        const action =
            $('#id').val() ? 'Edit' : 'Insert';

        const payload = {
            action,
            id: $('#id').val(),
            nome: $('#nome').val(),
            cpf: $('#cpf').val(),
            data_nascimento: $('#data_nascimento').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            endereco: $('#endereco').val()
        };

        try {

            const response = await fetch('/pacientes/submitData', {
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
            'Deseja realmente excluir este paciente?'
        );

        if (!confirmar) return;

        try {

            const response = await fetch('/pacientes/submitData', {
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