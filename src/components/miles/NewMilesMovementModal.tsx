import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
}

const PROGRAMS = ['Smiles', 'Latam Pass', 'TudoAzul']
const TYPES = [
  { value: 'compra', label: 'Compra' },
  { value: 'venda_agencia', label: 'Venda para Agência' },
  { value: 'venda_terceiro', label: 'Venda para Terceiro' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'expiracao', label: 'Expiração' },
]

export function NewMilesMovementModal({ open, onOpenChange }: Props) {
  const { addMovement } = useMiles()
  const { toast } = useToast()

  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [programa, setPrograma] = useState('Smiles')
  const [tipo, setTipo] = useState<MilesMovement['tipo']>('compra')
  const [quantidade, setQuantidade] = useState('')
  const [valorUnitario, setValorUnitario] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const parsedQty = parseFloat(quantidade) || 0
  const parsedUnit = parseFloat(valorUnitario) || 0
  const totalValue = (parsedQty / 1000) * parsedUnit

  const resetForm = () => {
    setData(new Date().toISOString().split('T')[0])
    setPrograma('Smiles')
    setTipo('compra')
    setQuantidade('')
    setValorUnitario('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await addMovement({
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
      toast({ title: 'Sucesso', description: 'Movimentação registrada com sucesso.' })
      resetForm()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Movimentação de Milhas</DialogTitle>
          <DialogDescription>
            Registre uma nova entrada ou saída no seu estoque de milhas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="programa">Programa</Label>
              <Select value={programa} onValueChange={setPrograma}>
                <SelectTrigger id="programa">
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
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as any)}>
                <SelectTrigger id="tipo">
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
              <Label htmlFor="quantidade">Quantidade de Milhas</Label>
              <Input
                id="quantidade"
                type="number"
                step="1"
                min="0"
                required
                placeholder="Ex: 100000"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valor_unitario">Valor Unitário (1k) R$</Label>
              <Input
                id="valor_unitario"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Ex: 15.50"
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
              {isSubmitting ? 'Salvando...' : 'Salvar Movimentação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
