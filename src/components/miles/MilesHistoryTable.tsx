import { useMemo } from 'react'
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
import { useMiles, MilesMovement } from '@/contexts/MilesContext'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/lib/format'
import { parseISO, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const TIPO_LABELS: Record<string, { label: string; color: string; sign: string }> = {
  compra: {
    label: 'Compra',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    sign: '+',
  },
  venda_agencia: {
    label: 'Venda Agência',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    sign: '-',
  },
  venda_terceiro: {
    label: 'Venda Terceiro',
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    sign: '-',
  },
  transferencia: {
    label: 'Transferência',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    sign: '+',
  },
  expiracao: {
    label: 'Expiração',
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    sign: '-',
  },
}

export function MilesHistoryTable() {
  const { movements } = useMiles()
  const { isBalanceHidden } = useFinance()

  const formatDate = (isoStr: string) => {
    try {
      return format(parseISO(isoStr), 'dd MMM yyyy', { locale: ptBR })
    } catch {
      return isoStr
    }
  }

  const formatMiles = (val: number) => new Intl.NumberFormat('pt-BR').format(val)

  return (
    <Card
      className="border-border/40 bg-card/40 animate-fade-in-up"
      style={{ animationDelay: '300ms' }}
    >
      <CardHeader>
        <CardTitle className="text-lg font-medium">Histórico de Movimentações</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Val. Unitário (1k)</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Nenhuma movimentação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              movements.map((mov) => {
                const config = TIPO_LABELS[mov.tipo] || {
                  label: mov.tipo,
                  color: 'bg-muted text-muted-foreground',
                  sign: '',
                }

                return (
                  <TableRow key={mov.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {formatDate(mov.data)}
                    </TableCell>
                    <TableCell className="font-semibold">{mov.programa}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`whitespace-nowrap font-normal ${config.color}`}
                      >
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums whitespace-nowrap">
                      {isBalanceHidden ? '***' : `${config.sign} ${formatMiles(mov.quantidade)}`}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground whitespace-nowrap">
                      {formatCurrency(mov.valor_unitario, isBalanceHidden)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold whitespace-nowrap">
                      {formatCurrency(mov.valor_total, isBalanceHidden)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
