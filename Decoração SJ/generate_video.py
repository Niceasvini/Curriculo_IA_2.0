import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip
import math
import random

class SaoJoaoVideoGenerator:
    def __init__(self):
        self.width = 1920
        self.height = 1080
        self.fps = 30
        self.character_duration = 3  # segundos por personagem
        self.total_duration = 60  # duração total do vídeo
        
    def create_background_frame(self):
        """Cria o frame de fundo com logo e bandeirinhas"""
        # Fundo branco
        frame = np.ones((self.height, self.width, 3), dtype=np.uint8) * 255
        
        # Adicionar bandeirinhas no topo
        self.draw_bandeirinhas(frame)
        
        # Adicionar logo (você precisará ter o arquivo da logo)
        self.add_logo(frame)
        
        return frame
    
    def draw_bandeirinhas(self, frame):
        """Desenha bandeirinhas coloridas no topo"""
        colors = [
            (107, 107, 255),  # Vermelho
            (196, 205, 78),   # Verde-azulado
            (209, 183, 69),   # Azul
            (180, 206, 150)   # Verde claro
        ]
        
        bandeirinha_width = 60
        bandeirinha_height = 80
        spacing = 80
        start_x = (self.width - (12 * spacing)) // 2
        
        for i in range(12):
            x = start_x + i * spacing
            y = 20
            color = colors[i % 4]
            
            # Desenhar triângulo (bandeirinha)
            pts = np.array([
                [x, y],
                [x + bandeirinha_width, y],
                [x + bandeirinha_width//2, y + bandeirinha_height]
            ], np.int32)
            
            cv2.fillPoly(frame, [pts], color)
            cv2.polylines(frame, [pts], True, (0, 0, 0), 2)
    
    def add_logo(self, frame):
        """Adiciona a logo da Viana e Moura (você precisa ter o arquivo)"""
        # Posição da logo (canto superior direito)
        logo_x = self.width - 200
        logo_y = 30
        
        # Simular logo com texto (substitua por imagem real)
        cv2.putText(frame, "VIANA E MOURA", (logo_x, logo_y), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (180, 50, 50), 2)
        cv2.putText(frame, "construcoes", (logo_x + 20, logo_y + 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 150, 50), 1)
    
    def create_dance_animation(self, character_img, animation_type, frame_count):
        """Cria animação de dança para um personagem"""
        animations = {
            'bounce': self.bounce_animation,
            'wiggle': self.wiggle_animation,
            'spin': self.spin_animation,
            'shake': self.shake_animation,
            'sway': self.sway_animation,
            'hop': self.hop_animation
        }
        
        return animations.get(animation_type, self.bounce_animation)(character_img, frame_count)
    
    def bounce_animation(self, img, frame_count):
        """Animação de pular"""
        frames = []
        for i in range(frame_count):
            # Movimento vertical senoidal
            offset_y = int(30 * math.sin(i * 0.3))
            frames.append((0, offset_y, 0, 1.0))  # x, y, rotation, scale
        return frames
    
    def wiggle_animation(self, img, frame_count):
        """Animação de balançar"""
        frames = []
        for i in range(frame_count):
            offset_x = int(20 * math.sin(i * 0.4))
            frames.append((offset_x, 0, 0, 1.0))
        return frames
    
    def spin_animation(self, img, frame_count):
        """Animação de girar"""
        frames = []
        for i in range(frame_count):
            rotation = (i * 8) % 360
            frames.append((0, 0, rotation, 1.0))
        return frames
    
    def shake_animation(self, img, frame_count):
        """Animação de tremer"""
        frames = []
        for i in range(frame_count):
            offset_x = random.randint(-10, 10)
            offset_y = random.randint(-5, 5)
            frames.append((offset_x, offset_y, 0, 1.0))
        return frames
    
    def sway_animation(self, img, frame_count):
        """Animação de balançar suavemente"""
        frames = []
        for i in range(frame_count):
            offset_x = int(25 * math.sin(i * 0.2))
            rotation = int(10 * math.sin(i * 0.2))
            frames.append((offset_x, 0, rotation, 1.0))
        return frames
    
    def hop_animation(self, img, frame_count):
        """Animação de pular alto"""
        frames = []
        for i in range(frame_count):
            # Pulo mais alto e menos frequente
            offset_y = int(50 * abs(math.sin(i * 0.15)))
            frames.append((0, -offset_y, 0, 1.0))
        return frames
    
    def apply_transform(self, img, transform):
        """Aplica transformação (posição, rotação, escala) na imagem"""
        x_offset, y_offset, rotation, scale = transform
        
        # Redimensionar se necessário
        if scale != 1.0:
            new_size = (int(img.shape[1] * scale), int(img.shape[0] * scale))
            img = cv2.resize(img, new_size)
        
        # Rotacionar se necessário
        if rotation != 0:
            center = (img.shape[1]//2, img.shape[0]//2)
            matrix = cv2.getRotationMatrix2D(center, rotation, 1.0)
            img = cv2.warpAffine(img, matrix, (img.shape[1], img.shape[0]))
        
        return img, x_offset, y_offset
    
    def overlay_character(self, background, character_img, x_offset, y_offset):
        """Sobrepõe o personagem no fundo"""
        # Posição central
        center_x = self.width // 2 + x_offset
        center_y = self.height // 2 + y_offset
        
        # Calcular posição de inserção
        start_x = max(0, center_x - character_img.shape[1]//2)
        start_y = max(0, center_y - character_img.shape[0]//2)
        end_x = min(self.width, start_x + character_img.shape[1])
        end_y = min(self.height, start_y + character_img.shape[0])
        
        # Inserir personagem (assumindo fundo transparente ou branco)
        if character_img.shape[2] == 4:  # RGBA
            # Usar canal alpha para transparência
            alpha = character_img[:, :, 3] / 255.0
            for c in range(3):
                background[start_y:end_y, start_x:end_x, c] = \
                    background[start_y:end_y, start_x:end_x, c] * (1 - alpha) + \
                    character_img[:end_y-start_y, :end_x-start_x, c] * alpha
        else:
            # Substituir pixels não-brancos
            mask = np.any(character_img != [255, 255, 255], axis=2)
            background[start_y:end_y, start_x:end_x][mask] = character_img[:end_y-start_y, :end_x-start_x][mask]
        
        return background
    
    def generate_video(self, character_images, output_path="sao_joao_dance.mp4", audio_path=None):
        """Gera o vídeo final"""
        print("Iniciando geração do vídeo...")
        
        # Configurar codec de vídeo
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter('temp_video.mp4', fourcc, self.fps, (self.width, self.height))
        
        total_frames = self.fps * self.total_duration
        frames_per_character = self.fps * self.character_duration
        
        current_frame = 0
        character_index = 0
        
        while current_frame < total_frames:
            # Selecionar personagem atual
            char_img_path = character_images[character_index % len(character_images)]
            
            # Carregar imagem do personagem
            try:
                char_img = cv2.imread(char_img_path, cv2.IMREAD_UNCHANGED)
                if char_img is None:
                    print(f"Erro ao carregar {char_img_path}")
                    char_img = self.create_dummy_character()
            except:
                char_img = self.create_dummy_character()
            
            # Escolher animação aleatória
            animations = ['bounce', 'wiggle', 'spin', 'shake', 'sway', 'hop']
            current_animation = random.choice(animations)
            
            print(f"Processando personagem {character_index + 1} com animação {current_animation}")
            
            # Gerar frames para este personagem
            animation_transforms = self.create_dance_animation(char_img, current_animation, frames_per_character)
            
            for i in range(frames_per_character):
                if current_frame >= total_frames:
                    break
                
                # Criar frame de fundo
                frame = self.create_background_frame()
                
                # Aplicar transformação
                transform = animation_transforms[i % len(animation_transforms)]
                transformed_img, x_off, y_off = self.apply_transform(char_img.copy(), transform)
                
                # Sobrepor personagem
                frame = self.overlay_character(frame, transformed_img, x_off, y_off)
                
                # Escrever frame
                out.write(frame)
                current_frame += 1
            
            character_index += 1
        
        out.release()
        print("Vídeo base criado!")
        
        # Adicionar áudio se fornecido
        if audio_path and os.path.exists(audio_path):
            print("Adicionando áudio...")
            video = VideoFileClip('temp_video.mp4')
            audio = AudioFileClip(audio_path)
            
            # Ajustar duração do áudio
            if audio.duration < video.duration:
                # Loop do áudio se for menor que o vídeo
                audio = audio.loop(duration=video.duration)
            else:
                # Cortar áudio se for maior
                audio = audio.subclip(0, video.duration)
            
            final_video = video.set_audio(audio)
            final_video.write_videofile(output_path, codec='libx264', audio_codec='aac')
            
            # Limpar arquivos temporários
            video.close()
            audio.close()
            os.remove('temp_video.mp4')
        else:
            # Apenas renomear o arquivo
            os.rename('temp_video.mp4', output_path)
        
        print(f"Vídeo finalizado: {output_path}")
    
    def create_dummy_character(self):
        """Cria um personagem dummy para teste"""
        img = np.ones((300, 200, 3), dtype=np.uint8) * 255
        
        # Desenhar boneco simples
        # Cabeça
        cv2.circle(img, (100, 80), 40, (255, 220, 177), -1)
        # Olhos
        cv2.circle(img, (85, 70), 5, (0, 0, 0), -1)
        cv2.circle(img, (115, 70), 5, (0, 0, 0), -1)
        # Boca
        cv2.ellipse(img, (100, 90), (15, 8), 0, 0, 180, (255, 0, 0), -1)
        
        # Chapéu
        cv2.rectangle(img, (60, 30), (140, 50), (255, 255, 0), -1)
        cv2.rectangle(img, (70, 50), (130, 60), (139, 69, 19), -1)
        
        # Corpo
        cv2.rectangle(img, (75, 120), (125, 200), (255, 0, 0), -1)
        
        # Braços
        cv2.rectangle(img, (45, 130), (75, 150), (255, 220, 177), -1)
        cv2.rectangle(img, (125, 130), (155, 150), (255, 220, 177), -1)
        
        # Pernas
        cv2.rectangle(img, (85, 200), (100, 280), (0, 0, 255), -1)
        cv2.rectangle(img, (100, 200), (115, 280), (0, 0, 255), -1)
        
        return img

# Função principal para executar
def main():
    generator = SaoJoaoVideoGenerator()
    
    # Lista de imagens dos personagens (você precisa separar as imagens)
    character_images = [
        "character_1.png",
        "character_2.png", 
        "character_3.png",
        "character_4.png",
        "character_5.png",
        "character_6.png",
        "character_7.png",
        "character_8.png",
        "character_9.png"
    ]
    
    # Caminho para música de São João (opcional)
    audio_path = "sao_joao_music.mp3"  # Adicione sua música aqui
    
    # Gerar vídeo
    generator.generate_video(
        character_images=character_images,
        output_path="sao_joao_dance_final.mp4",
        audio_path=audio_path if os.path.exists(audio_path) else None
    )

if __name__ == "__main__":
    main()