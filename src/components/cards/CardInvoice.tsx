import { useCards } from '@/contexts/CardsContext'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format, parseISO } from 'date-fns'

interface CardInvoiceProps {
  cardId: string | null
}

export function CardInvoice({ cardId }: CardInvoiceProps) {
  const { cards, transactions, categories } = useCards()
  const { isBalanceHidden } = useFinance()

  if (!cardId) {
    return (
      <Card className="border-border/50 bg-card/40 h-full min-h-[400px] flex items-center justify-center">
        <CardContent className="text-muted-foreground text-center">
          <p>Selecione um cartão para ver os detalhes da fatura.</p>
        </CardContent>
      </Card>
    )
  }

  const card = cards.find((c) => c.id === cardId)
  const cardTxs = transactions.filter((t) => t.cartao_id === cardId)

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // Filter for current open invoice (approximation: current month)
  const currentInvoiceTxs = cardTxs.filter((t) => {
    const d = new Date(t.data)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalInvoice = currentInvoiceTxs.reduce((acc, t) => acc + Number(t.valor), 0)

  return (
    <Card className="border-border/50 bg-card/40 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
        <div>
          <CardTitle className="text-xl">Fatura Atual</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Vencimento: {card?.dia_vencimento}/{String(currentMonth + 1).padStart(2, '0')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total da Fatura</p>
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {formatCurrency(totalInvoice, isBalanceHidden)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-x-auto">
        {currentInvoiceTxs.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Nenhum lançamento nesta fatura.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Parcela</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoiceTxs.map((tx) => {
                const category = categories.find((c) => c.id === tx.categoria_id)
                return (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap font-medium text-muted-foreground">
                      {format(parseISO(tx.data), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{tx.descricao}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-normal capitalize whitespace-nowrap"
                      >
                        {category?.nome || 'Sem Categoria'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums">
                      {tx.total_parcelas > 1 ? `${tx.parcela_atual}/${tx.total_parcelas}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-foreground">
                      {formatCurrency(tx.valor, isBalanceHidden)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
