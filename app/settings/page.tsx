"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Palette, Database, Brain, Save, RotateCcw, Download, Upload, Trash2 } from "lucide-react"
import { getSettings, updateSettings, resetSettings } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AnalysisCriteria {
  keywords_weight: number
  experience_weight: number
  education_weight: number
  skills_weight: number
}

interface ThemeSettings {
  mode: string
  primary_color: string
  secondary_color: string
}

export default function SettingsPage() {
  const [analysisCriteria, setAnalysisCriteria] = useState<AnalysisCriteria>({
    keywords_weight: 40,
    experience_weight: 30,
    education_weight: 20,
    skills_weight: 10,
  })

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: "light",
    primary_color: "#B91C1C",
    secondary_color: "#D97706",
  })

  const [customKeywords, setCustomKeywords] = useState("")
  const [aiEnabled, setAiEnabled] = useState(true)
  const [language, setLanguage] = useState("pt-BR")
  const [autoBackup, setAutoBackup] = useState(true)
  const [dataRetention, setDataRetention] = useState("365")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDangerZone, setShowDangerZone] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await getSettings()

      if (error) throw error

      data?.forEach((setting) => {
        if (setting.key === "analysis_criteria") {
          setAnalysisCriteria(setting.value)
        } else if (setting.key === "theme") {
          setThemeSettings(setting.value)
        } else if (setting.key === "custom_keywords") {
          setCustomKeywords(setting.value.keywords || "")
        } else if (setting.key === "ai_enabled") {
          setAiEnabled(setting.value.enabled || true)
        } else if (setting.key === "language") {
          setLanguage(setting.value.lang || "pt-BR")
        } else if (setting.key === "auto_backup") {
          setAutoBackup(setting.value.enabled || true)
        } else if (setting.key === "data_retention") {
          setDataRetention(setting.value.days || "365")
        }
      })
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)

    try {
      const settings = [
        {
          key: "analysis_criteria",
          value: analysisCriteria,
        },
        {
          key: "theme",
          value: themeSettings,
        },
        {
          key: "custom_keywords",
          value: { keywords: customKeywords },
        },
        {
          key: "ai_enabled",
          value: { enabled: aiEnabled },
        },
        {
          key: "language",
          value: { lang: language },
        },
        {
          key: "auto_backup",
          value: { enabled: autoBackup },
        },
        {
          key: "data_retention",
          value: { days: dataRetention },
        },
      ]

      const { error } = await updateSettings(settings)
      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = async () => {
    if (!confirm("Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      const { error } = await resetSettings()
      if (error) throw error

      // Recarregar configurações padrão
      setAnalysisCriteria({
        keywords_weight: 40,
        experience_weight: 30,
        education_weight: 20,
        skills_weight: 10,
      })

      setThemeSettings({
        mode: "light",
        primary_color: "#B91C1C",
        secondary_color: "#D97706",
      })

      setCustomKeywords("")
      setAiEnabled(true)
      setLanguage("pt-BR")
      setAutoBackup(true)
      setDataRetention("365")

      toast({
        title: "Sucesso",
        description: "Configurações resetadas para o padrão!",
      })
    } catch (error) {
      console.error("Erro ao resetar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível resetar as configurações",
        variant: "destructive",
      })
    }
  }

  const exportSettings = () => {
    const settingsData = {
      analysisCriteria,
      themeSettings,
      customKeywords,
      aiEnabled,
      language,
      autoBackup,
      dataRetention,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `configuracoes-ats-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: "Configurações exportadas com sucesso!",
    })
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)

        if (importedData.analysisCriteria) setAnalysisCriteria(importedData.analysisCriteria)
        if (importedData.themeSettings) setThemeSettings(importedData.themeSettings)
        if (importedData.customKeywords) setCustomKeywords(importedData.customKeywords)
        if (typeof importedData.aiEnabled === "boolean") setAiEnabled(importedData.aiEnabled)
        if (importedData.language) setLanguage(importedData.language)
        if (typeof importedData.autoBackup === "boolean") setAutoBackup(importedData.autoBackup)
        if (importedData.dataRetention) setDataRetention(importedData.dataRetention)

        toast({
          title: "Importação concluída",
          description: "Configurações importadas com sucesso!",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Arquivo de configuração inválido",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const clearTestData = () => {
    if (!confirm("Tem certeza que deseja limpar todos os dados de teste? Esta ação não pode ser desfeita.")) {
      return
    }

    toast({
      title: "Dados limpos",
      description: "Todos os dados de teste foram removidos",
    })
  }

  const updateCriteria = (field: keyof AnalysisCriteria, value: number) => {
    setAnalysisCriteria((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const totalWeight = Object.values(analysisCriteria).reduce((a, b) => a + b, 0)

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Configurações</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Personalize o sistema de acordo com suas necessidades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <div>
            <input type="file" accept=".json" onChange={importSettings} className="hidden" id="import-settings" />
            <Button variant="outline" asChild>
              <label htmlFor="import-settings" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </label>
            </Button>
          </div>
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            {saving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critérios de Análise */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-red-100 rounded-md dark:bg-red-900/30">
                <Brain className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              Critérios de Análise da IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 dark:text-gray-300">IA Habilitada</Label>
              <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-gray-700 dark:text-gray-300">Peso das Palavras-chave</Label>
                  <Badge variant="outline">{analysisCriteria.keywords_weight}%</Badge>
                </div>
                <Slider
                  value={[analysisCriteria.keywords_weight]}
                  onValueChange={(value) => updateCriteria("keywords_weight", value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-gray-700 dark:text-gray-300">Peso da Experiência</Label>
                  <Badge variant="outline">{analysisCriteria.experience_weight}%</Badge>
                </div>
                <Slider
                  value={[analysisCriteria.experience_weight]}
                  onValueChange={(value) => updateCriteria("experience_weight", value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-gray-700 dark:text-gray-300">Peso da Educação</Label>
                  <Badge variant="outline">{analysisCriteria.education_weight}%</Badge>
                </div>
                <Slider
                  value={[analysisCriteria.education_weight]}
                  onValueChange={(value) => updateCriteria("education_weight", value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-gray-700 dark:text-gray-300">Peso das Habilidades</Label>
                  <Badge variant="outline">{analysisCriteria.skills_weight}%</Badge>
                </div>
                <Slider
                  value={[analysisCriteria.skills_weight]}
                  onValueChange={(value) => updateCriteria("skills_weight", value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div
                className={`text-sm p-3 rounded-lg ${totalWeight === 100 ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"}`}
              >
                <strong>Total:</strong> {totalWeight}%
                {totalWeight !== 100 && <span className="ml-2">(Ajuste para totalizar 100%)</span>}
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="custom-keywords" className="text-gray-700 dark:text-gray-300">
                Palavras-chave Personalizadas
              </Label>
              <Textarea
                id="custom-keywords"
                value={customKeywords}
                onChange={(e) => setCustomKeywords(e.target.value)}
                placeholder="Digite palavras-chave separadas por vírgula (ex: React, TypeScript, Node.js)"
                rows={3}
                className="mt-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500 resize-none"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Essas palavras-chave serão priorizadas na análise dos currículos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Tema */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-blue-100 rounded-md dark:bg-blue-900/30">
                <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Aparência e Tema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 dark:text-gray-300">Modo Escuro</Label>
              <Switch
                checked={themeSettings.mode === "dark"}
                onCheckedChange={(checked) =>
                  setThemeSettings((prev) => ({
                    ...prev,
                    mode: checked ? "dark" : "light",
                  }))
                }
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="primary-color" className="text-gray-700 dark:text-gray-300">
                Cor Primária
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={themeSettings.primary_color}
                  onChange={(e) =>
                    setThemeSettings((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={themeSettings.primary_color}
                  onChange={(e) =>
                    setThemeSettings((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  placeholder="#B91C1C"
                  className="flex-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color" className="text-gray-700 dark:text-gray-300">
                Cor Secundária
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={themeSettings.secondary_color}
                  onChange={(e) =>
                    setThemeSettings((prev) => ({
                      ...prev,
                      secondary_color: e.target.value,
                    }))
                  }
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={themeSettings.secondary_color}
                  onChange={(e) =>
                    setThemeSettings((prev) => ({
                      ...prev,
                      secondary_color: e.target.value,
                    }))
                  }
                  placeholder="#D97706"
                  className="flex-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Pré-visualização</h4>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: themeSettings.primary_color }}></div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: themeSettings.secondary_color }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-green-100 rounded-md dark:bg-green-900/30">
                <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              Sistema e Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Idioma do Sistema</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Backup Automático</Label>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Fazer backup dos dados diariamente</span>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-300">Retenção de Dados</Label>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger className="mt-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                  <SelectItem value="365">1 ano</SelectItem>
                  <SelectItem value="forever">Permanente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Zona de Perigo
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                Esta ação irá remover todos os dados de teste do sistema.
              </p>
              <Dialog open={showDangerZone} onOpenChange={setShowDangerZone}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Database className="w-4 h-4 mr-2" />
                    Limpar Dados de Teste
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                      <Trash2 className="w-5 h-5" />
                      Confirmar Limpeza de Dados
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Tem certeza que deseja limpar todos os dados de teste? Esta ação irá remover:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>Todos os candidatos de exemplo</li>
                      <li>Vagas de demonstração</li>
                      <li>Histórico de análises</li>
                      <li>Atividades registradas</li>
                    </ul>
                    <p className="text-red-600 dark:text-red-400 font-medium">Esta ação não pode ser desfeita!</p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowDangerZone(false)}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={clearTestData}>
                        Confirmar Limpeza
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="p-1.5 bg-amber-100 rounded-md dark:bg-amber-900/30">
                <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Versão:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Última Atualização:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">Hoje</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Usuários Ativos:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Currículos Analisados:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Espaço Usado:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">2.4 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Último Backup:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">Ontem</span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Suporte</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Para suporte técnico, entre em contato:</p>
              <div className="space-y-1">
                <a href="mailto:suporte@vianamoura.com" className="text-red-600 hover:underline text-sm block">
                  suporte@vianamoura.com
                </a>
                <a href="tel:+5511999999999" className="text-red-600 hover:underline text-sm block">
                  (11) 99999-9999
                </a>
                <a href="https://vianamoura.com/ajuda" className="text-red-600 hover:underline text-sm block">
                  Central de Ajuda
                </a>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Status do Sistema</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Banco de Dados</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Conectado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">IA Service</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Ativo</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
