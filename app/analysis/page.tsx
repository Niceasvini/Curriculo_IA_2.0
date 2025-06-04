"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  Brain,
  Star,
  CheckCircle,
  AlertCircle,
  Download,
  Zap,
  Target,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Code,
} from "lucide-react"
import { getJobs, createCandidate, createActivity } from "@/lib/database"
import { AIService, type CompleteAnalysis } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface Job {
  id: string
  title: string
  requirements: string
}

export default function AnalysisPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState("")
  const [analysis, setAnalysis] = useState<CompleteAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const { data, error } = await getJobs()
      if (error) throw error

      const activeJobs = (data || []).filter((job) => job.status === "active")
      setJobs(activeJobs)
    } catch (error) {
      console.error("Erro ao carregar vagas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vagas",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast({
        title: "Erro",
        description: "Apenas arquivos PDF são aceitos",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Máximo 10MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setIsAnalyzing(true)

    try {
      // Simulação de extração de texto do PDF
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockExtractedText = `
        João Silva
        Desenvolvedor Frontend Sênior
        Email: joao.silva@email.com
        Telefone: (11) 99999-9999
        LinkedIn: linkedin.com/in/joaosilva
        GitHub: github.com/joaosilva
        São Paulo, SP - Brasil
        
        RESUMO PROFISSIONAL
        Desenvolvedor Frontend com 5 anos de experiência em desenvolvimento web, especializado em React, TypeScript e Next.js. 
        Experiência sólida em metodologias ágeis, trabalho em equipe e entrega de soluções de alta qualidade.
        
        EXPERIÊNCIA PROFISSIONAL
        
        Tech Solutions Ltda - Desenvolvedor Frontend Sênior (Jan 2022 - Presente)
        • Desenvolvimento de aplicações web usando React, TypeScript e Next.js
        • Implementação de interfaces responsivas e otimizadas
        • Colaboração com equipes de design e backend
        • Mentoria de desenvolvedores júnior
        • Tecnologias: React, TypeScript, Next.js, Tailwind CSS, Jest
        
        StartupXYZ - Desenvolvedor Full Stack (Jun 2021 - Dez 2021)
        • Desenvolvimento de MVP usando Node.js e React
        • Implementação de APIs REST e integração com banco de dados
        • Deploy e manutenção em AWS
        • Tecnologias: Node.js, React, MongoDB, Express, AWS
        
        WebDev Agency - Desenvolvedor Frontend Júnior (Mar 2020 - Mai 2021)
        • Desenvolvimento de sites institucionais e e-commerce
        • Manutenção e otimização de aplicações existentes
        • Tecnologias: HTML, CSS, JavaScript, WordPress
        
        FORMAÇÃO ACADÊMICA
        
        Universidade de São Paulo (USP) - Bacharelado em Ciência da Computação (2018-2021)
        • Formação sólida em algoritmos, estruturas de dados e engenharia de software
        • Projeto final: Sistema de gerenciamento acadêmico usando React e Node.js
        
        CERTIFICAÇÕES
        • AWS Certified Developer Associate (2023)
        • Scrum Master Certified (2022)
        • React Advanced Certification - Rocketseat (2021)
        
        HABILIDADES TÉCNICAS
        • Frontend: React, TypeScript, JavaScript, Next.js, Vue.js, HTML5, CSS3
        • Backend: Node.js, Express, Python, Java
        • Banco de Dados: MongoDB, PostgreSQL, MySQL
        • Cloud: AWS, Vercel, Netlify
        • Ferramentas: Git, Docker, Jest, Cypress
        • Metodologias: Scrum, Kanban, TDD
        
        IDIOMAS
        • Português: Nativo
        • Inglês: Avançado (TOEFL 95/120)
        • Espanhol: Intermediário
        
        PROJETOS DESTACADOS
        • E-commerce Platform: Plataforma completa usando Next.js e Stripe
        • Task Management App: Aplicativo de gerenciamento usando React e Firebase
        • Portfolio Website: Site pessoal com blog integrado
      `

      toast({
        title: "PDF processado",
        description: "Texto extraído com sucesso! Iniciando análise com IA...",
      })

      // Analisar automaticamente
      const selectedJob = jobs.find((job) => job.id === selectedJobId)
      const jobRequirements = selectedJob?.requirements || ""

      const completeAnalysis = await AIService.analyzeCompleteResume(mockExtractedText, jobRequirements)
      setAnalysis(completeAnalysis)

      toast({
        title: "Análise Concluída",
        description: `Currículo de ${completeAnalysis.personal_info.name} analisado com score de ${completeAnalysis.compatibility_score}%`,
      })

      // Registrar atividade
      await createActivity({
        type: "resume_analyzed",
        description: `Currículo de ${completeAnalysis.personal_info.name} analisado automaticamente com score de ${completeAnalysis.compatibility_score}%`,
        user_id: null,
      })
    } catch (error) {
      console.error("Erro no upload:", error)
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo PDF",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setIsAnalyzing(false)
    }
  }

  const handleSaveCandidate = async () => {
    if (!analysis) {
      toast({
        title: "Erro",
        description: "Nenhuma análise disponível para salvar",
        variant: "destructive",
      })
      return
    }

    if (!selectedJobId) {
      toast({
        title: "Erro",
        description: "Selecione uma vaga para continuar",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const candidateData = {
        name: analysis.personal_info.name,
        email: analysis.personal_info.email,
        phone: analysis.personal_info.phone,
        resume_text: analysis.summary,
        job_id: selectedJobId,
        score: analysis.compatibility_score,
        status:
          analysis.compatibility_score >= 80
            ? "interview"
            : analysis.compatibility_score >= 60
              ? "pending"
              : "rejected",
        keywords: analysis.keywords,
        feedback: analysis.recommendations,
      }

      const { error } = await createCandidate(candidateData)
      if (error) throw error

      // Registrar atividade
      await createActivity({
        type: "candidate_added",
        description: `Candidato ${analysis.personal_info.name} adicionado ao sistema automaticamente`,
        user_id: null,
      })

      toast({
        title: "Sucesso",
        description: "Candidato salvo com sucesso no sistema!",
      })

      // Limpar análise
      setAnalysis(null)
      setSelectedJobId("")
    } catch (error) {
      console.error("Erro ao salvar candidato:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o candidato",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBulkAnalysis = () => {
    toast({
      title: "Análise em Lote",
      description: "Funcionalidade de análise em lote será implementada em breve",
    })
  }

  const handleExportAnalysis = () => {
    if (!analysis) return

    const exportData = {
      candidato: analysis.personal_info,
      vaga: jobs.find((j) => j.id === selectedJobId)?.title,
      score: analysis.compatibility_score,
      educacao: analysis.education,
      experiencia: analysis.experience,
      habilidades: analysis.skills,
      idiomas: analysis.languages,
      certificacoes: analysis.certifications,
      resumo: analysis.summary,
      recomendacoes: analysis.recommendations,
      dataAnalise: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analise-completa-${analysis.personal_info.name.replace(/\s+/g, "-")}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: "Análise completa exportada com sucesso!",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-green-100 dark:bg-green-900/30"
    if (score >= 75) return "bg-blue-100 dark:bg-blue-900/30"
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30"
    return "bg-red-100 dark:bg-red-900/30"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excelente"
    if (score >= 75) return "Bom"
    if (score >= 60) return "Regular"
    return "Baixo"
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Especialista":
      case "Nativo":
      case "Fluente":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Avançado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Intermediário":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Análise Inteligente de Currículos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload de PDF com extração automática e análise completa por IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowHistory(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Histórico
          </Button>
          <Button variant="outline" onClick={handleBulkAnalysis}>
            <Zap className="w-4 h-4 mr-2" />
            Análise em Lote
          </Button>
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 px-3 py-1.5"
          >
            <Brain className="w-4 h-4 mr-1" />
            IA Avançada
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload e Configuração */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-red-100 rounded-md dark:bg-red-900/30">
                <Upload className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              Upload Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Vaga para Análise (Opcional)</Label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="mt-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-red-500">
                  <SelectValue placeholder="Selecione uma vaga para comparação" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">A IA analisará o currículo mesmo sem vaga selecionada</p>
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Upload de Currículo</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {isUploading || isAnalyzing ? (
                    <div className="flex flex-col items-center">
                      <Brain className="h-12 w-12 text-red-600 mb-4 animate-spin" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {isUploading ? "Extraindo texto do PDF..." : "Analisando com IA..."}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Arraste o PDF aqui</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">ou clique para selecionar</p>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Selecionar Arquivo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">PDF • Máximo 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {analysis && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-300">Análise Concluída</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Todos os dados foram extraídos automaticamente. Revise e salve o candidato.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultado da Análise */}
        <div className="lg:col-span-2">
          {!analysis ? (
            <Card className="dashboard-card h-full">
              <CardContent className="flex items-center justify-center h-full py-12">
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Aguardando Upload</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Faça upload de um currículo em PDF para ver a análise completa com extração automática de dados
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Informações Pessoais */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Informações Pessoais
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportAnalysis}>
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Nome</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{analysis.personal_info.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Email</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {analysis.personal_info.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Telefone</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {analysis.personal_info.phone}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Localização</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {analysis.personal_info.city}, {analysis.personal_info.state}
                      </p>
                    </div>
                    {analysis.personal_info.linkedin && (
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">LinkedIn</Label>
                        <a
                          href={analysis.personal_info.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {analysis.personal_info.linkedin}
                        </a>
                      </div>
                    )}
                    {analysis.personal_info.github && (
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">GitHub</Label>
                        <a
                          href={analysis.personal_info.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {analysis.personal_info.github}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Score de Compatibilidade */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    Score de Compatibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${getScoreBackground(analysis.compatibility_score)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Compatibilidade Geral</span>
                      <div className="flex items-center gap-2">
                        <Star className={`w-5 h-5 ${getScoreColor(analysis.compatibility_score)}`} />
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.compatibility_score)}`}>
                          {analysis.compatibility_score}%
                        </span>
                      </div>
                    </div>
                    <Progress value={analysis.compatibility_score} className="h-3 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Classificação: <span className="font-medium">{getScoreLabel(analysis.compatibility_score)}</span>
                      {selectedJobId && " • Baseado na vaga selecionada"}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Confiança da IA</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{analysis.confidence_score}%</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Palavras-chave</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {analysis.keywords.length} encontradas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experiência Profissional */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    Experiência Profissional ({analysis.experience.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{exp.position}</h4>
                            <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {exp.start_date} - {exp.current ? "Atual" : exp.end_date}
                            </p>
                          </div>
                          {exp.current && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Atual
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>
                        {exp.technologies && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Formação Acadêmica */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    Formação Acadêmica ({analysis.education.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {edu.degree} em {edu.field}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {edu.start_date} - {edu.end_date}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Habilidades */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    Habilidades ({analysis.skills.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Técnica", "Soft Skill", "Ferramenta"].map((category) => {
                      const categorySkills = analysis.skills.filter((skill) => skill.category === category)
                      if (categorySkills.length === 0) return null

                      return (
                        <div key={category}>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{category}</h4>
                          <div className="space-y-2">
                            {categorySkills.map((skill, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{skill.name}</span>
                                <Badge className={getLevelColor(skill.level)} variant="secondary">
                                  {skill.level}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Idiomas e Certificações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-indigo-600" />
                      Idiomas ({analysis.languages.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-900 dark:text-gray-100">{lang.name}</span>
                          <Badge className={getLevelColor(lang.level)} variant="secondary">
                            {lang.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Certificações ({analysis.certifications.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.certifications.map((cert, index) => (
                        <div key={index} className="border-l-4 border-yellow-500 pl-3 py-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">{cert.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">{cert.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumo e Recomendações */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-red-600" />
                    Análise da IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Resumo Profissional</Label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {analysis.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">Pontos Fortes</Label>
                      <ul className="mt-2 space-y-1">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">Pontos de Melhoria</Label>
                      <ul className="mt-2 space-y-1">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Recomendações</Label>
                    <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-300">{analysis.recommendations}</p>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    onClick={handleSaveCandidate}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {isSaving ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                        Salvando Candidato...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Salvar Candidato no Sistema
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Análises Hoje</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Score Médio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">82%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
                <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Auto-Salvos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg dark:bg-amber-900/30">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">PDFs Processados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
