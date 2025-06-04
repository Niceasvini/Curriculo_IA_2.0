// Serviço de IA avançado para análise completa de currículos
export interface PersonalInfo {
  name: string
  email: string
  phone: string
  linkedin?: string
  github?: string
  portfolio?: string
  address?: string
  city?: string
  state?: string
  country?: string
  birth_date?: string
  gender?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string
  gpa?: string
  description?: string
}

export interface Experience {
  company: string
  position: string
  start_date: string
  end_date: string
  current: boolean
  description: string
  technologies?: string[]
}

export interface Skill {
  name: string
  level: "Básico" | "Intermediário" | "Avançado" | "Especialista"
  category: "Técnica" | "Soft Skill" | "Idioma" | "Ferramenta"
}

export interface Language {
  name: string
  level: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo"
}

export interface Certification {
  name: string
  issuer: string
  date: string
  expiry_date?: string
  credential_id?: string
}

export interface CompleteAnalysis {
  personal_info: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  summary: string
  compatibility_score: number
  keywords: string[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string
  confidence_score: number
}

export class AIService {
  static async analyzeCompleteResume(resumeText: string, jobRequirements?: string): Promise<CompleteAnalysis> {
    // Simulação de análise completa com IA
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Extrair informações pessoais
    const personalInfo = this.extractPersonalInfo(resumeText)

    // Extrair educação
    const education = this.extractEducation(resumeText)

    // Extrair experiência
    const experience = this.extractExperience(resumeText)

    // Extrair habilidades
    const skills = this.extractSkills(resumeText)

    // Extrair idiomas
    const languages = this.extractLanguages(resumeText)

    // Extrair certificações
    const certifications = this.extractCertifications(resumeText)

    // Gerar resumo
    const summary = this.generateSummary(resumeText, experience, education)

    // Calcular score de compatibilidade
    const compatibilityScore = jobRequirements
      ? this.calculateCompatibilityScore(resumeText, jobRequirements)
      : Math.floor(Math.random() * 30) + 70

    // Extrair palavras-chave
    const keywords = this.extractKeywords(resumeText, jobRequirements)

    // Identificar pontos fortes e fracos
    const strengths = this.identifyStrengths(experience, skills, education)
    const weaknesses = this.identifyWeaknesses(resumeText, skills)

    // Gerar recomendações
    const recommendations = this.generateRecommendations(compatibilityScore, strengths, weaknesses)

    return {
      personal_info: personalInfo,
      education,
      experience,
      skills,
      languages,
      certifications,
      summary,
      compatibility_score: compatibilityScore,
      keywords,
      strengths,
      weaknesses,
      recommendations,
      confidence_score: Math.floor(Math.random() * 20) + 80,
    }
  }

  private static extractPersonalInfo(resumeText: string): PersonalInfo {
    // Simulação de extração de dados pessoais
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g
    const phoneRegex = /$$?\d{2}$$?\s?\d{4,5}-?\d{4}/g
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/g
    const githubRegex = /github\.com\/[\w-]+/g

    const emails = resumeText.match(emailRegex) || []
    const phones = resumeText.match(phoneRegex) || []
    const linkedins = resumeText.match(linkedinRegex) || []
    const githubs = resumeText.match(githubRegex) || []

    // Extrair nome (primeira linha geralmente)
    const lines = resumeText.split("\n").filter((line) => line.trim())
    const name = lines[0]?.trim() || "Nome não identificado"

    return {
      name,
      email: emails[0] || "",
      phone: phones[0] || "",
      linkedin: linkedins[0] ? `https://${linkedins[0]}` : undefined,
      github: githubs[0] ? `https://${githubs[0]}` : undefined,
      city: this.extractCity(resumeText),
      state: this.extractState(resumeText),
      country: "Brasil",
    }
  }

  private static extractCity(text: string): string {
    const cities = [
      "São Paulo",
      "Rio de Janeiro",
      "Belo Horizonte",
      "Brasília",
      "Salvador",
      "Fortaleza",
      "Curitiba",
      "Recife",
      "Porto Alegre",
      "Goiânia",
    ]
    for (const city of cities) {
      if (text.toLowerCase().includes(city.toLowerCase())) {
        return city
      }
    }
    return ""
  }

