<<<<<<< HEAD
-- Tabelas para autenticação e sistema completo

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuário (complementa auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'recruiter',
  department VARCHAR(100),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  website VARCHAR(255),
  industry VARCHAR(100),
  size VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualizar tabela de usuários para incluir company_id
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- Tabela de convites
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'recruiter',
  company_id UUID REFERENCES companies(id),
  invited_by UUID REFERENCES profiles(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualizar tabela de vagas
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50) DEFAULT 'full-time';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS remote_type VARCHAR(50) DEFAULT 'office';

-- Atualizar tabela de candidatos
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Brasil';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS education JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS experience JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS skills JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS languages JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS certifications JSONB;

-- Tabela de entrevistas
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  type VARCHAR(50) DEFAULT 'video', -- video, phone, in-person
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
  meeting_url VARCHAR(500),
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES profiles(id),
  criteria JSONB NOT NULL, -- {technical: 8, communication: 9, culture_fit: 7}
  overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 10),
  strengths TEXT,
  weaknesses TEXT,
  recommendation VARCHAR(50), -- hire, reject, maybe
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates de email
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- welcome, interview_invite, rejection, etc
  company_id UUID REFERENCES companies(id),
  created_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- info, success, warning, error
  read_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para companies
CREATE POLICY "Users can view own company" ON companies FOR SELECT USING (
  id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Políticas para jobs
CREATE POLICY "Users can view company jobs" ON jobs FOR SELECT USING (
  company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage company jobs" ON jobs FOR ALL USING (
  company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Funções para triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
=======
-- Tabelas para autenticação e sistema completo

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuário (complementa auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'recruiter',
  department VARCHAR(100),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  website VARCHAR(255),
  industry VARCHAR(100),
  size VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualizar tabela de usuários para incluir company_id
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- Tabela de convites
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'recruiter',
  company_id UUID REFERENCES companies(id),
  invited_by UUID REFERENCES profiles(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualizar tabela de vagas
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50) DEFAULT 'full-time';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS remote_type VARCHAR(50) DEFAULT 'office';

-- Atualizar tabela de candidatos
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Brasil';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS education JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS experience JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS skills JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS languages JSONB;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS certifications JSONB;

-- Tabela de entrevistas
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  type VARCHAR(50) DEFAULT 'video', -- video, phone, in-person
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
  meeting_url VARCHAR(500),
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES profiles(id),
  criteria JSONB NOT NULL, -- {technical: 8, communication: 9, culture_fit: 7}
  overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 10),
  strengths TEXT,
  weaknesses TEXT,
  recommendation VARCHAR(50), -- hire, reject, maybe
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates de email
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- welcome, interview_invite, rejection, etc
  company_id UUID REFERENCES companies(id),
  created_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- info, success, warning, error
  read_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para companies
CREATE POLICY "Users can view own company" ON companies FOR SELECT USING (
  id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Políticas para jobs
CREATE POLICY "Users can view company jobs" ON jobs FOR SELECT USING (
  company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage company jobs" ON jobs FOR ALL USING (
  company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Funções para triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
>>>>>>> 431f324 (.)
