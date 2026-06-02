const panel = document.getElementById("side_panel");
const overlay = document.getElementById("panel_overlay");
const panelBody = document.getElementById("panel_body");
const panelTitle = document.getElementById("panel_title");

function showPanel() {
    overlay.style.display = "block";
    panel.classList.add("show");
}

function hidePanel() {
    overlay.style.display = "none";
    panel.classList.remove("show");
}

        // ================================
        //      DATATABLE COM PORTUGUÊS
        // ================================
$(document).ready(function () {

    $('#sample_data').DataTable({
        ajax: '/fetchData',
        processing: true,
        serverSide: true,
        order: [],

        // Search + Botão na mesma linha
        dom: '<"d-flex justify-content-between align-items-center mb-2"f<"add-btn">>rtip',

        // Tradução PT-BR
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json"
        },

        initComplete: function () {
            // Botão Adicionar ao lado direito do Search
            $("div.add-btn").html(`
                <button class="btn btn-primary" onclick="addData()">Adicionar Paciente</button>
            `);
        },

        columns: [
            { data: 'nome' },
            { data: 'cpf' },
            { data: 'data_nascimento' },
            { data: 'telefone' },
            { data: 'email' },
            { data: 'endereco' },
            {
                data: null,
                render: data => `
                <button class="btn btn-warning btn-sm" onclick="fetchData(${data.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteData(${data.id})">Excluir</button>`
            }
        ]
    });
});

        // ================================
        //      FORMULÁRIO DO PAINEL
        // ================================
        function makeForm(id = '', nome = '', cpf = '', data_nascimento = '', telefone = '', email = '', endereco = '', action = 'Insert') {
            return `
                <div class="form-group">
                    <label>Nome:</label>
                    <input type="text" id="username" value="${username}" required>
                </div>

                <div class="form-group">
                    <label>CPF:</label>
                    <input type="text" id="cpf" value="${cpf}" required>
                </div>

                <div class="form-group">
                    <label>Data de Nascimento:</label>
                    <input type="date" id="data_nascimento" value="${data_nascimento}" required>
                </div>

                <div class="form-group">
                    <label>Telefone:</label>
                    <input type="tel" id="telefone" value="${telefone}" required>
                </div>

                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="email" value="${email}" required>
                </div>

                <div class="form-group">
                    <label>Endereço:</label>
                    <input type="text" id="endereco" value="${endereco}" required>
                </div>

                <input type="hidden" id="id" value="${id}">
                <input type="hidden" id="action" value="${action}">

                <button class="btn btn-primary" onclick="submitForm()">
                    ${action === 'Insert' ? 'Inserir' : 'Atualizar'}
                </button>
            `;
        }

        function addData() {
            panelBody.innerHTML = makeForm();
            panelTitle.innerText = "Adicionar Paciente";
            showPanel();
        }

        function submitForm() {
            const id = $("#id").val();
            const nome = $("#nome").val();
            const cpf = $("#cpf").val();
            const data_nascimento = $("#data_nascimento").val();
            const telefone = $("#telefone").val();
            const email = $("#email").val();
            const endereco = $("#endereco").val();
            const action = $("#action").val();

            $.post('/submitData', { id, nome, cpf, data_nascimento, telefone, email, endereco, action }, function (data) {
                $('#sample_data').DataTable().ajax.reload();
                hidePanel();
                alert(data.message);
            }, 'json');
        }

        function fetchData(id) {
            $.get('/fetchData/' + id, function (data) {
                panelBody.innerHTML = makeForm(data.id, data.nome, data.cpf, data.data_nascimento, data.telefone, data.email, data.endereco, "Edit");
                panelTitle.innerText = "Editar Paciente";
                showPanel();
            }, 'json');
        }

        function deleteData(id) {
            panelBody.innerHTML = `
                <h3 class="text-center text-danger">Confirmar Exclusão?</h3>
                <button class="btn btn-danger" onclick="confirmDelete(${id})">Sim, excluir</button>
                <button class="btn btn-secondary" onclick="hidePanel()">Cancelar</button>
            `;
            panelTitle.innerText = "Excluir Paciente";
            showPanel();
        }

        function confirmDelete(id) {
            $.post('/submitData', { id, action: "Delete" }, function (data) {
                $('#sample_data').DataTable().ajax.reload();
                hidePanel();
                alert(data.message);
            }, 'json');
        }