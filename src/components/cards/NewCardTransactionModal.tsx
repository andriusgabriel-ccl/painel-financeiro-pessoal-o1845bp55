import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format, addMonths } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useCards } from '@/contexts/CardsContext'
import { toast } from 'sonner'

const schema = z.object({
  cartao_id: z.string().min(1, 'Selecione o cartão'),
  data: z.date({ required_error: 'Selecione uma data' }),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.coerce.number().positive('Maior que zero'),
  categoria_id: z.string().optional(),
  total_parcelas: z.coerce.number().min(1, 'Mínimo de 1 parcela').default(1),
})

export function NewCardTransactionModal({ open, onOpenChange, defaultCardId }: any) {
  const { cards, categories, addCardTransactions } = useCards()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      total_parcelas: 1,
    },
  })

  const cardId = form.watch('cartao_id')

  const availableCategories = useMemo(() => {
    const selectedCard = cards.find((c) => c.id === cardId)
    if (!selectedCard) return []
    return categories.filter((c) => c.entidade_id === selectedCard.entidade_id)
  }, [cards, categories, cardId])

  useEffect(() => {
    if (open) {
      form.reset({
        cartao_id: defaultCardId || (cards[0]?.id ?? ''),
        data: new Date(),
        descricao: '',
        valor: '' as any,
        categoria_id: '',
        total_parcelas: 1,
      })
    }
  }, [open, defaultCardId, cards, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const payloads = []
    const valPerParcela = values.valor / values.total_parcelas

    for (let i = 1; i <= values.total_parcelas; i++) {
      payloads.push({
        cartao_id: values.cartao_id,
        categoria_id: values.categoria_id || null,
        descricao: values.descricao,
        valor: valPerParcela,
        parcela_atual: i,
        total_parcelas: values.total_parcelas,
        data: format(addMonths(values.data, i - 1), 'yyyy-MM-dd'),
      })
    }

    await addCardTransactions(payloads)
    toast.success('Lançamento(s) registrado(s) com sucesso!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento no Cartão</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="cartao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cartão</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cartão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cards.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel className="mb-2">Data da Compra</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Selecione</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Passagem Miami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Opcional" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nome}
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
                name="total_parcelas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas (1x a 12x)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Registrar Compra
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
