"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Edit, Trash2, Eye, Building2, MapPin, Calendar, Users } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { getJobs, createJob, updateJob, deleteJob } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Job {
  id: string
  title: string
  description: string
  requirements: string
  department: string
  location: string
  status: string
  created_at: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const { toast } = useToast()

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requirements: "",
    department: "",
    location: "",
    status: "active",
  })

  const [editJob, setEditJob] = useState({
    id: "",
    title: "",
    description: "",
    requirements: "",
    department: "",
    location: "",
    status: "active",
  })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const { data, error } = await getJobs()

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error("Erro ao carregar vagas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vagas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await createJob(newJob)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Vaga criada com sucesso!",
      })

      setIsDialogOpen(false)
      setNewJob({
        title: "",
        description: "",
        requirements: "",
        department: "",
        location: "",
        status: "active",
      })
      loadJobs()
    } catch (error) {
      console.error("Erro ao criar vaga:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a vaga",
        variant: "destructive",
      })
    }
  }

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await updateJob(editJob.id, {
        title: editJob.title,
        description: editJob.description,
        requirements: editJob.requirements,
        department: editJob.department,
        location: editJob.location,
        status: editJob.status,
      })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Vaga atualizada com sucesso!",
      })

      setIsEditDialogOpen(false)
      loadJobs()
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a vaga",
        variant: "destructive",
      })
    }
  }

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (confirm(`Tem certeza que deseja excluir a vaga "${jobTitle}"?`)) {
      try {
        const { error } = await deleteJob(jobId)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Vaga excluída com sucesso!",
        })

        loadJobs()
      } catch (error) {
        console.error("Erro ao excluir vaga:", error)
        toast({
          title: "Erro",
          description: "Não foi possível excluir a vaga",
          variant: "destructive",
        })
      }
    }
  }

  const openEditDialog = (job: Job) => {
    setEditJob({
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      department: job.department,
      location: job.location,
      status: job.status,
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (job: Job) => {
    setSelectedJob(job)
    setIsViewDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos",
    })
  }

  const exportJobs = () => {
    const csvContent = [
      ["Título", "Departamento", "Localização", "Status", "Criada em"],
      ...filteredJobs.map((job) => [
        job.title,
        job.department,
        job.location,
        job.status,
        new Date(job.created_at).toLocaleDateString("pt-BR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vagas.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: "Lista de vagas exportada com sucesso!",
    })
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Vagas</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Vagas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie as vagas disponíveis na empresa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportJobs}>
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Nova Vaga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-red-600" />
                  Criar Nova Vaga
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                      Título da Vaga
                    </Label>
                    <Input
                      id="title"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      required
                      className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
                      Departamento
                    </Label>
                    <Input
                      id="department"
                      value={newJob.department}
                      onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                      required
                      className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                    Localização
                  </Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    required
                    className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    rows={3}
                    required
                    className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="requirements" className="text-gray-700 dark:text-gray-300">
                    Requisitos
                  </Label>
                  <Textarea
                    id="requirements"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    rows={3}
                    required
                    className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">
                    Status
                  </Label>
                  <Select value={newJob.status} onValueChange={(value) => setNewJob({ ...newJob, status: value })}>
                    <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-red-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="closed">Encerrada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white"
                  >
                    Criar Vaga
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar vagas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="closed">Encerrada</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Vagas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vagas Ativas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {jobs.filter((job) => job.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
                <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Departamentos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Set(jobs.map((job) => job.department)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg dark:bg-amber-900/30">
                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Este Mês</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {
                    jobs.filter((job) => {
                      const jobDate = new Date(job.created_at)
                      const now = new Date()
                      return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Vagas */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Vagas ({filteredJobs.length})</span>
            <Badge variant="outline" className="text-gray-600">
              {filteredJobs.filter((job) => job.status === "active").length} ativas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <StatusBadge status={job.status} />
                  </TableCell>
                  <TableCell>{new Date(job.created_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewDialog(job)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(job)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteJob(job.id, job.title)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira vaga"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Vaga
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Edit className="h-5 w-5 text-red-600" />
              Editar Vaga
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditJob} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title" className="text-gray-700 dark:text-gray-300">
                  Título da Vaga
                </Label>
                <Input
                  id="edit-title"
                  value={editJob.title}
                  onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                  required
                  className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                />
              </div>
              <div>
                <Label htmlFor="edit-department" className="text-gray-700 dark:text-gray-300">
                  Departamento
                </Label>
                <Input
                  id="edit-department"
                  value={editJob.department}
                  onChange={(e) => setEditJob({ ...editJob, department: e.target.value })}
                  required
                  className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-location" className="text-gray-700 dark:text-gray-300">
                Localização
              </Label>
              <Input
                id="edit-location"
                value={editJob.location}
                onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                required
                className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-gray-700 dark:text-gray-300">
                Descrição
              </Label>
              <Textarea
                id="edit-description"
                value={editJob.description}
                onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                rows={3}
                required
                className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="edit-requirements" className="text-gray-700 dark:text-gray-300">
                Requisitos
              </Label>
              <Textarea
                id="edit-requirements"
                value={editJob.requirements}
                onChange={(e) => setEditJob({ ...editJob, requirements: e.target.value })}
                rows={3}
                required
                className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="edit-status" className="text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <Select value={editJob.status} onValueChange={(value) => setEditJob({ ...editJob, status: value })}>
                <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="closed">Encerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Detalhes da Vaga
            </DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Título</Label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 font-medium">{selectedJob.title}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedJob.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Departamento</Label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedJob.department}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Localização</Label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedJob.location}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Descrição</Label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Requisitos</Label>
                <p className="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {selectedJob.requirements}
                </p>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Criada em</Label>
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  {new Date(selectedJob.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    openEditDialog(selectedJob)
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Editar Vaga
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
