import { useState, useMemo } from 'react'
import { useFinance, Obligation } from '@/contexts/FinanceContext'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { differenceInDays, parseISO, startOfDay } from 'date-fns'
import { Trash2, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ObligationModal } from '@/components/ObligationModal'

export default function Obligations() {
  const { obligations, entities, isBalanceHidden, isLoading, deleteObligation } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingObs, setEditingObs] = useState<Obligation | null>(null)

  const payables = useMemo(() => obligations.filter((o) => o.type === 'payable'), [obligations])
  const receivables = useMemo(
    () => obligations.filter((o) => o.type === 'receivable'),
    [obligations],
  )

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  const handleDelete = async (id: string) => {
    const { error } = await deleteObligation(id)
    if (!error) toast.success('Obrigação excluída com sucesso.')
    else toast.error('Erro ao excluir obrigação.')
  }

  const handleOpenModal = (open: boolean) => {
    setModalOpen(open)
    if (!open) setEditingObs(null)
  }

  const getUrgencyColor = (dateStr: string, status: string) => {
    if (status === 'pago') return 'bg-muted'
    const diff = differenceInDays(parseISO(dateStr), startOfDay(new Date()))
    if (diff <= 3 || status === 'atrasado')
      return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
    if (diff <= 7) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
    return 'bg-emerald-500'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-transparent"
          >
            Pago
          </Badge>
        )
      case 'pendente':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-transparent">
            Pendente
          </Badge>
        )
      case 'atrasado':
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-transparent">
            Atrasado
          </Badge>
        )
    }
  }

  const renderTable = (data: Obligation[]) => {
    const sorted = [...data].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    if (sorted.length === 0)
      return (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Nenhuma obrigação encontrada.
        </div>
      )
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entidade</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item) => {
            const entity = entities[item.entityId]
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {entity && <entity.icon className="h-4 w-4 text-muted-foreground" />}
                    {entity?.name || 'Desconhecida'}
                  </div>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        getUrgencyColor(item.dueDate, item.status),
                      )}
                    />
                    <span>{formatDate(item.dueDate)}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right tabular-nums font-semibold whitespace-nowrap">
                  {formatCurrency(item.amount, isBalanceHidden)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setEditingObs(item)
                        setModalOpen(true)
                      }}
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
                          <AlertDialogTitle>Excluir Obrigação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta obrigação? Esta ação não pode ser
                            desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(item.id)}
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
    )
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <Skeleton className="h-8 w-[200px] rounded-lg" />
        <Skeleton className="h-10 w-[300px] rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Obrigações</h1>
        <Button onClick={() => setModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nova Obrigação
        </Button>
      </div>

      <Tabs defaultValue="payable" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="payable" className="w-32">
            A Pagar
          </TabsTrigger>
          <TabsTrigger value="receivable" className="w-32">
            A Receber
          </TabsTrigger>
        </TabsList>
        <TabsContent value="payable" className="outline-none">
          <Card className="border-border/50 bg-card/40">
            <CardContent className="p-0 overflow-x-auto">{renderTable(payables)}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="receivable" className="outline-none">
          <Card className="border-border/50 bg-card/40">
            <CardContent className="p-0 overflow-x-auto">{renderTable(receivables)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ObligationModal open={modalOpen} onOpenChange={handleOpenModal} obligation={editingObs} />
    </div>
  )
}
