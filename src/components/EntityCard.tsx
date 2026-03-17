import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export type EntityData = {
  id: string
  name: string
  type: 'PF' | 'PJ'
  icon: React.ElementType
  balance: number
  inflow: number
  outflow: number
}

interface EntityCardProps {
  entity: EntityData
  isBalanceHidden: boolean
  styleDelay?: number
}

export function EntityCard({ entity, isBalanceHidden, styleDelay = 0 }: EntityCardProps) {
  const isPositive = entity.inflow >= entity.outflow

  return (
    <Link to={`/transacoes?entity=${entity.id}`} className="block outline-none group">
      <Card
        className={cn(
          'h-full overflow-hidden border-border/40 bg-card/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 animate-fade-in-up',
        )}
        style={{ animationDelay: `${styleDelay}ms` }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <entity.icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-tight line-clamp-1">
                {entity.name}
              </CardTitle>
              <span className="text-xs text-muted-foreground">{entity.type}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Saldo Atual</span>
            <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
              {formatCurrency(entity.balance, isBalanceHidden)}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span>Entradas</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-emerald-500">
                {formatCurrency(entity.inflow, isBalanceHidden)}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-right">
              <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                <span>Saídas</span>
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
              </div>
              <span className="text-sm font-semibold tabular-nums text-rose-500">
                {formatCurrency(entity.outflow, isBalanceHidden)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <Badge
              variant="outline"
              className={cn(
                'w-full justify-center py-1 font-medium border-transparent',
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20',
              )}
            >
              {isPositive ? 'Resultado Positivo' : 'Resultado Negativo'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
