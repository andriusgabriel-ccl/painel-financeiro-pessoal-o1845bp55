import { useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import { differenceInDays, parseISO, startOfDay } from 'date-fns'
import { ListTodo } from 'lucide-react'

export function ObligationsWidget() {
  const { obligations, entities, isBalanceHidden } = useFinance()

  const widgetData = useMemo(() => {
    const todayDate = startOfDay(new Date())

    return Object.values(entities).map((entity) => {
      const entityObs = obligations.filter((o) => o.entityId === entity.id && o.status !== 'pago')

      let pay7 = 0,
        pay30 = 0,
        rec7 = 0,
        rec30 = 0

      entityObs.forEach((o) => {
        const diff = differenceInDays(parseISO(o.dueDate), todayDate)

        if (diff <= 7) {
          if (o.type === 'payable') pay7 += o.amount
          else rec7 += o.amount
        }
        if (diff <= 30) {
          if (o.type === 'payable') pay30 += o.amount
          else rec30 += o.amount
        }
      })

      return { entity, pay7, pay30, rec7, rec30 }
    })
  }, [entities, obligations])

  return (
    <Card className="border-border/40 bg-card/40 overflow-hidden">
      <CardHeader className="pb-2 border-b border-border/40 bg-muted/20">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          Resumo de Obrigações e Recebimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10">
              <TableHead className="w-[200px]">Entidade</TableHead>
              <TableHead className="text-right">A Pagar (7 dias)</TableHead>
              <TableHead className="text-right">A Pagar (30 dias)</TableHead>
              <TableHead className="text-right">A Receber (7 dias)</TableHead>
              <TableHead className="text-right">A Receber (30 dias)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {widgetData.map((row) => (
              <TableRow key={`obligation-row-${row.entity.id}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <row.entity.icon className="h-4 w-4 text-muted-foreground" />
                    {row.entity.name}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums text-rose-500 font-medium">
                  {row.pay7 > 0 ? formatCurrency(row.pay7, isBalanceHidden) : '-'}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.pay30 > 0 ? formatCurrency(row.pay30, isBalanceHidden) : '-'}
                </TableCell>
                <TableCell className="text-right tabular-nums text-emerald-500 font-medium">
                  {row.rec7 > 0 ? formatCurrency(row.rec7, isBalanceHidden) : '-'}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.rec30 > 0 ? formatCurrency(row.rec30, isBalanceHidden) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
