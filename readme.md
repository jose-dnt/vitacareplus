# VitaCare+ (Sistema de Gestão de Clínica Médica)

Um aplicativo para auxiliar no gerenciamento de clínicas médicas, permitindo o controle de pacientes, profissionais de saúde, consultas e histórico médico, proporcionando maior organização e eficiência no atendimento.

## Principais Funcionalidades

### Cadastro de Pacientes:
 Os usuários podem registrar pacientes com informações como nome, CPF, data de nascimento, telefone, endereço e outras informações relevantes.

### Cadastro de Profissionais de Saúde:
 Permite o cadastro de médicos e outros profissionais, incluindo especialidade, CRM, horários de atendimento e dados de contato.

### Agendamento de Consultas:
 Os usuários podem agendar consultas informando paciente, profissional, data, horário e tipo de atendimento, garantindo o controle da agenda da clínica.

### Gerenciamento de Consultas:
 Possibilita visualizar, editar, cancelar ou reagendar consultas, além de acompanhar o status (agendada, realizada ou cancelada).
### Registro de Histórico Médico:
 Permite armazenar informações sobre atendimentos realizados, incluindo diagnósticos, prescrições e observações médicas.
### Controle de Disponibilidade:
 O sistema deve verificar a disponibilidade dos profissionais, evitando conflitos de horários e garantindo uma agenda organizada.
### Relatórios e Consultas:
 Os usuários podem gerar relatórios, com o número de consultas por período, atendimentos por profissional e histórico de pacientes.

## Integrantes
Vinícius Gabriel (Função: Frontend, responsável pela implementação do HTML e CSS)

Alex Sandro (Função: Desenvolvedor backend, responsável pela implementação dos models e banco de dados)

José Dantas (Função: Desenvolvedor frontend e backend, responsável pelo resto do backend e comunicação entre back e front)

## Perguntas

1. Faça um breve comentário sobre a utilização no projeto de Orientação Objetos e suas características

Nós utilizamos classes, atributos e métodos, nos models, DAOs e controllers. Utilizamos métodos estáticos, e os DAOs para converter dados do banco de dados para objetos de suas respectivas classes.

2. Faça um breve comentário sobre como foi realizada a conexão com o banco de dados utilizando o
pacote mysql, o padrão DAO e orientação a objetos.

Nós utilizamos o pacote mysql2/promise, que é uma versão do mysql2 que utiliza promises, assim permitindo que nós utilizassemos o await. O banco foi conectado com um script que também cria as tabelas caso não existam, e as popula com dados.

3. Há algum problema/erro identificado?

Ainda falta várias features, e ainda não é possível cadastrar consultas ou disponibilidade dos profissionais.

4. Descrição sua experiência em realizar o projeto e as dificuldades encontradas

Tivemos dificuldades principalmente em mostrar os dados no HTML, porém, com a ajuda dos recursos disponibilizados pelo Professor Edson anteriormente, utilizamos o AJAX para resolver.

## Referências:

Exemplo de JWT do Professor Edson

# ENV

JWT_SECRET=

# Pré-requisitos
- Instalar [Node.js](https://nodejs.org/en/) versão 22.16.0


# Como rodar
- Clone o repositório
```
git clone https://github.com/jose-dnt/vitacareplus.git
```
- Instalar dependências
```
cd vitacareplus-master
npm install
```
- Rodar o projeto
```
npm start
```
- Abrir `http://localhost:3000`