import { ReactNode } from "react"

export function InfoRow({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
  tooltip?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
      {icon}
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {tooltip ? tooltip : <p className="text-sm text-muted-foreground">{value}</p>}
      </div>
    </div>
  )
}