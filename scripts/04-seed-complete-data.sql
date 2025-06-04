<<<<<<< HEAD
-- Dados completos para demonstração

-- Inserir empresa exemplo
INSERT INTO companies (id, name, logo_url, website, industry, size, description) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Viana e Moura Construções', '/logo.png', 'https://vianamoura.com', 'Construção Civil', '50-200', 'Empresa líder em construção civil e engenharia')
ON CONFLICT (id) DO NOTHING;

-- Atualizar vagas existentes com company_id
UPDATE jobs SET company_id = '550e8400-e29b-41d4-a716-446655440000' WHERE company_id IS NULL;

-- Inserir templates de email
INSERT INTO email_templates (name, subject, body, type, company_id) VALUES 
(
  'Boas-vindas',
  'Bem-vindo ao Sistema ATS - Viana e Moura',
  'Olá {{name}},\n\nSeja bem-vindo ao sistema de recrutamento da Viana e Moura!\n\nSeu acesso foi criado com sucesso. Você pode fazer login em: {{login_url}}\n\nAtenciosamente,\nEquipe Viana e Moura',
  'welcome',
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  'Convite para Entrevista',
  'Convite para Entrevista - {{job_title}}',
  'Olá {{candidate_name}},\n\nTemos o prazer de convidá-lo para uma entrevista para a vaga de {{job_title}}.\n\nData: {{interview_date}}\nHorário: {{interview_time}}\nLocal: {{interview_location}}\n\nPor favor, confirme sua presença.\n\nAtenciosamente,\nEquipe de Recrutamento',
  'interview_invite',
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  'Feedback Negativo',
  'Processo Seletivo - {{job_title}}',
  'Olá {{candidate_name}},\n\nAgradecemos seu interesse na vaga de {{job_title}} e o tempo dedicado ao nosso processo seletivo.\n\nApós análise cuidadosa, decidimos seguir com outros candidatos neste momento.\n\nDesejamos sucesso em sua busca profissional.\n\nAtenciosamente,\nEquipe de Recrutamento',
  'rejection',
  '550e8400-e29b-41d4-a716-446655440000'
)
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão atualizadas
INSERT INTO settings (key, value) VALUES 
(
  'ai_extraction_config',
  '{
    "extract_personal_info": true,
    "extract_education": true,
    "extract_experience": true,
    "extract_skills": true,
    "extract_languages": true,
    "extract_certifications": true,
    "auto_create_candidate": true,
    "confidence_threshold": 0.7
  }'
),
(
  'email_config',
  '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "from_email": "noreply@vianamoura.com",
    "from_name": "Viana e Moura - Sistema ATS"
  }'
),
(
  'notification_config',
  '{
    "new_application": true,
    "interview_scheduled": true,
    "candidate_status_change": true,
    "daily_summary": true
  }'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
=======
-- Dados completos para demonstração

-- Inserir empresa exemplo
INSERT INTO companies (id, name, logo_url, website, industry, size, description) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Viana e Moura Construções', '/logo.png', 'https://vianamoura.com', 'Construção Civil', '50-200', 'Empresa líder em construção civil e engenharia')
ON CONFLICT (id) DO NOTHING;

-- Atualizar vagas existentes com company_id
UPDATE jobs SET company_id = '550e8400-e29b-41d4-a716-446655440000' WHERE company_id IS NULL;

-- Inserir templates de email
INSERT INTO email_templates (name, subject, body, type, company_id) VALUES 
(
  'Boas-vindas',
  'Bem-vindo ao Sistema ATS - Viana e Moura',
  'Olá {{name}},\n\nSeja bem-vindo ao sistema de recrutamento da Viana e Moura!\n\nSeu acesso foi criado com sucesso. Você pode fazer login em: {{login_url}}\n\nAtenciosamente,\nEquipe Viana e Moura',
  'welcome',
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  'Convite para Entrevista',
  'Convite para Entrevista - {{job_title}}',
  'Olá {{candidate_name}},\n\nTemos o prazer de convidá-lo para uma entrevista para a vaga de {{job_title}}.\n\nData: {{interview_date}}\nHorário: {{interview_time}}\nLocal: {{interview_location}}\n\nPor favor, confirme sua presença.\n\nAtenciosamente,\nEquipe de Recrutamento',
  'interview_invite',
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  'Feedback Negativo',
  'Processo Seletivo - {{job_title}}',
  'Olá {{candidate_name}},\n\nAgradecemos seu interesse na vaga de {{job_title}} e o tempo dedicado ao nosso processo seletivo.\n\nApós análise cuidadosa, decidimos seguir com outros candidatos neste momento.\n\nDesejamos sucesso em sua busca profissional.\n\nAtenciosamente,\nEquipe de Recrutamento',
  'rejection',
  '550e8400-e29b-41d4-a716-446655440000'
)
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão atualizadas
INSERT INTO settings (key, value) VALUES 
(
  'ai_extraction_config',
  '{
    "extract_personal_info": true,
    "extract_education": true,
    "extract_experience": true,
    "extract_skills": true,
    "extract_languages": true,
    "extract_certifications": true,
    "auto_create_candidate": true,
    "confidence_threshold": 0.7
  }'
),
(
  'email_config',
  '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "from_email": "noreply@vianamoura.com",
    "from_name": "Viana e Moura - Sistema ATS"
  }'
),
(
  'notification_config',
  '{
    "new_application": true,
    "interview_scheduled": true,
    "candidate_status_change": true,
    "daily_summary": true
  }'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
>>>>>>> 431f324 (.)
