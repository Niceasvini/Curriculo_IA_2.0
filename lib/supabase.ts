import { createClient } from "@supabase/supabase-js"

// Use fallback values for development/preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

// Check if we have valid Supabase credentials
const hasValidCredentials =
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your-anon-key" &&
  supabaseUrl.includes("supabase.co")

export const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseAnonKey) : null

// Mock data for when Supabase is not configured
export const mockData = {
  jobs: [
    {
      id: "1",
      title: "Desenvolvedor Frontend React",
      department: "Tecnologia",
      status: "ativa",
      created_at: "2024-01-15T10:00:00Z",
      description: "Desenvolvedor React com experiência em TypeScript",
      requirements: "React, TypeScript, Next.js",
      location: "São Paulo, SP",
    },
    {
      id: "2",
      title: "Designer UX/UI",
      department: "Design",
      status: "ativa",
      created_at: "2024-01-10T14:30:00Z",
      description: "Designer com foco em experiência do usuário",
      requirements: "Figma, Adobe XD, Prototipagem",
      location: "Remote",
    },
  ],
  candidates: [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      job_id: "1",
      job_title: "Desenvolvedor Frontend React",
      score: 85,
      status: "aprovado",
      created_at: "2024-01-16T09:00:00Z",
      resume_url: null,
      keywords: ["React", "TypeScript", "JavaScript"],
      feedback: "Candidato com boa experiência em React",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      job_id: "1",
      job_title: "Desenvolvedor Frontend React",
      score: 72,
      status: "pendente",
      created_at: "2024-01-17T11:30:00Z",
      resume_url: null,
      keywords: ["React", "CSS", "HTML"],
      feedback: null,
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@email.com",
      job_id: "2",
      job_title: "Designer UX/UI",
      score: 90,
      status: "contratado",
      created_at: "2024-01-12T16:45:00Z",
      resume_url: null,
      keywords: ["Figma", "UX", "UI", "Prototipagem"],
      feedback: "Excelente portfólio e experiência",
    },
  ],
  activities: [
    {
      id: "1",
      description: "João Silva foi aprovado na vaga Desenvolvedor Frontend React",
      created_at: "2024-01-16T09:00:00Z",
    },
    {
      id: "2",
      description: "Nova vaga Designer UX/UI foi criada",
      created_at: "2024-01-10T14:30:00Z",
    },
    {
      id: "3",
      description: "Pedro Costa foi contratado para Designer UX/UI",
      created_at: "2024-01-12T16:45:00Z",
    },
  ],
}

// Helper function to check if Supabase is available
export const isSupabaseConfigured = () => hasValidCredentials && supabase !== null

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          description: string | null
          requirements: string | null
          department: string | null
          location: string | null
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          requirements?: string | null
          department?: string | null
          location?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          requirements?: string | null
          department?: string | null
          location?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          resume_url: string | null
          resume_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          resume_url?: string | null
          resume_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          resume_url?: string | null
          resume_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string | null
          candidate_id: string | null
          status: string
          compatibility_score: number
          ai_analysis: any | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id?: string | null
          candidate_id?: string | null
          status?: string
          compatibility_score?: number
          ai_analysis?: any | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string | null
          candidate_id?: string | null
          status?: string
          compatibility_score?: number
          ai_analysis?: any | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          type: string
          description: string
          user_id: string | null
          related_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          description: string
          user_id?: string | null
          related_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          description?: string
          user_id?: string | null
          related_id?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
