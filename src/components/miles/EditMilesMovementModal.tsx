import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMiles, MilesMovement } from '@/contexts/MilesContext'
import { useToast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement: MilesMovement | null
}

const PROGRAMS = ['Smiles', 'Latam Pass', 'TudoAzul']
const TYPES = [
  { value: 'compra', label: 'Compra' },
  { value: 'venda_agencia', label: 'Venda para Agência' },
  { value: 'venda_terceiro', label: 'Venda para Terceiro' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'expiracao', label: 'Expiração' },
]

export function EditMilesMovementModal({ open, onOpenChange, movement }: Props) {
  const { editMovement } = useMiles()
  const { toast } = useToast()

  const [data, setData] = useState('')
  const [programa, setPrograma] = useState('Smiles')
  const [tipo, setTipo] = useState<MilesMovement['tipo']>('compra')
  const [quantidade, setQuantidade] = useState('')
  const [valorUnitario, setValorUnitario] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && movement) {
      setData(movement.data)
      setPrograma(movement.programa)
      setTipo(movement.tipo)
      setQuantidade(movement.quantidade.toString())
      setValorUnitario(movement.valor_unitario.toString())
    }
  }, [open, movement])

  const parsedQty = parseFloat(quantidade) || 0
  const parsedUnit = parseFloat(valorUnitario) || 0
  const totalValue = (parsedQty / 1000) * parsedUnit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movement) return
    setIsSubmitting(true)

    const { error } = await editMovement(movement.id, {
      data,
      programa,
      tipo,
      quantidade: parsedQty,
      valor_unitario: parsedUnit,
      valor_total: totalValue,
    })

    setIsSubmitting(false)

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar movimentação.', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Movimentação atualizada com sucesso.' })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Movimentação de Milhas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Data</Label>
            <Input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Programa</Label>
              <Select value={programa} onValueChange={setPrograma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Quantidade de Milhas</Label>
              <Input
                type="number"
                step="1"
                min="0"
                required
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Valor Unitário (1k) R$</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                required
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2 bg-muted/40 p-3 rounded-lg border border-border/50">
            <Label className="text-muted-foreground">Valor Total (Calculado)</Label>
            <span className="text-lg font-bold tabular-nums">
              R${' '}
              {totalValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
