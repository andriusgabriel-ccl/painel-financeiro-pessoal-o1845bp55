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
import { useFinance, Obligation } from '@/contexts/FinanceContext'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  obligation?: Obligation | null
}

export function ObligationModal({ open, onOpenChange, obligation }: Props) {
  const { entities, addObligation, editObligation } = useFinance()
  const entitiesList = Object.values(entities)

  const isEditing = !!obligation

  const [entityId, setEntityId] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [type, setType] = useState('payable')
  const [status, setStatus] = useState('pendente')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (obligation) {
        setEntityId(obligation.entityId)
        setDescription(obligation.description)
        setAmount(obligation.amount.toString())
        setDueDate(obligation.dueDate)
        setType(obligation.type)
        setStatus(obligation.status)
      } else {
        setEntityId(entitiesList[0]?.id || '')
        setDescription('')
        setAmount('')
        setDueDate(new Date().toISOString().split('T')[0])
        setType('payable')
        setStatus('pendente')
      }
    }
  }, [open, obligation, entitiesList])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      entityId,
      description,
      amount: parseFloat(amount) || 0,
      dueDate,
      type,
      status,
    }

    let error
    if (isEditing && obligation) {
      const res = await editObligation(obligation.id, payload)
      error = res.error
    } else {
      const res = await addObligation(payload)
      error = res.error
    }

    setIsSubmitting(false)

    if (error) {
      toast.error('Erro ao salvar obrigação.')
    } else {
      toast.success(isEditing ? 'Obrigação atualizada!' : 'Obrigação registrada!')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Obrigação' : 'Nova Obrigação'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os detalhes da obrigação.'
              : 'Registre uma nova conta a pagar ou receber.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Entidade</Label>
            <Select value={entityId} onValueChange={setEntityId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {entitiesList.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Input required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Vencimento</Label>
              <Input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payable">A Pagar</SelectItem>
                  <SelectItem value="receivable">A Receber</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
