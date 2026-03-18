import { useMemo } from 'react'
import { Plane, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMiles } from '@/contexts/MilesContext'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface MilesSummaryCardProps {
  programa: string
  styleDelay?: number
}

const PROGRAM_COLORS: Record<string, string> = {
  Smiles: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  'Latam Pass': 'text-rose-600 bg-rose-600/10 border-rose-600/20',
  TudoAzul: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
}

export function MilesSummaryCard({ programa, styleDelay = 0 }: MilesSummaryCardProps) {
  const { movements, configs } = useMiles()
  const { isBalanceHidden } = useFinance()

  const metrics = useMemo(() => {
    const progMovements = movements.filter((m) => m.programa === programa)

    // Balance calculation
    let balance = 0
    progMovements.forEach((m) => {
      if (['compra', 'transferencia'].includes(m.tipo)) {
        balance += Number(m.quantidade)
      } else {
        balance -= Number(m.quantidade)
      }
    })

    // Average Cost calculation
    const purchases = progMovements.filter((m) => m.tipo === 'compra')
    const totalSpent = purchases.reduce((acc, m) => acc + Number(m.valor_total), 0)
    const totalBought = purchases.reduce((acc, m) => acc + Number(m.quantidade), 0)
    const averageCost = totalBought > 0 ? totalSpent / (totalBought / 1000) : 0

    // Market Value
    const marketPrice = configs[programa] || 0
    const marketValue = (balance / 1000) * marketPrice

    return { balance, averageCost, marketValue, marketPrice }
  }, [movements, configs, programa])

  const formatMiles = (val: number) => new Intl.NumberFormat('pt-BR').format(val)

  return (
    <Card
      className="overflow-hidden border-border/40 bg-card/50 transition-all hover:border-primary/40 hover:shadow-lg animate-fade-in-up"
      style={{ animationDelay: `${styleDelay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-5 pt-5 space-y-0">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border',
              PROGRAM_COLORS[programa] || 'bg-muted',
            )}
          >
            <Plane className="h-5 w-5" />
          </div>
          <CardTitle className="text-base font-semibold">{programa}</CardTitle>
        </div>
        <Badge variant="outline" className="font-normal text-xs bg-card">
          Ref: {formatCurrency(metrics.marketPrice, isBalanceHidden)}
        </Badge>
      </CardHeader>
      <CardContent className="px-5 pb-5 mt-4 space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Saldo em Estoque
          </span>
          <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
            {isBalanceHidden ? '***' : formatMiles(metrics.balance)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Custo Médio (1k)</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {formatCurrency(metrics.averageCost, isBalanceHidden)}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              Valor de Mercado
            </span>
            <span className="text-sm font-semibold tabular-nums text-emerald-500">
              {formatCurrency(metrics.marketValue, isBalanceHidden)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
