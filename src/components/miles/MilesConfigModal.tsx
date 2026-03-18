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
import { useMiles } from '@/contexts/MilesContext'
import { useToast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PROGRAMS = ['Smiles', 'Latam Pass', 'TudoAzul']

export function MilesConfigModal({ open, onOpenChange }: Props) {
  const { configs, updateConfigs } = useMiles()
  const { toast } = useToast()

  const [prices, setPrices] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync state when modal opens
  useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {}
      PROGRAMS.forEach((p) => {
        initial[p] = configs[p]?.toString() || '0'
      })
      setPrices(initial)
    }
  }, [open, configs])

  const handlePriceChange = (prog: string, val: string) => {
    setPrices((prev) => ({ ...prev, [prog]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = PROGRAMS.map((p) => ({
      programa: p,
      preco_venda_mercado: parseFloat(prices[p]) || 0,
    }))

    const { error } = await updateConfigs(payload)
    setIsSubmitting(false)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Configurações Salvas', description: 'Preços de mercado atualizados.' })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Configurar Preços de Venda</DialogTitle>
          <DialogDescription>
            Defina o preço de venda atual (por 1.000 milhas) para calcular o valor de mercado do seu
            estoque.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {PROGRAMS.map((prog) => (
            <div key={prog} className="flex items-center justify-between gap-4">
              <Label htmlFor={`price-${prog}`} className="w-1/2 font-medium">
                {prog}
              </Label>
              <div className="relative w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  R$
                </span>
                <Input
                  id={`price-${prog}`}
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-8"
                  value={prices[prog] || ''}
                  onChange={(e) => handlePriceChange(prog, e.target.value)}
                />
              </div>
            </div>
          ))}

          <DialogFooter className="pt-4">
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
