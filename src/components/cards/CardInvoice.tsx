import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { format, parseISO } from 'date-fns'
import { Trash2, Pencil } from 'lucide-react'
import { EditCardTransactionModal } from '@/components/cards/EditCardTransactionModal'
import { toast } from 'sonner'

interface CardInvoiceProps {
  cardId: string | null
}

export function CardInvoice({ cardId }: CardInvoiceProps) {
  const { cards, transactions, categories, deleteCardTransaction } = useCards()
  const { isBalanceHidden } = useFinance()
  const [editingTx, setEditingTx] = useState<any>(null)

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

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const currentDay = today.getDate()

  let dueMonth = currentMonth
  let dueYear = currentYear
  let formattedDueDate = ''

  if (card) {
    if (currentDay > card.dia_vencimento) {
      dueMonth += 1
      if (dueMonth > 11) {
        dueMonth = 0
        dueYear += 1
      }
    }
    formattedDueDate = `${String(card.dia_vencimento).padStart(2, '0')}/${String(dueMonth + 1).padStart(2, '0')}/${dueYear}`
  }

  const currentInvoiceTxs = cardTxs.filter((t) => {
    const d = new Date(t.data)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalInvoice = currentInvoiceTxs.reduce((acc, t) => acc + Number(t.valor), 0)

  const handleDelete = async (id: string) => {
    const { error } = await deleteCardTransaction(id)
    if (!error) toast.success('Lançamento excluído com sucesso.')
    else toast.error('Erro ao excluir lançamento.')
  }

  return (
    <Card className="border-border/50 bg-card/40 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
        <div>
          <CardTitle className="text-xl">Fatura Atual</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Vencimento: {formattedDueDate}</p>
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
                <TableHead className="w-[80px]"></TableHead>
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
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => setEditingTx(tx)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Lançamento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este lançamento?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(tx.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <EditCardTransactionModal
        open={!!editingTx}
        tx={editingTx}
        onOpenChange={(o: boolean) => !o && setEditingTx(null)}
      />
    </Card>
  )
}
