# 🚀 Sistema de Gestão - Narcóticos Anônimos (NA) - Frontend

Este é o repositório do nosso Projeto Integrador da disciplina "Projeto Integrador" na Faculdade de Tecnologia da Universidade Estadual de Campinas (FT/UNICAMP). Esta aplicação é responsável por toda a interface visual e interação do utilizador com o sistema de gestão do grupo de NA.

---

### 🎯 O Problema que Estamos Resolvendo

A comunicação no grupo atualmente depende de cadernos físicos e WhatsApp. Isso causa problemas como perda de informações, dificuldade de organização e ruídos na comunicação.

Nosso objetivo é criar uma plataforma centralizada para acabar com essa bagunça. A ideia é ter um lugar único e confiável para todas as informações importantes, melhorando a comunicação e a eficiência do grupo.

### ✨ Features Principais

- **📅 Agenda de Reuniões:** Um calendário ou lista para ver todas as reuniões semanais.
- **🎉 Mural de Eventos:** Uma área para divulgar eventos únicos, como confraternizações e workshops.
- **📢 Dados da Secretaria:** Acesso rápido e transparente aos dados financeiros do grupo, como a Sétima Tradição.
- **👀 Acesso Público:** Membros podem consultar tudo sem precisar de login.
- **🔒 Painel Admin:** Uma área segura para os servidores de confiança gerenciarem as informações.

### 🛠️ Nossa Stack

| Área | Tecnologias |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, React Router DOM, CSS |

### 🚀 Rodando o Frontend (Integrado com o Backend)

Guia para configurar o ambiente de desenvolvimento do frontend, já conectado ao backend.

**Você vai precisar de:**
* Node.js (v20+ recomendado, conforme ficheiro `.nvmrc`)
* NPM ou Yarn
* Git

**Passo a passo:**

1.  **Clone o repositório e instale as dependências:**
    ```bash
    git clone <URL_DO_REPOSITORIO_FRONTEND>
    cd front-end-main
    npm install
    ```

2.  **Configure as Variáveis de Ambiente (`.env`):**
    * Na pasta `front-end-main`, crie uma cópia do ficheiro `.env.example` e renomeie para `.env`.
    * Preencha as variáveis com os dados do backend. `VITE_API_BASE_URL` deve apontar para o endereço do seu backend local.
        ```env
        VITE_API_BASE_URL=http://localhost:3333
        VITE_API_KEY=chave-secreta-da-api-12345
        ```

3.  **Garanta que o Backend esteja a Rodar:**
    * Para que o frontend funcione, o servidor do backend precisa de estar ativo. Siga o `README.md` do repositório do backend para o colocar no ar (geralmente na porta `3333`).

4.  **Suba o servidor do frontend:**
    * Com o backend já a rodar, execute o script de desenvolvimento do frontend:
        ```bash
        npm run dev
        ```
E pronto! O frontend estará a rodar em `http://localhost:5173`.

### 👥 A Equipa

| Papel             | Quem é          |
| ----------------- | --------------- |
| Product Owner (PO) | Maria Luiza Sperancin Mancebo |
| Scrum Master      | Juliana da Costa Silva |
| UX Designer       | Julia Dias Luz |
| Dev Backend ☕    | Ryan Pavini |
| Dev Frontend ⚛️   | Samuel Calegnan dos Santos Souza |

---