  private static extractState(text: string): string {
    const states = ["SP", "RJ", "MG", "DF", "BA", "CE", "PR", "PE", "RS", "GO"]
    for (const state of states) {
      if (text.includes(state)) {
        return state
      }
    }
    return ""
  }

  private static extractEducation(resumeText: string): Education[] {
    // Simulação de extração de educação
    const educationKeywords = [
      "universidade",
      "faculdade",
      "curso",
      "graduação",
      "pós-graduação",
      "mestrado",
      "doutorado",
      "técnico",
    ]
    const hasEducation = educationKeywords.some((keyword) => resumeText.toLowerCase().includes(keyword))

    if (!hasEducation) return []

    return [
      {
        institution: "Universidade de São Paulo",
        degree: "Bacharelado",
        field: "Ciência da Computação",
        start_date: "2018-01-01",
        end_date: "2021-12-01",
        description: "Formação em Ciência da Computação com foco em desenvolvimento de software",
      },
    ]
  }

  private static extractExperience(resumeText: string): Experience[] {
    // Simulação de extração de experiência
    const experienceKeywords = [
      "experiência",
      "trabalho",
      "empresa",
      "desenvolvedor",
      "analista",
      "gerente",
      "coordenador",
    ]
    const hasExperience = experienceKeywords.some((keyword) => resumeText.toLowerCase().includes(keyword))

    if (!hasExperience) return []

    return [
      {
        company: "Tech Solutions Ltda",
        position: "Desenvolvedor Frontend",
        start_date: "2022-01-01",
        end_date: "2024-01-01",
        current: false,
        description:
          "Desenvolvimento de aplicações web usando React, TypeScript e Next.js. Responsável por criar interfaces responsivas e otimizadas.",
        technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      },
      {
        company: "StartupXYZ",
        position: "Desenvolvedor Full Stack",
        start_date: "2021-06-01",
        end_date: "2021-12-01",
        current: false,
        description:
          "Desenvolvimento de MVP usando Node.js e React. Implementação de APIs REST e integração com banco de dados.",
        technologies: ["Node.js", "React", "MongoDB", "Express"],
      },
    ]
  }

  private static extractSkills(resumeText: string): Skill[] {
    const techSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "Git", "Docker", "AWS"]
    const softSkills = ["Comunicação", "Liderança", "Trabalho em equipe", "Resolução de problemas", "Criatividade"]

