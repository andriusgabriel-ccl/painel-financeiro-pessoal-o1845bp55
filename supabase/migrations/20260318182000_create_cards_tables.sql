-- Create cartoes table
CREATE TABLE IF NOT EXISTS public.cartoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entidade_id UUID NOT NULL REFERENCES public.entidades(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  limite_total NUMERIC NOT NULL DEFAULT 0,
  melhor_dia_compra INTEGER NOT NULL,
  dia_vencimento INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create lancamentos_cartao table
CREATE TABLE IF NOT EXISTS public.lancamentos_cartao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cartao_id UUID NOT NULL REFERENCES public.cartoes(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  data DATE NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  parcela_atual INTEGER DEFAULT 1,
  total_parcelas INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cartoes TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos_cartao TO authenticated, anon;

-- Enable RLS
ALTER TABLE public.cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos_cartao ENABLE ROW LEVEL SECURITY;

-- Policies for cartoes
CREATE POLICY "cartoes_select_policy" ON public.cartoes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cartoes_insert_policy" ON public.cartoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cartoes_update_policy" ON public.cartoes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cartoes_delete_policy" ON public.cartoes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for lancamentos_cartao
CREATE POLICY "lancamentos_cartao_select_policy" ON public.lancamentos_cartao FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lancamentos_cartao_insert_policy" ON public.lancamentos_cartao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lancamentos_cartao_update_policy" ON public.lancamentos_cartao FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lancamentos_cartao_delete_policy" ON public.lancamentos_cartao FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed Data (safe insert if user and entity exist)
DO $$
DECLARE
  v_user_id UUID;
  v_entidade_id UUID;
  v_categoria_id UUID;
  v_cartao_id UUID;
BEGIN
  -- Get the first authenticated user
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
      -- Check if this user already has cards
      IF NOT EXISTS (SELECT 1 FROM public.cartoes WHERE user_id = v_user_id) THEN
          -- Get their first entity
          SELECT id INTO v_entidade_id FROM public.entidades WHERE user_id = v_user_id LIMIT 1;
          
          IF v_entidade_id IS NOT NULL THEN
              -- Create a sample card
              INSERT INTO public.cartoes (user_id, entidade_id, nome, limite_total, melhor_dia_compra, dia_vencimento)
              VALUES (v_user_id, v_entidade_id, 'Cartão Black Exemplo', 15000, 5, 12)
              RETURNING id INTO v_cartao_id;

              IF v_cartao_id IS NOT NULL THEN
                  -- Get a category to link
                  SELECT id INTO v_categoria_id FROM public.categorias WHERE entidade_id = v_entidade_id LIMIT 1;

                  -- Insert sample transactions
                  INSERT INTO public.lancamentos_cartao (user_id, cartao_id, categoria_id, data, descricao, valor, parcela_atual, total_parcelas)
                  VALUES 
                  (v_user_id, v_cartao_id, v_categoria_id, CURRENT_DATE, 'Compra de Passagem', 1200.00, 1, 3),
                  (v_user_id, v_cartao_id, v_categoria_id, CURRENT_DATE + INTERVAL '1 month', 'Compra de Passagem', 1200.00, 2, 3),
                  (v_user_id, v_cartao_id, v_categoria_id, CURRENT_DATE + INTERVAL '2 months', 'Compra de Passagem', 1200.00, 3, 3),
                  (v_user_id, v_cartao_id, v_categoria_id, CURRENT_DATE - INTERVAL '2 days', 'Assinatura Software', 89.90, 1, 1);
              END IF;
          END IF;
      END IF;
  END IF;
END $$;
