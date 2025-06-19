import subprocess
import sys
import os

def install_requirements():
    """Instala as dependências necessárias"""
    print("Instalando dependências...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("Dependências instaladas com sucesso!")

def prepare_images():
    """Instruções para preparar as imagens"""
    print("""
    PREPARAÇÃO DAS IMAGENS:
    
    1. Salve as fotos dos personagens que você enviou
    2. Use um editor de imagem (como GIMP, Photoshop, ou online) para separar cada personagem
    3. Salve cada personagem como arquivo PNG individual:
       Matheus.png",
        Pipe.png",
        Silvio.png",
        Cleydson.png",
        Blenda.png",
        Igor.png",
        Agnes.png",
        Irmão.png",
        Daphine.png",
        Leandro.png", 
        Vinicius.png",
        Carlito.png",
        Mel.png",
        Babi.png",
        Nath.png",
        Kássia.png",
        Eduardo.png",
        Alycia.png",
        Gabriel.png",
        Gabriel2.0.png",
        Geovana.png",
        Rodrigo.png",
        Cami.png",
        Tuca.png"
    
    4. Coloque todos os arquivos PNG na mesma pasta deste script
    
    5. (Opcional) Adicione um arquivo de música "sao_joao_musica.mp3" na mesma pasta
    
    6. Execute o script generate_video.py
    """)

def main():
    print("=== GERADOR DE VÍDEO SÃO JOÃO ===")
    print()
    
    choice = input("Escolha uma opção:\n1 - Instalar dependências\n2 - Ver instruções de preparação\n3 - Gerar vídeo\nOpção: ")
    
    if choice == "1":
        install_requirements()
    elif choice == "2":
        prepare_images()
    elif choice == "3":
        if os.path.exists("generate_video.py"):
            print("Executando gerador de vídeo...")
            subprocess.run([sys.executable, "generate_video.py"])
        else:
            print("Arquivo generate_video.py não encontrado!")
    else:
        print("Opção inválida!")

if __name__ == "__main__":
    main()
