<<<<<<< HEAD

# 🚀 Sistema de Gestão - Narcóticos Anônimos (NA) - Frontend

=======

# Front end

Para rodar esse projeto:

> > > > > > > 17284fc3a55ddb414b3d533ac553d9d8396182f7

Este é o repositório do frontend do nosso Projeto Integrador. Esta aplicação é responsável por toda a interface visual e interação do usuário com o sistema de gestão do grupo de NA.

---

### ✨ Features Principais

- **🔒 Páginas de Autenticação:** Telas para login de administradores e para definição de senha de novos usuários.
- **🔐 Rotas Protegidas:** Acesso à área administrativa somente para usuários autenticados.
- **➕ Cadastro de Admins:** Formulário para que administradores logados possam pré-cadastrar novos administradores no sistema.
- **👀 Área Pública:** Telas para visualização de reuniões, eventos e dados da secretaria para membros do grupo sem a necessidade de login.

### 🛠️ Nossa Stack

| Área         | Tecnologias                                    |
| :----------- | :--------------------------------------------- |
| **Frontend** | React, TypeScript, Vite, React Router DOM, CSS |

### 🚀 Rodando o Frontend Localmente

Bora configurar o ambiente de desenvolvimento.

**Você vai precisar de:**

- Node.js (v20+ recomendado, conforme arquivo `.nvmrc`)
- NPM ou Yarn
- Git

**Passo a passo:**

1.  **Clone o repo e instale as dependências:**

    ```bash
    git clone <URL_DO_REPOSITORIO_FRONTEND>
    cd front-end-main
    npm install
    ```

2.  **Configure o `.env`:**

    - Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    - Preencha a variável `VITE_API_BASE_URL` com o endereço do seu backend rodando localmente (geralmente `http://localhost:3333`).
      ```env
      VITE_API_BASE_URL=http://localhost:3333
      ```

3.  **Suba o servidor:** \* Rode o script de desenvolvimento (ele reinicia sozinho quando você salva!).
    `bash
    npm run dev
    `
    E pronto! O frontend estará rodando em `http://localhost:5173`.

### 👥 A Equipe

| Papel              | Quem é                           |
| :----------------- | :------------------------------- |
| Product Owner (PO) | Maria Luiza Sperancin Mancebo    |
| Scrum Master       | Juliana da Costa Silva           |
| UX Designer        | Julia Dias Luz                   |
| Dev Backend ☕     | Ryan Pavini                      |
| Dev Frontend ⚛️    | Samuel Calegnan dos Santos Souza |

---
