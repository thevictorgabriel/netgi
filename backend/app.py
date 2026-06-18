import os
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
from functools import wraps
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'chave_temporaria_caso_esqueca_o_env')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# Configuração dinâmica para produção/desenvolvimento
is_prod = os.getenv('FLASK_ENV') == 'production'
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=is_prod # Se for produção, exige HTTPS automaticamente
)

# CONFIGURAÇÃO DE UPLOAD
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True) # Cria a pasta automaticamente se não existir
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# CONFIGURAÇÃO DE COOKIES PARA CORS
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax', 
    SESSION_COOKIE_SECURE=False 
)

# CORS: suporte a credenciais é OBRIGATÓRIO (Ajustado para o padrão do Vite React)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"]) 

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"erro": "Você precisa estar logado para acessar esta página."}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"erro": "Email já cadastrado"}), 400
        
    novo_usuario = User(
        nome=data.get('nome'),
        telefone=data.get('telefone'),
        email=data.get('email'),
        senha=generate_password_hash(data.get('senha')),
        role='user',
        status='pendente' # Começa pendente para o admin aprovar
    )
    
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"mensagem": "Solicitação de cadastro enviada!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and check_password_hash(user.senha, data.get('senha')):
        if user.status != 'aprovado':
            return jsonify({"erro": "Cadastro aguardando aprovação"}), 403
            
        login_user(user) # Aqui o Flask cria o Cookie de Sessão e manda pro navegador!
        return jsonify({"mensagem": "Login realizado", "user": user.to_dict()}), 200
        
    return jsonify({"erro": "Credenciais inválidas"}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"mensagem": "Logout realizado com sucesso"}), 200

@app.route('/api/profile', methods=['GET', 'PUT'])
@login_required
def profile():
    if request.method == 'GET':
        return jsonify(current_user.to_dict()), 200
        
    elif request.method == 'PUT':
        data = request.form
        current_user.nome = data.get('nome', current_user.nome)
        current_user.telefone = data.get('telefone', current_user.telefone)
        current_user.curso = data.get('curso', current_user.curso)
        current_user.bio = data.get('bio', current_user.bio)
        current_user.linkedin = data.get('linkedin', current_user.linkedin)
        current_user.lattes = data.get('lattes', current_user.lattes)

        # Lógica de Upload da Foto
        if 'foto' in request.files:
            file = request.files['foto']
            if file and file.filename != '':
                # Limpa o nome do arquivo e adiciona o ID do usuário para não dar conflito
                filename = secure_filename(file.filename)
                nome_unico = f"user_{current_user.id}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], nome_unico)
                
                # Salva na pasta física
                file.save(filepath)
                
                # Grava a URL completa no banco de dados
                current_user.foto = f"http://localhost:5000/static/uploads/{nome_unico}"
        
        db.session.commit()
        return jsonify({"mensagem": "Perfil atualizado!"}), 200


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({"erro": "Acesso restrito para administradores"}), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/admin/usuarios-pendentes', methods=['GET'])
@login_required
@admin_required
def get_pendentes():
    usuarios = User.query.filter_by(status='pendente').all()
    return jsonify([u.to_dict() for u in usuarios]), 200

@app.route('/api/admin/aprovar/<int:id>', methods=['PUT'])
@login_required
@admin_required
def aprovar_usuario(id):
    usuario = User.query.get_or_404(id)
    usuario.status = 'aprovado'
    db.session.commit()
    return jsonify({"mensagem": "Usuário liberado para login"}), 200

@app.route('/api/admin/rejeitar/<int:id>', methods=['DELETE'])
@login_required
@admin_required
def rejeitar_usuario(id):
    usuario = User.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"mensagem": "Usuário apagado do banco"}), 200


# --- ROTAS DA PÁGINA DE MEMBROS ---

@app.route('/api/membros', methods=['GET'])
def get_membros():
    # Busca apenas os usuários que já foram aprovados
    membros = User.query.filter_by(status='aprovado').all()
    
    # Montamos um dicionário seguro (sem expor e-mail, senha ou telefone publicamente)
    dados_publicos = [{
        "id": u.id,
        "nome": u.nome,
        "curso": u.curso,
        "bio": u.bio,
        "foto": u.foto,
        "linkedin": u.linkedin,
        "lattes": u.lattes,
        "role": u.role
    } for u in membros]
    
    return jsonify(dados_publicos), 200

@app.route('/api/admin/membros/<int:id>', methods=['DELETE'])
@login_required
@admin_required
def deletar_membro(id):
    # Rota exclusiva para o admin deletar um membro aprovado
    usuario = User.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"mensagem": "Membro apagado com sucesso"}), 200


# Execução do Servidor
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)