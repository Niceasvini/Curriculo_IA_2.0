"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getCandidates, updateCandidate, createCandidate, createActivity } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { AIService } from "@/lib/ai-service"

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  job_id: string
  job_title: string
  score: number
  status: string
  created_at: string
  resume_url: string | null
  keywords: string[]
  feedback: string | null
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [scoreFilter, setScoreFilter] = useState("all")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [feedback, setFeedback] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      const { data, error } = await getCandidates()

      if (error) throw error
      setCandidates(data || [])
    } catch (error) {
      console.error("Erro ao carregar candidatos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os candidatos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCandidate = async () => {
    if (!selectedCandidate) return

    try {
      const { error } = await updateCandidate(selectedCandidate.id, {
        status: newStatus || selectedCandidate.status,
        feedback: feedback,
      })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Candidato atualizado com sucesso!",
      })

      setSelectedCandidate(null)
      setFeedback("")
      setNewStatus("")
      setIsFeedbackDialogOpen(false)
      loadCandidates()
    } catch (error) {
      console.error("Erro ao atualizar candidato:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o candidato",
        variant: "destructive",
      })
    }
  }

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      let processedCount = 0
      const totalFiles = files.length

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (file.type !== "application/pdf") {
          toast({
            title: "Arquivo ignorado",
            description: `${file.name} não é um PDF válido`,
            variant: "destructive",
          })
          continue
        }

        // Simular processamento de cada arquivo
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simular extração e análise
        const mockExtractedText = `
          Candidato ${i + 1}
          Email: candidato${i + 1}@email.com
          Telefone: (11) 9999${i.toString().padStart(4, "0")}
          Desenvolvedor com experiência em tecnologias modernas.
        `

        const analysis = await AIService.analyzeCompleteResume(mockExtractedText)

        // Criar candidato automaticamente
        await createCandidate({
          name: analysis.personal_info.name,
          email: analysis.personal_info.email,
          phone: analysis.personal_info.phone,
          resume_text: analysis.summary,
          job_id: null, // Sem vaga específica
          score: analysis.compatibility_score,
          status: "pending",
          keywords: analysis.keywords,
          feedback: analysis.recommendations,
        })

        processedCount++

        // Atualizar progresso
        toast({
          title: "Processando...",
          description: `${processedCount}/${totalFiles} currículos processados`,
        })
      }

      // Registrar atividade
      await createActivity({
        type: "bulk_upload",
        description: `${processedCount} currículos importados em lote`,
        user_id: null,
      })

      toast({
        title: "Importação concluída",
        description: `${processedCount} currículos foram processados e adicionados ao sistema`,
      })

      setIsUploadDialogOpen(false)
      loadCandidates()
    } catch (error) {
      console.error("Erro na importação em lote:", error)
      toast({
        title: "Erro",
        description: "Erro durante a importação em lote",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const openFeedbackDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setFeedback(candidate.feedback || "")
    setNewStatus(candidate.status)
    setIsFeedbackDialogOpen(true)
  }

  const openViewDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsViewDialogOpen(true)
  }

  const exportCandidates = () => {
    const csvContent = [
      ["Nome", "Email", "Vaga", "Score", "Status", "Data"],
      ...filteredCandidates.map((candidate) => [
        candidate.name,
        candidate.email,
        candidate.job_title,
        candidate.score.toString(),
        candidate.status,
        new Date(candidate.created_at).toLocaleDateString("pt-BR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "candidatos.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: "Lista de candidatos exportada com sucesso!",
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setScoreFilter("all")
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excelente"
    if (score >= 75)\
