 /* =========================
DADOS DO USUÁRIO
========================= */
fetch('/me')
.then(res => res.json())
.then(data => {
const nome = data.username || "Usuário";

document.getElementById('userNameMain').innerText = nome;
})

/* =========================
DADOS DO DASHBOARD (FAKE POR ENQUANTO)
========================= */

// depois você pode puxar isso do banco
document.getElementById('totalPacientes').innerText = 12;
document.getElementById('totalConsultas').innerText = 5;
document.getElementById('totalProfissionais').innerText = 3;
