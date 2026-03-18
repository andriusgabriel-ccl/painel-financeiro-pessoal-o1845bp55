import { useCards } from '@/contexts/CardsContext'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardListProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CardList({ selectedId, onSelect }: CardListProps) {
  const { cards, transactions } = useCards()
  const { entities, isBalanceHidden } = useFinance()

  if (cards.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-transparent text-center p-6">
        <p className="text-muted-foreground text-sm">Nenhum cartão cadastrado.</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {cards.map((card) => {
        const entity = entities[card.entidade_id]

        // Calculate spent in the current month as an approximation for the open invoice
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        const spent = transactions
          .filter((t) => {
            const d = new Date(t.data)
            return (
              t.cartao_id === card.id &&
              d.getMonth() === currentMonth &&
              d.getFullYear() === currentYear
            )
          })
          .reduce((acc, t) => acc + Number(t.valor), 0)

        const available = card.limite_total - spent

        return (
          <Card
            key={card.id}
            onClick={() => onSelect(card.id)}
            className={cn(
              'cursor-pointer transition-all duration-200 border-border/50 hover:border-primary/50 hover:shadow-md',
              selectedId === card.id && 'border-primary bg-primary/5 shadow-md',
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    selectedId === card.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-primary',
                  )}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold leading-none">{card.nome}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {entity?.name || 'Entidade Desconhecida'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Limite Disponível</span>
                  <span className="font-semibold text-emerald-500 tabular-nums">
                    {formatCurrency(available, isBalanceHidden)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-muted-foreground">Limite Total</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(card.limite_total, isBalanceHidden)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Vencimento: dia {card.dia_vencimento}</span>
                </div>
                <span>Melhor dia: {card.melhor_dia_compra}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
