<<<<<<< HEAD
-- Inserir dados de exemplo

-- Usuário exemplo
INSERT INTO users (email, name, role) VALUES 
('admin@vianamoura.com', 'Administrador', 'admin'),
('recruiter@vianamoura.com', 'Recrutador', 'recruiter')
ON CONFLICT (email) DO NOTHING;

-- Vagas exemplo
INSERT INTO jobs (title, description, requirements, department, location, status, created_by) VALUES 
('Desenvolvedor Frontend', 'Desenvolvedor React/Next.js para projetos web', 'React, TypeScript, CSS', 'Tecnologia', 'São Paulo, SP', 'active', (SELECT id FROM users WHERE email = 'admin@vianamoura.com' LIMIT 1)),
('Analista de RH', 'Analista para recrutamento e seleção', 'Psicologia, Experiência em RH', 'Recursos Humanos', 'Rio de Janeiro, RJ', 'active', (SELECT id FROM users WHERE email = 'admin@vianamoura.com' LIMIT 1)),
('Gerente de Projetos', 'Gerenciamento de projetos de construção', 'PMP, Experiência em construção civil', 'Projetos', 'Brasília, DF', 'active', (SELECT id FROM users WHERE email = 'admin@vianamoura.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Candidatos exemplo
INSERT INTO candidates (name, email, phone, resume_text) VALUES 
('João Silva', 'joao@email.com', '(11) 99999-9999', 'Desenvolvedor com 5 anos de experiência em React, TypeScript e Node.js. Formado em Ciência da Computação.'),
('Maria Santos', 'maria@email.com', '(21) 88888-8888', 'Analista de RH com 3 anos de experiência em recrutamento e seleção. Formada em Psicologia.'),
('Pedro Oliveira', 'pedro@email.com', '(61) 77777-7777', 'Gerente de projetos com certificação PMP e 8 anos de experiência em construção civil.')
ON CONFLICT DO NOTHING;

-- Aplicações exemplo
INSERT INTO applications (job_id, candidate_id, status, compatibility_score, ai_analysis) VALUES 
((SELECT id FROM jobs WHERE title = 'Desenvolvedor Frontend' LIMIT 1), (SELECT id FROM candidates WHERE name = 'João Silva' LIMIT 1), 'approved', 95, '{"keywords": ["React", "TypeScript"], "strengths": ["Experiência sólida", "Tecnologias atuais"], "recommendations": "Candidato altamente qualificado"}'),
((SELECT id FROM jobs WHERE title = 'Analista de RH' LIMIT 1), (SELECT id FROM candidates WHERE name = 'Maria Santos' LIMIT 1), 'interview', 88, '{"keywords": ["RH", "Psicologia"], "strengths": ["Formação adequada", "Experiência relevante"], "recommendations": "Agendar entrevista"}'),
((SELECT id FROM jobs WHERE title = 'Gerente de Projetos' LIMIT 1), (SELECT id FROM candidates WHERE name = 'Pedro Oliveira' LIMIT 1), 'pending', 92, '{"keywords": ["PMP", "Construção"], "strengths": ["Certificação", "Experiência"], "recommendations": "Excelente perfil"}')
ON CONFLICT DO NOTHING;

-- Configurações padrão
INSERT INTO settings (key, value) VALUES 
('analysis_criteria', '{"keywords_weight": 40, "experience_weight": 30, "education_weight": 20, "skills_weight": 10}'),
('theme', '{"mode": "light", "primary_color": "#B91C1C", "secondary_color": "#D97706"}')
ON CONFLICT (key) DO NOTHING;
=======
-- Inserir dados de exemplo

-- Usuário exemplo
INSERT INTO users (email, name, role) VALUES 
('admin@vianamoura.com', 'Administrador', 'admin'),
('recruiter@vianamoura.com', 'Recrutador', 'recruiter')
ON CONFLICT (email) DO NOTHING;

-- Vagas exemplo
INSERT INTO jobs (title, description, requirements, department, location, status, created_by) VALUES 
('Desenvolvedor Frontend', 'Desenvolvedor React/Next.js para projetos web', 'React, TypeScript, CSS', 'Tecnologia', 'São Paulo, SP', 'active', (SELECT id FROM users WHERE email = 'admin@vianamoura.com' LIMIT 1)),
('Analista de RH', 'Analista para recrutamento e seleção', 'Psicologia, Experiência em RH', 'Recursos Humanos', 'Rio de Janeiro, RJ', 'active', (SELECT id FROM users WHERE email = 'admin@vianamoura.com' LIMIT 1)),
('Gerente de Projetos', 'Gerenciamento de projetos de construção', 'PMP, Experiência em construção civil', 'Projetos', 'Brasília, DF', 'active', (SELECT id FROM users WHERE email = 'admin@vianamoura.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Candidatos exemplo
INSERT INTO candidates (name, email, phone, resume_text) VALUES 
('João Silva', 'joao@email.com', '(11) 99999-9999', 'Desenvolvedor com 5 anos de experiência em React, TypeScript e Node.js. Formado em Ciência da Computação.'),
('Maria Santos', 'maria@email.com', '(21) 88888-8888', 'Analista de RH com 3 anos de experiência em recrutamento e seleção. Formada em Psicologia.'),
('Pedro Oliveira', 'pedro@email.com', '(61) 77777-7777', 'Gerente de projetos com certificação PMP e 8 anos de experiência em construção civil.')
ON CONFLICT DO NOTHING;

-- Aplicações exemplo
INSERT INTO applications (job_id, candidate_id, status, compatibility_score, ai_analysis) VALUES 
((SELECT id FROM jobs WHERE title = 'Desenvolvedor Frontend' LIMIT 1), (SELECT id FROM candidates WHERE name = 'João Silva' LIMIT 1), 'approved', 95, '{"keywords": ["React", "TypeScript"], "strengths": ["Experiência sólida", "Tecnologias atuais"], "recommendations": "Candidato altamente qualificado"}'),
((SELECT id FROM jobs WHERE title = 'Analista de RH' LIMIT 1), (SELECT id FROM candidates WHERE name = 'Maria Santos' LIMIT 1), 'interview', 88, '{"keywords": ["RH", "Psicologia"], "strengths": ["Formação adequada", "Experiência relevante"], "recommendations": "Agendar entrevista"}'),
((SELECT id FROM jobs WHERE title = 'Gerente de Projetos' LIMIT 1), (SELECT id FROM candidates WHERE name = 'Pedro Oliveira' LIMIT 1), 'pending', 92, '{"keywords": ["PMP", "Construção"], "strengths": ["Certificação", "Experiência"], "recommendations": "Excelente perfil"}')
ON CONFLICT DO NOTHING;

-- Configurações padrão
INSERT INTO settings (key, value) VALUES 
('analysis_criteria', '{"keywords_weight": 40, "experience_weight": 30, "education_weight": 20, "skills_weight": 10}'),
('theme', '{"mode": "light", "primary_color": "#B91C1C", "secondary_color": "#D97706"}')
ON CONFLICT (key) DO NOTHING;
>>>>>>> 431f324 (.)
