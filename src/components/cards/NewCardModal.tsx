import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCards } from '@/contexts/CardsContext'
import { useFinance } from '@/contexts/FinanceContext'
import { toast } from 'sonner'

const schema = z.object({
  entidade_id: z.string().min(1, 'Selecione a entidade'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  limite_total: z.coerce.number().positive('Deve ser maior que zero'),
  melhor_dia_compra: z.coerce.number().min(1).max(31),
  dia_vencimento: z.coerce.number().min(1).max(31),
})

export function NewCardModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addCard } = useCards()
  const { entities } = useFinance()
  const entitiesList = Object.values(entities)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      entidade_id: '',
      nome: '',
      limite_total: 0,
      melhor_dia_compra: 1,
      dia_vencimento: 10,
    },
  })

  useEffect(() => {
    if (open) form.reset()
  }, [open, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await addCard(values as any)
    toast.success('Cartão cadastrado com sucesso!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cartão de Crédito</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="entidade_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entidade Vinculada</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a entidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entitiesList.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cartão Azul Visa Infinite" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limite_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite Total (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="melhor_dia_compra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Melhor Dia</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="31" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dia_vencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia Vencimento</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="31" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Salvar Cartão
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
