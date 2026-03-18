import { useMemo, useCallback, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingDown, TrendingUp, Activity, Trash2 } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
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
import { Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/lib/format'
import { cn, generateChartData } from '@/lib/utils'
import { toast } from 'sonner'

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
const currentY = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => (currentY - 2 + i).toString())

export default function Transactions() {
  const [searchParams] = useSearchParams()
  const entityId = searchParams.get('entity')
  const {
    isBalanceHidden,
    entities,
    transactions: allTransactions,
    isLoading,
    deleteTransaction,
  } = useFinance()

  const [month, setMonth] = useState(new Date().getMonth().toString())
  const [year, setYear] = useState(currentY.toString())

  const entity = entityId ? entities[entityId] : null
  const transactions = entityId ? allTransactions[entityId] || [] : []

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const d = new Date(tx.rawDate + 'T00:00:00')
      return d.getMonth() === Number(month) && d.getFullYear() === Number(year)
    })
  }, [transactions, month, year])

  const chartData = useMemo(() => {
    return entity ? generateChartData(entity.balance) : []
  }, [entity])

  const chartConfig = useMemo(
    () => ({
      balance: { label: 'Saldo', color: 'hsl(var(--primary))' },
    }),
    [],
  )

  const formatTooltip = useCallback(
    (value: any) => formatCurrency(value as number, isBalanceHidden),
    [isBalanceHidden],
  )

  const handleDelete = async (id: string) => {
    const { error } = await deleteTransaction(id)
    if (!error) toast.success('Transação excluída com sucesso.')
    else toast.error('Erro ao excluir transação.')
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <Skeleton className="h-10 w-[300px] rounded-lg" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="md:col-span-1 h-[140px] rounded-xl" />
          <Skeleton className="md:col-span-2 h-[140px] rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
        <Card className="border-border/50 bg-card/40 min-h-[400px] flex items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground">
            <p className="mb-4">
              Selecione uma entidade no painel para ver os detalhes e transações.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full shrink-0">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <entity.icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none truncate">
              {entity.name}
            </h1>
            <span className="text-sm text-muted-foreground">{entity.type}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-border/50 bg-gradient-to-br from-card to-card/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {formatCurrency(entity.balance, isBalanceHidden)}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/50 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Evolução (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[120px] px-0 pb-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={formatTooltip} indicator="line" />}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'var(--color-balance)' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/40">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-medium">Histórico de Transações</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[90px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Nenhuma transação neste período.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium whitespace-nowrap">{tx.date}</TableCell>
                    <TableCell className="whitespace-nowrap">{tx.description}</TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          'flex items-center gap-1.5 text-xs font-medium',
                          tx.type === 'in' ? 'text-emerald-500' : 'text-rose-500',
                        )}
                      >
                        {tx.type === 'in' ? (
                          <>
                            <TrendingUp className="h-3.5 w-3.5" /> Entrada
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3.5 w-3.5" /> Saída
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-normal capitalize whitespace-nowrap"
                      >
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-normal capitalize text-xs whitespace-nowrap"
                      >
                        {tx.origin}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-semibold tabular-nums whitespace-nowrap',
                        tx.type === 'in' ? 'text-emerald-500' : 'text-rose-500',
                      )}
                    >
                      {tx.type === 'in' ? '+' : '-'} {formatCurrency(tx.amount, isBalanceHidden)}
                    </TableCell>
                    <TableCell>
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
                            <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta transação? Esta ação não pode ser
                              desfeita.
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
