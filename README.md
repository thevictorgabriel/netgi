# 💡 NETGI ONLINE

Plataforma web desenvolvida para o Núcleo de Pesquisa em Economia, Tecnologia, Gestão e Inovação, com o objetivo de centralizar a comunicação e a administração do laboratório. O sistema atua como um portal informativo para a divulgação de atividades e editais abertos, além de oferecer ferramentas de gestão interna. Suas funcionalidades incluem controle de acesso e moderação de membros, gerenciamento do repasse de chaves, mural de avisos e monitoramento em tempo real do status de funcionamento do laboratório (aberto/fechado).

---

# 🛠️ Arquitetura e Tecnologias

## 🎨 Design & Protótipo (Figma)

A interface do usuário, a identidade visual e os fluxos de navegação das telas deste sistema foram inteiramente planejados e prototipados utilizando o Figma. 

- [Acessar Projeto no Figma](https://www.figma.com/design/G1EjYOCExdXGXUtBfAQoSO/NetGi?node-id=0-1&t=aKoBAdimIpUNnkEQ-1)

## Engenharia de Backend
- **Framework:** Flask (Python)
- **Autenticação e Sessão:** Flask-Login (Cookies HttpOnly, proteção contra XSS e CORS estruturado)
- **Persistência de Dados:** Flask-SQLAlchemy (SQLite)
- **Segurança de Credenciais:** Werkzeug Security (Criptografia com algoritmo pbkdf2:sha256 e salting adaptativo)

## Engenharia de Frontend
- **Ambiente de Desenvolvimento:** React (Vite)
- **Comunicação assíncrona:** Native Fetch API (com suporte a credenciais compartilhadas)

---

# 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Python 3.8 ou superior**
- **Node.js (versão LTS)**
- **Gerenciador de pacotes npm**

---

# 🚀 Fase de Configuração do Ambiente (Setup)

## 1. Configurando o **Backend**

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```

2. Crie e ative o ambiente virtual (Venv):

- No Linux/macOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

- No Windows (Prompt de Comando):
```bash
python -m venv venv
.\venv\Scripts\activate
```

3. Instale todas as dependências necessárias:
```bash
pip install -r requirements.txt
```

4. Crie um arquivo chamado ```.env``` na raiz da pasta backend e defina as variáveis de ambiente:
```
FLASK_SECRET_KEY=sua_chave_secreta_altamente_aleatoria_aqui
DATABASE_URL=sqlite:///laboratorio.db
FLASK_ENV=development
```

## 2. Configurando o **Frontend**

1. Em outro terminal, navegue até o diretório do frontend:
```bash
cd ../frontend
```

2. Instale as dependências do Node:
```bash
npm install
```

# Execução do Sistema

1. Inicializando o Banco de Dados e Administrador Raiz
Antes de rodar o servidor pela primeira vez, execute o script de provisionamento para estruturar as tabelas e cadastrar o administrador:
```bash
cd backend
python criar_admin.py
```

2. Executando o Servidor Backend (Flask)
Com o ambiente virtual ativado na pasta do backend, inicie o servidor:
```bash
python app.py
```

*O servidor backend estará disponível em http://localhost:5000*

3. Executando o Servidor Frontend (React/Vite)
Em um novo terminal, navegue até a pasta do frontend e inicie a aplicação:

```bash
cd frontend
npm run dev
```

*A interface web estará disponível em http://localhost:5173*
