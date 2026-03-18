import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useFinance } from '@/contexts/FinanceContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download, Upload, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function ImportTransactionsModal({ open, onOpenChange, defaultEntityId }: any) {
  const { entities, importTransactions } = useFinance()
  const entitiesList = Object.values(entities)
  const [entityId, setEntityId] = useState(defaultEntityId || '')
  const [parsedData, setParsedData] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      setEntityId(defaultEntityId || '')
      setParsedData([])
    }
  }, [open, defaultEntityId])

  const downloadTemplate = () => {
    const csv =
      'Data,Descricao,Valor,Tipo,Categoria\n2023-10-01,Exemplo Receita,1500.00,in,Salario\n2023-10-02,Exemplo Despesa,50.50,out,Alimentacao'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo_importacao.csv'
    a.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim())
      const parsed = lines.slice(1).map((line, i) => {
        const cols = line.split(',')
        if (cols.length < 4)
          return {
            id: i,
            isValid: false,
            raw: line,
            data: '',
            descricao: '',
            valor: 0,
            tipo: '',
            categoria: '',
          }
        const [data, descricao, valorStr, tipo, categoria] = cols
        const valor = Number(valorStr)
        const isValid =
          !isNaN(valor) &&
          valor > 0 &&
          (tipo?.trim() === 'in' || tipo?.trim() === 'out') &&
          !isNaN(Date.parse(data)) &&
          !!descricao?.trim()
        return {
          id: i,
          data: data?.trim(),
          descricao: descricao?.trim(),
          valor,
          tipo: tipo?.trim(),
          categoria: categoria?.trim(),
          isValid,
          raw: line,
        }
      })
      setParsedData(parsed)
    }
    reader.readAsText(file)
  }

  const handleConfirm = async () => {
    if (!entityId) {
      toast.error('Selecione uma entidade para importar.')
      return
    }
    const validRows = parsedData.filter((r) => r.isValid)
    if (validRows.length === 0) {
      toast.error('Nenhuma linha válida para importar.')
      return
    }

    const payloads = validRows.map((r) => ({
      entityId,
      date: r.data,
      description: r.descricao,
      amount: r.valor,
      type: r.tipo,
      category: r.categoria,
    }))

    const { error, count } = await importTransactions(payloads)
    if (!error) {
      toast.success(`${count} transações importadas com sucesso!`)
      onOpenChange(false)
    } else {
      toast.error('Erro ao importar transações.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Transações</DialogTitle>
          <DialogDescription>Faça upload de um arquivo CSV com suas transações.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 overflow-hidden">
          <div className="flex items-end gap-4">
            <div className="grid gap-2 flex-1">
              <Label>Entidade Destino</Label>
              <Select value={entityId} onValueChange={setEntityId}>
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
            <Button variant="outline" onClick={downloadTemplate} className="gap-2 shrink-0">
              <Download className="h-4 w-4" /> Template
            </Button>
          </div>

          <div className="grid gap-2">
            <Label>Arquivo CSV</Label>
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
          </div>

          {parsedData.length > 0 && (
            <div className="flex flex-col gap-2 overflow-hidden">
              <Label>Preview dos Dados</Label>
              <div className="border rounded-md overflow-y-auto max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((row) => (
                      <TableRow key={row.id} className={cn(!row.isValid && 'bg-rose-500/10')}>
                        <TableCell>
                          {row.isValid ? (
                            <span className="text-emerald-500 text-xs font-medium">Válido</span>
                          ) : (
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                          )}
                        </TableCell>
                        <TableCell>{row.data}</TableCell>
                        <TableCell>{row.descricao}</TableCell>
                        <TableCell>{row.valor}</TableCell>
                        <TableCell>{row.tipo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-sm text-muted-foreground">
                {parsedData.filter((r) => r.isValid).length} válidas de {parsedData.length} totais.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!parsedData.some((r) => r.isValid)}>
            <Upload className="h-4 w-4 mr-2" /> Confirmar Importação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
