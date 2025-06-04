"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, CheckCircle, Clock, TrendingUp, ArrowUpRight, ChevronRight, Eye } from "lucide-react"
import {
  ResponsiveContainer,
  Tooltip,
  Pie,
  PieChart,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { getDashboardStats, getActivities } from "@/lib/database"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DashboardStats {
  totalJobs: number
  totalCandidates: number
  approvedCandidates: number
  pendingCandidates: number
}

interface Activity {
  id: string
  description: string
  created_at: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalCandidates: 0,
    approvedCandidates: 0,
    pendingCandidates: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showStatusDetails, setShowStatusDetails] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: statsData } = await getDashboardStats()
        const { data: activitiesData } = await getActivities()

        if (statsData) setStats(statsData)
        if (activitiesData) setActivities(activitiesData)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const statusData = [
    { name: "Pendente", value: stats.pendingCandidates, color: "#6B7280" },
    { name: "Aprovado", value: stats.approvedCandidates, color: "#10B981" },
    { name: "Entrevista", value: Math.floor(stats.totalCandidates * 0.3), color: "#3B82F6" },
    { name: "Reprovado", value: Math.floor(stats.totalCandidates * 0.2), color: "#EF4444" },
  ]

  const applicationData = [
    { name: "Jan", candidatos: 4 },
    { name: "Fev", candidatos: 6 },
    { name: "Mar", candidatos: 8 },
    { name: "Abr", candidatos: 12 },
    { name: "Mai", candidatos: 18 },
    { name: "Jun", candidatos: 24 },
  ]

  const handleViewStatusDetails = () => {
    setShowStatusDetails(true)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Bem-vindo ao sistema de recrutamento Viana e Moura</p>
        </div>
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 px-3 py-1.5"
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Sistema Ativo
        </Badge>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Vagas</CardTitle>
            <div className="p-2 bg-red-100 rounded-full dark:bg-red-900/30">
              <Briefcase className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalJobs}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vagas ativas no sistema</p>
            <div className="mt-4 flex items-center text-xs text-green-600 dark:text-green-400">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12% a mais que no mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card overflow-hidden before:bg-gradient-to-r before:from-amber-600 before:to-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Candidatos</CardTitle>
            <div className="p-2 bg-amber-100 rounded-full dark:bg-amber-900/30">
              <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCandidates}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currículos no sistema</p>
            <div className="mt-4 flex items-center text-xs text-green-600 dark:text-green-400">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% a mais que no mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card overflow-hidden before:bg-gradient-to-r before:from-green-600 before:to-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Candidatos Aprovados</CardTitle>
            <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/30">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.approvedCandidates}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aprovados para entrevista</p>
            <div className="mt-4 flex items-center text-xs text-green-600 dark:text-green-400">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>15% a mais que no mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card overflow-hidden before:bg-gradient-to-r before:from-gray-600 before:to-gray-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</CardTitle>
            <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
              <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingCandidates}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aguardando análise</p>
            <div className="mt-4 flex items-center text-xs text-amber-600 dark:text-amber-400">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>3% a mais que no mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-blue-100 rounded-md dark:bg-blue-900/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              Distribuição de Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-wrap gap-3">
                {statusData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="text-xs" onClick={handleViewStatusDetails}>
                <Eye className="mr-1 h-3 w-3" />
                Ver detalhes
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} candidatos`, name]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-red-100 rounded-md dark:bg-red-900/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23 6L13.5 15.5L8.5 10.5L1 18"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M17 6H23V12" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              Candidaturas por Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={applicationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCandidatos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value) => [`${value} candidatos`]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="candidatos"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCandidatos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="dashboard-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-amber-100 rounded-md dark:bg-amber-900/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 8V12L15 15"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start space-x-4 animate-slideInRight stagger-item`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarFallback className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                        {activity.description.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 8V12L15 15"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma atividade recente</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Atualizar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalhes do Status */}
      <Dialog open={showStatusDetails} onOpenChange={setShowStatusDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Detalhes da Distribuição de Status
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {statusData.map((status, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{status.name}</h4>
                      <p className="text-2xl font-bold" style={{ color: status.color }}>
                        {status.value}
                      </p>
                      <p className="text-sm text-gray-500">
                        {((status.value / stats.totalCandidates) * 100).toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Resumo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total de {stats.totalCandidates} candidatos no sistema. A maioria está em processo de avaliação, com{" "}
                {stats.approvedCandidates} já aprovados para próximas etapas.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowStatusDetails(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
