-- Grant usage on schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions for tables to authenticated and anon roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entidades TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categorias TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obrigacoes TO authenticated, anon;

-- Drop previous generic policies to prevent conflicts
DROP POLICY IF EXISTS "Users can manage their own entidades" ON public.entidades;
DROP POLICY IF EXISTS "Users can manage their own categorias" ON public.categorias;
DROP POLICY IF EXISTS "Users can manage their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can manage their own obrigacoes" ON public.obrigacoes;

-- Entidades policies
CREATE POLICY "authenticated_select_entidades" ON public.entidades
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "authenticated_insert_entidades" ON public.entidades
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_update_entidades" ON public.entidades
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_delete_entidades" ON public.entidades
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Categorias policies
CREATE POLICY "authenticated_select_categorias" ON public.categorias
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "authenticated_insert_categorias" ON public.categorias
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_update_categorias" ON public.categorias
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_delete_categorias" ON public.categorias
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Lancamentos policies
CREATE POLICY "authenticated_select_lancamentos" ON public.lancamentos
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "authenticated_insert_lancamentos" ON public.lancamentos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_update_lancamentos" ON public.lancamentos
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_delete_lancamentos" ON public.lancamentos
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Obrigacoes policies
CREATE POLICY "authenticated_select_obrigacoes" ON public.obrigacoes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "authenticated_insert_obrigacoes" ON public.obrigacoes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_update_obrigacoes" ON public.obrigacoes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_delete_obrigacoes" ON public.obrigacoes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
