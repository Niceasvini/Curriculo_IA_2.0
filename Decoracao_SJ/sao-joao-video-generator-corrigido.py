import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip
import math
import random
import tempfile

class SaoJoaoVideoGenerator:
    def __init__(self):
        self.width = 1920
        self.height = 1080
        self.fps = 30
        self.character_duration = 3  # segundos por personagem
        self.total_duration = 60  # duração total do vídeo
        
    def create_background_frame(self):
        frame = np.ones((self.height, self.width, 3), dtype=np.uint8) * 255
        self.draw_bandeirinhas(frame)
        self.add_logo(frame)
        return frame
    
    def draw_bandeirinhas(self, frame):
        colors = [
            (107, 107, 255),
            (196, 205, 78),
            (209, 183, 69),
            (180, 206, 150)
        ]
        bandeirinha_width = 60
        bandeirinha_height = 80
        spacing = 80
        start_x = (self.width - (12 * spacing)) // 2
        for i in range(12):
            x = start_x + i * spacing
            y = 20
            color = colors[i % 4]
            pts = np.array([[x, y], [x + bandeirinha_width, y], [x + bandeirinha_width//2, y + bandeirinha_height]], np.int32)
            cv2.fillPoly(frame, [pts], color)
            cv2.polylines(frame, [pts], True, (0, 0, 0), 2)
    
    def add_logo(self, frame):
        logo_x = self.width - 300
        logo_y = 50
        cv2.putText(frame, "VIANA E MOURA", (logo_x, logo_y), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (180, 50, 50), 3)
        cv2.putText(frame, "construcoes", (logo_x + 30, logo_y + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 150, 50), 2)
    
    def create_dance_animation(self, character_img, animation_type, frame_count):
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
        return [(0, int(30 * math.sin(i * 0.3)), 0, 1.0) for i in range(frame_count)]
    
    def wiggle_animation(self, img, frame_count):
        return [(int(20 * math.sin(i * 0.4)), 0, 0, 1.0) for i in range(frame_count)]
    
    def spin_animation(self, img, frame_count):
        return [(0, 0, (i * 8) % 360, 1.0) for i in range(frame_count)]
    
    def shake_animation(self, img, frame_count):
        return [(random.randint(-10, 10), random.randint(-5, 5), 0, 1.0) for _ in range(frame_count)]
    
    def sway_animation(self, img, frame_count):
        return [(int(25 * math.sin(i * 0.2)), 0, int(10 * math.sin(i * 0.2)), 1.0) for i in range(frame_count)]
    
    def hop_animation(self, img, frame_count):
        return [(0, -int(50 * abs(math.sin(i * 0.15))), 0, 1.0) for i in range(frame_count)]
    
    def apply_transform(self, img, transform):
        x_offset, y_offset, rotation, scale = transform
        if scale != 1.0:
            new_size = (int(img.shape[1] * scale), int(img.shape[0] * scale))
            img = cv2.resize(img, new_size)
        if rotation != 0:
            center = (img.shape[1]//2, img.shape[0]//2)
            matrix = cv2.getRotationMatrix2D(center, rotation, 1.0)
            img = cv2.warpAffine(img, matrix, (img.shape[1], img.shape[0]))
        return img, x_offset, y_offset
    
    def overlay_character(self, background, character_img, x_offset, y_offset):
        max_height = 600
        if character_img.shape[0] > max_height:
            ratio = max_height / character_img.shape[0]
            new_width = int(character_img.shape[1] * ratio)
            character_img = cv2.resize(character_img, (new_width, max_height))
        
        center_x = self.width // 2 + x_offset
        center_y = self.height // 2 + y_offset
        
        start_x = max(0, center_x - character_img.shape[1]//2)
        start_y = max(0, center_y - character_img.shape[0]//2)
        end_x = min(self.width, start_x + character_img.shape[1])
        end_y = min(self.height, start_y + character_img.shape[0])
        
        char_height = end_y - start_y
        char_width = end_x - start_x
        
        if char_height > 0 and char_width > 0:
            char_img_resized = character_img[:char_height, :char_width]
            if character_img.shape[2] == 4:
                alpha = char_img_resized[:, :, 3] / 255.0
                alpha = np.expand_dims(alpha, axis=2)
                for c in range(3):
                    background[start_y:end_y, start_x:end_x, c] = \
                        background[start_y:end_y, start_x:end_x, c] * (1 - alpha[:,:,0]) + \
                        char_img_resized[:, :, c] * alpha[:,:,0]
            else:
                mask = np.any(char_img_resized < [240, 240, 240], axis=2)
                background[start_y:end_y, start_x:end_x][mask] = char_img_resized[mask]
        return background
    
    def generate_video(self, character_images, output_path="sao_joao_dance.mp4", audio_path=None):
        print("Iniciando geração do vídeo...")
        print(f"Total de personagens: {len(character_images)}")
        
        valid_images = []
        for img_path in character_images:
            if os.path.exists(img_path):
                valid_images.append(img_path)
                print(f"✓ Encontrada: {os.path.basename(img_path)}")
            else:
                print(f"✗ Não encontrada: {img_path}")
        
        if not valid_images:
            print("Nenhuma imagem válida encontrada! Usando personagens dummy.")
            valid_images = ["dummy"] * 5
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        temp_dir = tempfile.gettempdir()
        temp_video_path = os.path.join(temp_dir, 'temp_video.mp4')
        print(f"Salvando vídeo temporário em: {temp_video_path}")
        
        out = cv2.VideoWriter(temp_video_path, fourcc, self.fps, (self.width, self.height))
        if not out.isOpened():
            print("Erro: VideoWriter não pôde ser aberto.")
            return
        
        total_frames = self.fps * self.total_duration
        frames_per_character = self.fps * self.character_duration
        
        current_frame = 0
        character_index = 0
        
        while current_frame < total_frames:
            char_img_path = valid_images[character_index % len(valid_images)]
            
            if char_img_path == "dummy":
                char_img = self.create_dummy_character()
            else:
                try:
                    char_img = cv2.imread(char_img_path, cv2.IMREAD_UNCHANGED)
                    if char_img is None:
                        print(f"Erro ao carregar {char_img_path}, usando dummy")
                        char_img = self.create_dummy_character()
                except Exception as e:
                    print(f"Erro ao carregar {char_img_path}: {e}")
                    char_img = self.create_dummy_character()
            
            animations = ['bounce', 'wiggle', 'spin', 'shake', 'sway', 'hop']
            current_animation = random.choice(animations)
            
            print(f"Processando personagem {character_index + 1}/{len(valid_images)} com animação {current_animation}")
            animation_transforms = self.create_dance_animation(char_img, current_animation, frames_per_character)
            
            for i in range(frames_per_character):
                if current_frame >= total_frames:
                    break
                
                frame = self.create_background_frame()
                transform = animation_transforms[i % len(animation_transforms)]
                transformed_img, x_off, y_off = self.apply_transform(char_img.copy(), transform)
                frame = self.overlay_character(frame, transformed_img, x_off, y_off)
                
                out.write(frame)
                current_frame += 1
                
                if current_frame % (self.fps * 5) == 0:
                    progress = (current_frame / total_frames) * 100
                    print(f"Progresso: {progress:.1f}%")
            
            character_index += 1
        
        out.release()
        print("Vídeo base criado!")
        
        if audio_path and os.path.exists(audio_path):
            print("Adicionando áudio...")
            try:
                video = VideoFileClip(temp_video_path)
                audio = AudioFileClip(audio_path)

                if audio.duration < video.duration:
                    audio = audio.loop(duration=video.duration)
                else:
                    audio = audio.subclip(0, video.duration)

                final_video = video.set_audio(audio)
                final_video.write_videofile(output_path, codec='libx264', audio_codec='aac')

            except Exception as e:
                print(f"Erro ao adicionar áudio: {e}")
                print("Salvando vídeo sem áudio...")
                # Certifique de fechar objetos antes de renomear:
                if 'video' in locals():
                    video.close()
                if 'audio' in locals():
                    audio.close()
                if os.path.exists(temp_video_path):
                    os.rename(temp_video_path, output_path)
            else:
                # Se tudo deu certo, fecha e remove temporário
                video.close()
                audio.close()
                if os.path.exists(temp_video_path):
                    os.remove(temp_video_path)
        
        print(f"Vídeo finalizado: {output_path}")
    
    def create_dummy_character(self):
        img = np.ones((400, 300, 3), dtype=np.uint8) * 255
        cv2.circle(img, (150, 100), 50, (255, 220, 177), -1)
        cv2.circle(img, (130, 85), 8, (0, 0, 0), -1)
        cv2.circle(img, (170, 85), 8, (0, 0, 0), -1)
        cv2.ellipse(img, (150, 110), (20, 10), 0, 0, 180, (255, 0, 0), -1)
        cv2.rectangle(img, (100, 40), (200, 70), (255, 255, 0), -1)
        cv2.rectangle(img, (110, 70), (190, 85), (139, 69, 19), -1)
        cv2.rectangle(img, (120, 150), (180, 250), (255, 0, 0), -1)
        cv2.rectangle(img, (80, 170), (120, 200), (255, 220, 177), -1)
        cv2.rectangle(img, (180, 170), (220, 200), (255, 220, 177), -1)
        cv2.rectangle(img, (130, 250), (150, 350), (0, 0, 255), -1)
        cv2.rectangle(img, (150, 250), (170, 350), (0, 0, 255), -1)
        return img

def main():
    generator = SaoJoaoVideoGenerator()
    
    base_dir = r"C:\Users\Viana e Moura.VM210490\Documents\GitHub\Curriculo_IA_2.0\Decoracao_SJ"
    character_files = [
        "Matheus.png","Pipe.png","Silvio.png","Cleydson.png","Blenda.png","Igor.png",
        "Agnes.png","Irmao.png","Daphine.png","Leandro.png","Vinicius.png","Carlito.png",
        "Mel.png","Babi.png","Nath.png","Kassia.png","Eduardo.png","Alycia.png",
        "Gabriel.png","Gabriel2.0.png","Geovana.png","Rodrigo.png","Cami.png","Tuca.png"
    ]
    character_images = [os.path.join(base_dir, f) for f in character_files]
    
    audio_path = os.path.join(base_dir, "sao_joao_musica.mp3")
    output_path = os.path.join(base_dir, "video_sao_joao_final.mp4")
    
    print("=== GERADOR DE VÍDEO SÃO JOÃO ===")
    print(f"Pasta base: {base_dir}")
    print(f"Música: {audio_path}")
    print(f"Vídeo de saída: {output_path}\n")
    
    generator.generate_video(
        character_images=character_images,
        output_path=output_path,
        audio_path=audio_path if os.path.exists(audio_path) else None
    )

if __name__ == "__main__":
    main()