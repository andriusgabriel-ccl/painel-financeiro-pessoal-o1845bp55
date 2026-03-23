import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'supabase'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    if (!TELEGRAM_BOT_TOKEN || !GEMINI_API_KEY) {
      return new Response('Missing Server Secrets', { status: 500, headers: corsHeaders })
    }

    let tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
    let tgRes = await fetch(tgUrl)
    let tgData = await tgRes.json()

    if (tgData.error_code === 409) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook`)
      tgRes = await fetch(tgUrl)
      tgData = await tgRes.json()
    }

    if (!tgData.ok || !tgData.result || tgData.result.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let maxUpdateId = 0
    let processed = 0

    for (const update of tgData.result) {
      maxUpdateId = Math.max(maxUpdateId, update.update_id)

      if (!update.message || !update.message.text) continue

      const chatId = update.message.chat.id
      const text = update.message.text

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Você é um assistente financeiro. Extraia os dados da seguinte mensagem para um lançamento financeiro.
              Retorne APENAS um JSON válido no formato: {"valor": numero, "categoria": "string", "entidade": "string", "descricao": "string", "tipo": "in" ou "out"}.
              Se a mensagem for sobre um gasto/despesa, "tipo" é "out". Se for um ganho/receita, "tipo" é "in".
              Mensagem: "${text}"`,
                  },
                ],
              },
            ],
          }),
        },
      )

      const geminiData = await geminiRes.json()
      if (!geminiData.candidates || geminiData.candidates.length === 0) {
        await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, `❌ Não entendi a mensagem.`)
        continue
      }

      const responseText = geminiData.candidates[0].content.parts[0].text
      const jsonStr = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      let parsed
      try {
        parsed = JSON.parse(jsonStr)
      } catch (e) {
        await sendTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          chatId,
          `❌ Erro ao interpretar os dados. Tente reformular a mensagem.`,
        )
        continue
      }

      if (!parsed.valor || !parsed.descricao) {
        await sendTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          chatId,
          `❌ Não consegui identificar o valor ou a descrição. Pode fornecer mais detalhes?`,
        )
        continue
      }

      const entidadeQuery = parsed.entidade || ''
      const { data: entidades } = await supabase
        .from('entidades')
        .select('id, user_id, nome')
        .ilike('nome', `%${entidadeQuery}%`)
        .limit(1)

      let entidade
      if (entidades && entidades.length > 0) {
        entidade = entidades[0]
      } else {
        const { data: fallbackEntidades } = await supabase
          .from('entidades')
          .select('id, user_id, nome')
          .limit(1)
        if (fallbackEntidades && fallbackEntidades.length > 0) {
          entidade = fallbackEntidades[0]
        } else {
          await sendTelegramMessage(
            TELEGRAM_BOT_TOKEN,
            chatId,
            `❌ Não encontrei nenhuma entidade no sistema para registrar o lançamento.`,
          )
          continue
        }
      }

      let categoriaId = null
      let categoriaNome = ''
      if (parsed.categoria) {
        const { data: categorias } = await supabase
          .from('categorias')
          .select('id, nome')
          .eq('entidade_id', entidade.id)
          .ilike('nome', `%${parsed.categoria}%`)
          .limit(1)

        if (categorias && categorias.length > 0) {
          categoriaId = categorias[0].id
          categoriaNome = categorias[0].nome
        }
      }

      const { error: insertError } = await supabase.from('lancamentos').insert({
        user_id: user.id,
        entidade_id: entidade.id,
        categoria_id: categoriaId,
        valor: Number(parsed.valor),
        descricao: parsed.descricao,
        tipo: parsed.tipo || 'out',
        data: new Date().toISOString().split('T')[0],
        origem: 'externa',
      })

      if (insertError) {
        await sendTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          chatId,
          `❌ Erro ao registrar lançamento: ${insertError.message}`,
        )
      } else {
        processed++
        await sendTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          chatId,
          `✅ Lançamento registrado com sucesso!\n\n💰 Valor: R$ ${Number(parsed.valor).toFixed(2)}\n📝 Descrição: ${parsed.descricao}\n🏢 Entidade: ${entidade.nome}${categoriaNome ? `\n🏷️ Categoria: ${categoriaNome}` : ''}`,
        )
      }
    }

    if (maxUpdateId > 0) {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${maxUpdateId + 1}`,
      )
    }

    return new Response(JSON.stringify({ success: true, processed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})

async function sendTelegramMessage(token: string, chatId: number, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
  } catch (e) {
    console.error('Error sending message back', e)
  }
}
