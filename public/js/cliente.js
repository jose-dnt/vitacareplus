async function alterarCliente(codClienteP) {
  // Encontra o formulário pai do botão

  const codCliente =document.getElementById('codCliente'+codClienteP).value;

  const nomeCliente = document.getElementById('nomeCliente'+codClienteP).value;

  const confirmacao = confirm(`Deseja alterar o cliente para "${nomeCliente}"?`);

  try {
      const response = await fetch('/cliente', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codCliente, nomeCliente })
      });

      if (response.ok) {
          location.reload(); // Atualiza a página para refletir a alteração
      } else {
          const error = await response.json();
          alert(`Erro ao alterar cliente: ${error.message}`);
      }
  } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Ocorreu um erro ao tentar alterar o cliente.');
  }
}

async function excluirCliente(codClienteP) {
  // Encontra o formulário pai do botão
  const nomeCliente = document.getElementById('nomeCliente'+codClienteP).value;
  const codCliente=codClienteP;

  const confirmacao = confirm(`Tem certeza que deseja excluir o cliente "${nomeCliente}"?`);
  if (!confirmacao) return;

  try {
      const response = await fetch('/clientes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codCliente })
      });

      if (response.ok) {
          location.reload(); // Atualiza a página para refletir a exclusão
      } else {
          const error = await response.json();
          alert(`Erro ao excluir cliente: ${error.message}`);
      }
  } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Ocorreu um erro ao tentar excluir o cliente.');
  }
}
