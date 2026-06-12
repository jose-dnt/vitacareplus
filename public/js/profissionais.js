$(document).ready(function () {

    const modal = $('#modalProfissional');

    const tabela = $('#tabelaProfissionais').DataTable({

        processing: true,
        serverSide: true,
        ordering: false,

        ajax: {
            url: '/profissionais/fetchData',
            type: 'GET',
        },

        columns: [
            { data: 'nome' },
            { data: 'crm' },
            { data: 'especialidade' },
            { data: 'telefone' },
            { data: 'email' },
            {
                data: 'disponibilidade',
                render: function (disponibilidades) {

                    if (!disponibilidades?.length) {
                        return '-';
                    }

                    const ordemDias = {
                        segunda: 1,
                        terca: 2,
                        quarta: 3,
                        quinta: 4,
                        sexta: 5,
                        sabado: 6,
                        domingo: 7
                    };

                    const nomesDias = {
                        segunda: 'Seg',
                        terca: 'Ter',
                        quarta: 'Qua',
                        quinta: 'Qui',
                        sexta: 'Sex',
                        sabado: 'Sáb',
                        domingo: 'Dom'
                    };

                    disponibilidades.sort((a, b) =>
                        ordemDias[a.dia_semana] - ordemDias[b.dia_semana]
                    );

                    return disponibilidades.map(d =>
                        `${nomesDias[d.dia_semana]} ${d.hora_inicio.substring(0, 5)} - ${d.hora_fim.substring(0, 5)}`
                    ).join('<br>');
                }
            },
            {
                data: 'id',
                render: function (id) {

                    return `
            <button class="btn-editar" data-id="${id}">
            Editar
            </button >

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

            const response = await fetch(`/profissionais/fetchData/${id} `);

            const profissional = await response.json();

            $('#modalTitulo').text('Editar Profissional');

            $('#id').val(profissional.id);
            $('#nome').val(profissional.nome);
            $('#crm').val(profissional.crm);
            $('#especialidade').val(profissional.especialidade);
            $('#telefone').val(profissional.telefone);
            $('#email').val(profissional.email);

            $('.dia').prop('checked', false);
            $('.horarios').removeClass('ativo');

            $('.hora-inicio').val('');
            $('.hora-fim').val('');

            profissional.disponibilidade.forEach(disp => {

                const checkbox = $(
                    `.dia[value = "${disp.dia_semana}"]`
                );

                checkbox.prop('checked', true);

                const horarios = checkbox
                    .closest('.dia-disponibilidade')
                    .find('.horarios');

                horarios.addClass('ativo');

                horarios.find('.hora-inicio')
                    .val(disp.hora_inicio.substring(0, 5));

                horarios.find('.hora-fim')
                    .val(disp.hora_fim.substring(0, 5));

            });

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

        const disponibilidades = [];

        $('.dia-disponibilidade').each(function () {

            const checkbox = $(this).find('.dia');

            if (checkbox.is(':checked')) {

                disponibilidades.push({
                    dia_semana: checkbox.val(),
                    hora_inicio: $(this).find('.hora-inicio').val(),
                    hora_fim: $(this).find('.hora-fim').val()
                });

            }
        });

        const payload = {
            action,
            id: $('#id').val(),
            nome: $('#nome').val(),
            crm: $('#crm').val(),
            especialidade: $('#especialidade').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            disponibilidades
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

    $(document).on('change', '.dia', function () {

        const horarios = $(this)
            .closest('.dia-disponibilidade')
            .find('.horarios');

        horarios.toggleClass('ativo', this.checked);

        horarios.find('.hora-inicio, .hora-fim')
            .prop('required', this.checked);

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