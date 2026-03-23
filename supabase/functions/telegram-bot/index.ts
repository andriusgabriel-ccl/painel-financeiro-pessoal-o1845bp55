import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'supabase';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('ok');

  try {
    const update = await req.json();
    if (!update.message || !update.message.text) return new Response('ok');

    const chatId = update.message.chat.id;
    const text = update.message.text;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é um assistente financeiro. Extraia os dados da seguinte mensagem para um lançamento financeiro.
            Retorne APENAS um JSON válido no formato: {"valor": numero, "categoria": "string", "entidade": "string", "descricao": "string", "tipo": "in" ou "out"}.
            Se a mensagem for sobre um gasto/despesa, "tipo" é "out". Se for um ganho/receita, "tipo" é "in".
            Mensagem: "${text}"`
          }]
        }]
      })
    });

    const geminiData = await geminiRes.json();
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      await sendTelegramMessage(chatId, `❌ Não entendi a mensagem.`);
      return new Response('ok');
    }

    const responseText = geminiData.candidates[0].content.parts[0].text;
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      await sendTelegramMessage(chatId, `❌ Erro ao interpretar os dados. Tente reformular a mensagem.`);
      return new Response('ok');
    }

    if (!parsed.valor || !parsed.descricao) {
      await sendTelegramMessage(chatId, `❌ Não consegui identificar o valor ou a descrição. Pode fornecer mais detalhes?`);
      return new Response('ok');
    }

    const entidadeQuery = parsed.entidade || '';
    const { data: entidades } = await supabase
      .from('entidades')
      .select('id, user_id, nome')
      .ilike('nome', `%${entidadeQuery}%`)
      .limit(1);

    let entidade;
    if (entidades && entidades.length > 0) {
      entidade = entidades[0];
    } else {
      const { data: fallbackEntidades } = await supabase.from('entidades').select('id, user_id, nome').limit(1);
      if (fallbackEntidades && fallbackEntidades.length > 0) {
        entidade = fallbackEntidades[0];
      } else {
        await sendTelegramMessage(chatId, `❌ Não encontrei nenhuma entidade no sistema para registrar o lançamento.`);
        return new Response('ok');
      }
    }

    const userId = entidade.user_id;

    let categoriaId = null;
    let categoriaNome = '';
    if (parsed.categoria) {
      const { data: categorias } = await supabase
        .from('categorias')
        .select('id, nome')
        .eq('entidade_id', entidade.id)
        .ilike('nome', `%${parsed.categoria}%`)
        .limit(1);

      if (categorias && categorias.length > 0) {
        categoriaId = categorias[0].id;
        categoriaNome = categorias[0].nome;
      }
    }

    const { error: insertError } = await supabase
      .from('lancamentos')
      .insert({
        user_id: userId,
        entidade_id: entidade.id,
        categoria_id: categoriaId,
        valor: Number(parsed.valor),
        descricao: parsed.descricao,
        tipo: parsed.tipo || 'out',
        data: new Date().toISOString().split('T')[0],
        origem: 'externa'
      });

    if (insertError) {
      await sendTelegramMessage(chatId, `❌ Erro ao registrar lançamento: ${insertError.message}`);
    } else {
      await sendTelegramMessage(chatId, `✅ Lançamento registrado!\n\n💰 Valor: R$ ${Number(parsed.valor).toFixed(2)}\n📝 Descrição: ${parsed.descricao}\n🏢 Entidade: ${entidade.nome}${categoriaNome ? `\n🏷️ Categoria: ${categoriaNome}` : ''}`);
    }

  } catch (error: any) {
    console.error(error);
  }

  return new Response('ok');
});

async function sendTelegramMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
