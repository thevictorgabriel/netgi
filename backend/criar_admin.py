from app import app, db, User
from werkzeug.security import generate_password_hash

def setup_admin():
    with app.app_context():
        db.create_all()

        if User.query.filter_by(email="EMAIL DO ADMIN").first():
            print("Administrador já existe.")
            return

        novo_admin = User(
            nome="NOME DO ADMIN",
            telefone="(00) 00000-0000",
            email="EMAIL DO ADMIN",
            senha=generate_password_hash("SENHA DO ADMIN"),
            role="admin",
            status="aprovado",
            bio="Administrador do sistema."
        )

        db.session.add(novo_admin)
        db.session.commit()
        print("Banco criado e Administrador cadastrado!")

if __name__ == '__main__':
    setup_admin()