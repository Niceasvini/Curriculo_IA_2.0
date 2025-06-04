import { Badge } from "@/components/ui/badge"
import { cva } from "class-variance-authority"

const statusBadgeVariants = cva("", {
  variants: {
    status: {
      pending: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      interview: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800",
      hired:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    },
  },
  defaultVariants: {
    status: "pending",
  },
})

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { label: "Pendente", variant: "pending" as const }
      case "interview":
        return { label: "Entrevista", variant: "interview" as const }
      case "approved":
        return { label: "Aprovado", variant: "approved" as const }
      case "rejected":
        return { label: "Reprovado", variant: "rejected" as const }
      case "hired":
        return { label: "Contratado", variant: "hired" as const }
      case "active":
        return { label: "Ativa", variant: "active" as const }
      case "closed":
        return { label: "Encerrada", variant: "closed" as const }
      default:
        return { label: status, variant: "pending" as const }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant="outline" className={statusBadgeVariants({ status: config.variant })}>
      {config.label}
    </Badge>
  )
}