    const foundTechSkills = techSkills.filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase()))

    const foundSoftSkills = softSkills.filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase()))

    const skills: Skill[] = []

    foundTechSkills.forEach((skill) => {
      skills.push({
        name: skill,
        level: ["Básico", "Intermediário", "Avançado", "Especialista"][Math.floor(Math.random() * 4)] as any,
        category: "Técnica",
      })
    })

    foundSoftSkills.forEach((skill) => {
      skills.push({
        name: skill,
        level: ["Intermediário", "Avançado"][Math.floor(Math.random() * 2)] as any,
        category: "Soft Skill",
      })
    })

    return skills
  }

  private static extractLanguages(resumeText: string): Language[] {
    const languages: Language[] = [{ name: "Português", level: "Nativo" }]

    if (resumeText.toLowerCase().includes("inglês") || resumeText.toLowerCase().includes("english")) {
      languages.push({ name: "Inglês", level: "Avançado" })
    }

    if (resumeText.toLowerCase().includes("espanhol") || resumeText.toLowerCase().includes("spanish")) {
      languages.push({ name: "Espanhol", level: "Intermediário" })
    }

    return languages
  }

  private static extractCertifications(resumeText: string): Certification[] {
    const certificationKeywords = ["certificação", "certificado", "aws", "azure", "google cloud", "scrum", "pmp"]
    const hasCertifications = certificationKeywords.some((keyword) => resumeText.toLowerCase().includes(keyword))

    if (!hasCertifications) return []

    return [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023-06-01",
        expiry_date: "2026-06-01",
      },
    ]
  }

  private static generateSummary(resumeText: string, experience: Experience[], education: Education[]): string {
    const yearsOfExperience = experience.length > 0 ? experience.length + 1 : 0
    const mainTech = experience.length > 0 ? experience[0].technologies?.slice(0, 3).join(", ") : "tecnologias diversas"
    const degree = education.length > 0 ? education[0].field : "área técnica"

    return `Profissional com ${yearsOfExperience} anos de experiência em desenvolvimento de software, especializado em ${mainTech}. Formação em ${degree} com sólido conhecimento em tecnologias modernas e metodologias ágeis. Demonstra capacidade de trabalhar em equipe e entregar soluções de qualidade.`
  }

  private static calculateCompatibilityScore(resumeText: string, jobRequirements: string): number {
    const keywords = this.extractKeywords(resumeText, jobRequirements)
    const baseScore = Math.min(keywords.length * 15 + Math.random() * 30, 100)
    return Math.round(baseScore)
  }

  private static extractKeywords(resumeText: string, jobRequirements?: string): string[] {
    const commonTechKeywords = [
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Python",
      "Java",
      "SQL",
      "AWS",
      "Docker",
      "Git",
      "Next.js",
      "Vue.js",
      "Angular",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "Kubernetes",
      "GraphQL",
    ]

    const allKeywords = [...commonTechKeywords]

    if (jobRequirements) {
      // Extrair palavras-chave específicas dos requisitos da vaga
      const jobKeywords = jobRequirements.split(/[,\s]+/).filter((word) => word.length > 2)
      allKeywords.push(...jobKeywords)
    }

    return allKeywords.filter((keyword) => resumeText.toLowerCase().includes(keyword.toLowerCase())).slice(0, 8)
  }

  private static identifyStrengths(experience: Experience[], skills: Skill[], education: Education[]): string[] {
    const strengths = []

    if (experience.length >= 2) {
      strengths.push("Experiência sólida no mercado de trabalho")
    }

    if (skills.filter((s) => s.level === "Avançado" || s.level === "Especialista").length >= 3) {
      strengths.push("Domínio avançado de tecnologias relevantes")
    }

    if (education.length > 0) {
      strengths.push("Formação acadêmica sólida")
    }

    if (skills.some((s) => s.category === "Soft Skill")) {
      strengths.push("Boas habilidades interpessoais")
    }

    strengths.push("Perfil técnico alinhado com as necessidades da vaga")

    return strengths.slice(0, 4)
  }

  private static identifyWeaknesses(resumeText: string, skills: Skill[]): string[] {
    const weaknesses = []

    if (!resumeText.toLowerCase().includes("liderança")) {
      weaknesses.push("Pouca experiência em liderança de equipes")
    }

    if (skills.filter((s) => s.level === "Básico").length > 2) {
      weaknesses.push("Algumas tecnologias ainda em nível básico")
    }

    if (!resumeText.toLowerCase().includes("inglês")) {
      weaknesses.push("Não menciona conhecimento em inglês")
    }

    return weaknesses.slice(0, 2)
  }

  private static generateRecommendations(score: number, strengths: string[], weaknesses: string[]): string {
    if (score >= 90) {
      return "Candidato excepcional! Recomendo prosseguir imediatamente para entrevista final. Perfil altamente alinhado com a vaga."
    }
    if (score >= 80) {
      return "Excelente candidato! Agendar entrevista técnica para validar conhecimentos específicos."
    }
    if (score >= 70) {
      return "Bom candidato com potencial. Considerar para entrevista inicial e avaliar fit cultural."
    }
    if (score >= 60) {
      return "Candidato com perfil interessante, mas algumas lacunas. Avaliar se há possibilidade de desenvolvimento interno."
    }
    return "Candidato não atende aos requisitos mínimos da vaga no momento."
  }

  // Método legado para compatibilidade
  static async analyzeResume(resumeText: string, jobRequirements: string) {
    const completeAnalysis = await this.analyzeCompleteResume(resumeText, jobRequirements)

    return {
      compatibility_score: completeAnalysis.compatibility_score,
      keywords: completeAnalysis.keywords,
      strengths: completeAnalysis.strengths,
      weaknesses: completeAnalysis.weaknesses,
      recommendations: completeAnalysis.recommendations,
      highlighted_sections: [completeAnalysis.summary],
    }
  }
}
