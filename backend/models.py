from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(256), nullable=False) # Agora guarda o hash SHA-256
    
    # Perfil Opcional
    curso = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    lattes = db.Column(db.String(255), nullable=True)
    foto = db.Column(db.String(255), nullable=True)
    
    # Controle
    role = db.Column(db.String(20), default='user')
    status = db.Column(db.String(20), default='pendente')

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "telefone": self.telefone,
            "email": self.email,
            "curso": self.curso,
            "bio": self.bio,
            "linkedin": self.linkedin,
            "lattes": self.lattes,
            "foto": self.foto,
            "role": self.role,
            "status": self.status
        }

# ---TABELA PARA A CHAVE E O LABORATÓRIO ---
class Lab(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default='FECHADO')
    # Se portador_id for nulo (None), a chave está na Guarita
    portador_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

# --- TABELA PARA EVENTOS, EDITAIS E PALESTRAS ---
class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False) # palestra, evento, edital, outros
    titulo = db.Column(db.String(150), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    imagem = db.Column(db.String(255), nullable=True) # URL da imagem
    link = db.Column(db.String(255), nullable=True)
    data_inicio = db.Column(db.String(20), nullable=False)
    data_fim = db.Column(db.String(20), nullable=True)
    horario = db.Column(db.String(20), nullable=True)
    criado_por = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id, "tipo": self.tipo, "titulo": self.titulo,
            "descricao": self.descricao, "imagem": self.imagem,
            "link": self.link, "data_inicio": self.data_inicio,
            "data_fim": self.data_fim, "horario": self.horario,
            "criado_por": self.criado_por
        }