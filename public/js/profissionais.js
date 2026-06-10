$(document).ready(function () {

    const modal = $('#modalProfissional');

    const tabela = $('#tabelaProfissionais').DataTable({

        processing: true,
        serverSide: true,
        ordering: false,

        ajax: {
            url: '/profissionais/fetchData',
            type: 'GET'
        },

        columns: [
            { data: 'nome' },
            { data: 'crm' },
            { data: 'especialidade' },
            { data: 'telefone' },
            { data: 'email' },
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
    | NOVO PROFISSIONAL
    |--------------------------------------------------------------------------
    */

    $('#btnNovoProfissional').on('click', function () {

        $('#modalTitulo').text('Novo Profissional');

        $('#formProfissional')[0].reset();

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

        if ($(e.target).is('#modalProfissional')) {
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

            const response = await fetch(`/profissionais/fetchData/${id}`);

            const profissional = await response.json();

            $('#modalTitulo').text('Editar Profissional');

            $('#id').val(profissional.id);
            $('#nome').val(profissional.nome);
            $('#crm').val(profissional.crm);
            $('#especialidade').val(profissional.especialidade);
            $('#telefone').val(profissional.telefone);
            $('#email').val(profissional.email);

            modal.show();

        } catch (err) {

            console.error(err);
            alert('Erro ao carregar profissional.');

        }

    });

    /*
    |--------------------------------------------------------------------------
    | SALVAR (INSERT / EDIT)
    |--------------------------------------------------------------------------
    */

    $('#formProfissional').on('submit', async function (e) {

        e.preventDefault();

        const action =
            $('#id').val() ? 'Edit' : 'Insert';

        const payload = {
            action,
            id: $('#id').val(),
            nome: $('#nome').val(),
            crm: $('#crm').val(),
            especialidade: $('#especialidade').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
        };

        try {

            const response = await fetch('/profissionais/submitData', {
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
            'Deseja realmente excluir este profissional?'
        );

        if (!confirmar) return;

        try {

            const response = await fetch('/profissionais/submitData', {
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