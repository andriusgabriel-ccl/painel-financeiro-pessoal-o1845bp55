// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      cartoes: {
        Row: {
          created_at: string
          dia_vencimento: number
          entidade_id: string
          id: string
          limite_total: number
          melhor_dia_compra: number
          nome: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dia_vencimento: number
          entidade_id: string
          id?: string
          limite_total?: number
          melhor_dia_compra: number
          nome: string
          user_id: string
        }
        Update: {
          created_at?: string
          dia_vencimento?: number
          entidade_id?: string
          id?: string
          limite_total?: number
          melhor_dia_compra?: number
          nome?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartoes_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          created_at: string
          entidade_id: string
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entidade_id: string
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          created_at?: string
          entidade_id?: string
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_milhas: {
        Row: {
          created_at: string
          id: string
          preco_venda_mercado: number
          programa: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preco_venda_mercado?: number
          programa: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preco_venda_mercado?: number
          programa?: string
          user_id?: string
        }
        Relationships: []
      }
      entidades: {
        Row: {
          created_at: string
          icon_name: string
          id: string
          nome: string
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          icon_name?: string
          id?: string
          nome: string
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          icon_name?: string
          id?: string
          nome?: string
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          categoria_id: string | null
          created_at: string
          data: string
          descricao: string
          entidade_destino_id: string | null
          entidade_id: string
          id: string
          observacoes: string | null
          origem: string
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string
          data: string
          descricao: string
          entidade_destino_id?: string | null
          entidade_id: string
          id?: string
          observacoes?: string | null
          origem: string
          tipo: string
          user_id: string
          valor: number
        }
        Update: {
          categoria_id?: string | null
          created_at?: string
          data?: string
          descricao?: string
          entidade_destino_id?: string | null
          entidade_id?: string
          id?: string
          observacoes?: string | null
          origem?: string
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_entidade_destino_id_fkey"
            columns: ["entidade_destino_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_cartao: {
        Row: {
          cartao_id: string
          categoria_id: string | null
          created_at: string
          data: string
          descricao: string
          id: string
          parcela_atual: number | null
          total_parcelas: number | null
          user_id: string
          valor: number
        }
        Insert: {
          cartao_id: string
          categoria_id?: string | null
          created_at?: string
          data: string
          descricao: string
          id?: string
          parcela_atual?: number | null
          total_parcelas?: number | null
          user_id: string
          valor: number
        }
        Update: {
          cartao_id?: string
          categoria_id?: string | null
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          parcela_atual?: number | null
          total_parcelas?: number | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_cartao_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_cartao_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_investimento: {
        Row: {
          created_at: string
          data: string
          id: string
          posicao_id: string
          preco_unitario: number
          quantidade: number
          tipo_movimentacao: string
          user_id: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data: string
          id?: string
          posicao_id: string
          preco_unitario: number
          quantidade: number
          tipo_movimentacao: string
          user_id: string
          valor_total: number
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          posicao_id?: string
          preco_unitario?: number
          quantidade?: number
          tipo_movimentacao?: string
          user_id?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_investimento_posicao_id_fkey"
            columns: ["posicao_id"]
            isOneToOne: false
            referencedRelation: "posicoes_investimento"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_milhas: {
        Row: {
          created_at: string
          data: string
          id: string
          programa: string
          quantidade: number
          tipo: string
          user_id: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          data: string
          id?: string
          programa: string
          quantidade: number
          tipo: string
          user_id: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          programa?: string
          quantidade?: number
          tipo?: string
          user_id?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: []
      }
      obrigacoes: {
        Row: {
          created_at: string
          descricao: string
          entidade_id: string
          id: string
          status: string
          tipo: string
          user_id: string
          valor: number
          vencimento: string
        }
        Insert: {
          created_at?: string
          descricao: string
          entidade_id: string
          id?: string
          status: string
          tipo: string
          user_id: string
          valor: number
          vencimento: string
        }
        Update: {
          created_at?: string
          descricao?: string
          entidade_id?: string
          id?: string
          status?: string
          tipo?: string
          user_id?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "obrigacoes_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
        ]
      }
      posicoes_investimento: {
        Row: {
          created_at: string
          entidade_id: string
          id: string
          nome: string
          preco_atual: number
          preco_medio: number
          quantidade: number
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entidade_id: string
          id?: string
          nome: string
          preco_atual?: number
          preco_medio?: number
          quantidade?: number
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          entidade_id?: string
          id?: string
          nome?: string
          preco_atual?: number
          preco_medio?: number
          quantidade?: number
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posicoes_investimento_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_obrigacoes_atrasadas: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: cartoes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   entidade_id: uuid (not null)
//   nome: text (not null)
//   limite_total: numeric (not null, default: 0)
//   melhor_dia_compra: integer (not null)
//   dia_vencimento: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: categorias
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   entidade_id: uuid (not null)
//   nome: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: configuracoes_milhas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   programa: text (not null)
//   preco_venda_mercado: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: entidades
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   tipo: text (not null)
//   icon_name: text (not null, default: 'Building'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: lancamentos
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   entidade_id: uuid (not null)
//   data: date (not null)
//   tipo: text (not null)
//   valor: numeric (not null)
//   categoria_id: uuid (nullable)
//   descricao: text (not null)
//   observacoes: text (nullable)
//   entidade_destino_id: uuid (nullable)
//   origem: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: lancamentos_cartao
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   cartao_id: uuid (not null)
//   categoria_id: uuid (nullable)
//   data: date (not null)
//   descricao: text (not null)
//   valor: numeric (not null)
//   parcela_atual: integer (nullable, default: 1)
//   total_parcelas: integer (nullable, default: 1)
//   created_at: timestamp with time zone (not null, default: now())
// Table: movimentacoes_investimento
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   posicao_id: uuid (not null)
//   data: date (not null)
//   tipo_movimentacao: text (not null)
//   quantidade: numeric (not null)
//   preco_unitario: numeric (not null)
//   valor_total: numeric (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: movimentacoes_milhas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   data: date (not null)
//   programa: text (not null)
//   tipo: text (not null)
//   quantidade: numeric (not null)
//   valor_unitario: numeric (not null)
//   valor_total: numeric (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: obrigacoes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   entidade_id: uuid (not null)
//   descricao: text (not null)
//   valor: numeric (not null)
//   vencimento: date (not null)
//   tipo: text (not null)
//   status: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: posicoes_investimento
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   entidade_id: uuid (not null)
//   nome: text (not null)
//   tipo: text (not null)
//   quantidade: numeric (not null, default: 0)
//   preco_medio: numeric (not null, default: 0)
//   preco_atual: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: cartoes
//   FOREIGN KEY cartoes_entidade_id_fkey: FOREIGN KEY (entidade_id) REFERENCES entidades(id) ON DELETE CASCADE
//   PRIMARY KEY cartoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY cartoes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: categorias
//   FOREIGN KEY categorias_entidade_id_fkey: FOREIGN KEY (entidade_id) REFERENCES entidades(id) ON DELETE CASCADE
//   PRIMARY KEY categorias_pkey: PRIMARY KEY (id)
//   FOREIGN KEY categorias_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: configuracoes_milhas
//   PRIMARY KEY configuracoes_milhas_pkey: PRIMARY KEY (id)
//   CHECK configuracoes_milhas_programa_check: CHECK ((programa = ANY (ARRAY['Smiles'::text, 'Latam Pass'::text, 'TudoAzul'::text])))
//   FOREIGN KEY configuracoes_milhas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE configuracoes_milhas_user_id_programa_key: UNIQUE (user_id, programa)
// Table: entidades
//   PRIMARY KEY entidades_pkey: PRIMARY KEY (id)
//   CHECK entidades_tipo_check: CHECK ((tipo = ANY (ARRAY['PF'::text, 'PJ'::text])))
//   FOREIGN KEY entidades_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: lancamentos
//   FOREIGN KEY lancamentos_categoria_id_fkey: FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
//   FOREIGN KEY lancamentos_entidade_destino_id_fkey: FOREIGN KEY (entidade_destino_id) REFERENCES entidades(id) ON DELETE CASCADE
//   FOREIGN KEY lancamentos_entidade_id_fkey: FOREIGN KEY (entidade_id) REFERENCES entidades(id) ON DELETE CASCADE
//   CHECK lancamentos_origem_check: CHECK ((origem = ANY (ARRAY['interna'::text, 'externa'::text])))
//   PRIMARY KEY lancamentos_pkey: PRIMARY KEY (id)
//   CHECK lancamentos_tipo_check: CHECK ((tipo = ANY (ARRAY['in'::text, 'out'::text, 'transfer'::text])))
//   FOREIGN KEY lancamentos_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: lancamentos_cartao
//   FOREIGN KEY lancamentos_cartao_cartao_id_fkey: FOREIGN KEY (cartao_id) REFERENCES cartoes(id) ON DELETE CASCADE
//   FOREIGN KEY lancamentos_cartao_categoria_id_fkey: FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
//   PRIMARY KEY lancamentos_cartao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY lancamentos_cartao_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: movimentacoes_investimento
//   PRIMARY KEY movimentacoes_investimento_pkey: PRIMARY KEY (id)
//   FOREIGN KEY movimentacoes_investimento_posicao_id_fkey: FOREIGN KEY (posicao_id) REFERENCES posicoes_investimento(id) ON DELETE CASCADE
//   CHECK movimentacoes_investimento_tipo_movimentacao_check: CHECK ((tipo_movimentacao = ANY (ARRAY['compra'::text, 'venda'::text])))
//   FOREIGN KEY movimentacoes_investimento_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: movimentacoes_milhas
//   PRIMARY KEY movimentacoes_milhas_pkey: PRIMARY KEY (id)
//   CHECK movimentacoes_milhas_programa_check: CHECK ((programa = ANY (ARRAY['Smiles'::text, 'Latam Pass'::text, 'TudoAzul'::text])))
//   CHECK movimentacoes_milhas_tipo_check: CHECK ((tipo = ANY (ARRAY['compra'::text, 'venda_agencia'::text, 'venda_terceiro'::text, 'transferencia'::text, 'expiracao'::text])))
//   FOREIGN KEY movimentacoes_milhas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: obrigacoes
//   FOREIGN KEY obrigacoes_entidade_id_fkey: FOREIGN KEY (entidade_id) REFERENCES entidades(id) ON DELETE CASCADE
//   PRIMARY KEY obrigacoes_pkey: PRIMARY KEY (id)
//   CHECK obrigacoes_status_check: CHECK ((status = ANY (ARRAY['pendente'::text, 'pago'::text, 'atrasado'::text])))
//   CHECK obrigacoes_tipo_check: CHECK ((tipo = ANY (ARRAY['payable'::text, 'receivable'::text])))
//   FOREIGN KEY obrigacoes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: posicoes_investimento
//   FOREIGN KEY posicoes_investimento_entidade_id_fkey: FOREIGN KEY (entidade_id) REFERENCES entidades(id) ON DELETE CASCADE
//   PRIMARY KEY posicoes_investimento_pkey: PRIMARY KEY (id)
//   CHECK posicoes_investimento_tipo_check: CHECK ((tipo = ANY (ARRAY['Renda Fixa'::text, 'ETF'::text, 'Ações'::text, 'Cripto'::text])))
//   FOREIGN KEY posicoes_investimento_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: cartoes
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "cartoes_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "cartoes_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "cartoes_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "cartoes_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: categorias
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can manage their own categorias" (ALL, PERMISSIVE) roles={public}
//     USING: (entidade_id IN ( SELECT entidades.id    FROM entidades   WHERE (entidades.user_id = auth.uid())))
//   Policy "categorias_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "categorias_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "categorias_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "categorias_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: configuracoes_milhas
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "configuracoes_milhas_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "configuracoes_milhas_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "configuracoes_milhas_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "configuracoes_milhas_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: entidades
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can manage their own entidades" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "entidades_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "entidades_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "entidades_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "entidades_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: lancamentos
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can manage their own lancamentos" (ALL, PERMISSIVE) roles={public}
//     USING: (entidade_id IN ( SELECT entidades.id    FROM entidades   WHERE (entidades.user_id = auth.uid())))
//   Policy "lancamentos_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "lancamentos_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "lancamentos_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "lancamentos_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: lancamentos_cartao
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "lancamentos_cartao_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "lancamentos_cartao_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "lancamentos_cartao_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "lancamentos_cartao_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: movimentacoes_investimento
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "movimentacoes_investimento_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "movimentacoes_investimento_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "movimentacoes_investimento_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "movimentacoes_investimento_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: movimentacoes_milhas
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "movimentacoes_milhas_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "movimentacoes_milhas_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "movimentacoes_milhas_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "movimentacoes_milhas_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: obrigacoes
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can manage their own obrigacoes" (ALL, PERMISSIVE) roles={public}
//     USING: (entidade_id IN ( SELECT entidades.id    FROM entidades   WHERE (entidades.user_id = auth.uid())))
//   Policy "obrigacoes_delete_policy" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "obrigacoes_insert_policy" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "obrigacoes_select_policy" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "obrigacoes_update_policy" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: posicoes_investimento
//   Policy "Enable ALL for authenticated users based on user_id" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "posicoes_investimento_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "posicoes_investimento_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "posicoes_investimento_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "posicoes_investimento_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user_seed()
//   CREATE OR REPLACE FUNCTION public.handle_new_user_seed()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       sp_id UUID;
//       mp_id UUID;
//       av_id UUID;
//       mf_id UUID;
//       
//       sp_cat_salario UUID;
//       sp_cat_irpf UUID;
//       sp_cat_beneficios UUID;
//       sp_cat_transf UUID;
//   
//       mp_cat_compra UUID;
//       mp_cat_venda_ag UUID;
//       mp_cat_fatura UUID;
//       mp_cat_transf UUID;
//   
//       av_cat_receita UUID;
//       av_cat_compra UUID;
//       av_cat_custos UUID;
//       av_cat_repasse UUID;
//   
//       mf_cat_aporte UUID;
//       mf_cat_rendimento UUID;
//       mf_cat_dividendos UUID;
//       mf_cat_bitcoin UUID;
//   BEGIN
//       -- Entidades
//       INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
//       (gen_random_uuid(), NEW.id, 'Servidor Público', 'PF', 'Building') RETURNING id INTO sp_id;
//       
//       INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
//       (gen_random_uuid(), NEW.id, 'Milheiro Profissional', 'PF', 'CreditCard') RETURNING id INTO mp_id;
//       
//       INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
//       (gen_random_uuid(), NEW.id, 'Agência de Viagens', 'PJ', 'Plane') RETURNING id INTO av_id;
//       
//       INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
//       (gen_random_uuid(), NEW.id, 'Mercado Financeiro', 'PF', 'LineChart') RETURNING id INTO mf_id;
//   
//       -- Categorias
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'Salário STN') RETURNING id INTO sp_cat_salario;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'IRPF') RETURNING id INTO sp_cat_irpf;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'Benefícios') RETURNING id INTO sp_cat_beneficios;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'Transferência para Milheiro') RETURNING id INTO sp_cat_transf;
//   
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Compra de Milhas') RETURNING id INTO mp_cat_compra;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Venda para Agência') RETURNING id INTO mp_cat_venda_ag;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Fatura Cartão') RETURNING id INTO mp_cat_fatura;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Transferência Recebida') RETURNING id INTO mp_cat_transf;
//   
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Receita de Emissões') RETURNING id INTO av_cat_receita;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Compra de Milhas do Milheiro') RETURNING id INTO av_cat_compra;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Custos Operacionais') RETURNING id INTO av_cat_custos;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Repasse PJ para PF') RETURNING id INTO av_cat_repasse;
//   
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Aporte') RETURNING id INTO mf_cat_aporte;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Rendimento Renda Fixa') RETURNING id INTO mf_cat_rendimento;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Dividendos ETF') RETURNING id INTO mf_cat_dividendos;
//       INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Bitcoin') RETURNING id INTO mf_cat_bitcoin;
//   
//       -- Lançamentos SP
//       INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
//       (NEW.id, sp_id, CURRENT_DATE, 'in', 15000, sp_cat_salario, 'Salário STN', 'externa'),
//       (NEW.id, sp_id, CURRENT_DATE - INTERVAL '1 day', 'out', 5000, sp_cat_transf, 'Transferência para Milheiro', 'interna'),
//       (NEW.id, sp_id, CURRENT_DATE - INTERVAL '3 days', 'out', 3500, sp_cat_irpf, 'IRPF Retido', 'externa'),
//       (NEW.id, sp_id, CURRENT_DATE - INTERVAL '8 days', 'in', 1200, sp_cat_beneficios, 'Auxílio Alimentação', 'externa');
//   
//       -- Lançamentos MP
//       INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
//       (NEW.id, mp_id, CURRENT_DATE, 'in', 5000, mp_cat_transf, 'Transferência Recebida', 'interna'),
//       (NEW.id, mp_id, CURRENT_DATE - INTERVAL '1 day', 'out', 3500, mp_cat_compra, 'Compra TudoAzul', 'externa'),
//       (NEW.id, mp_id, CURRENT_DATE - INTERVAL '4 days', 'in', 2800, mp_cat_venda_ag, 'Venda Balcão', 'interna'),
//       (NEW.id, mp_id, CURRENT_DATE - INTERVAL '6 days', 'out', 4200, mp_cat_fatura, 'Pagamento Fatura Black', 'externa');
//   
//       -- Lançamentos AV
//       INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
//       (NEW.id, av_id, CURRENT_DATE, 'in', 12500, av_cat_receita, 'Emissão Pacote Miami', 'externa'),
//       (NEW.id, av_id, CURRENT_DATE - INTERVAL '1 day', 'out', 2800, av_cat_compra, 'Compra Milhas MP', 'interna'),
//       (NEW.id, av_id, CURRENT_DATE - INTERVAL '3 days', 'out', 2500, av_cat_custos, 'Aluguel Sala', 'externa'),
//       (NEW.id, av_id, CURRENT_DATE - INTERVAL '8 days', 'out', 8000, av_cat_repasse, 'Distribuição Lucros', 'interna');
//   
//       -- Lançamentos MF
//       INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
//       (NEW.id, mf_id, CURRENT_DATE, 'in', 450, mf_cat_rendimento, 'Rendimento Tesouro', 'externa'),
//       (NEW.id, mf_id, CURRENT_DATE - INTERVAL '1 day', 'in', 2000, mf_cat_aporte, 'Aporte Mensal', 'interna'),
//       (NEW.id, mf_id, CURRENT_DATE - INTERVAL '2 days', 'in', 125, mf_cat_dividendos, 'Dividendos IVVB11', 'externa'),
//       (NEW.id, mf_id, CURRENT_DATE - INTERVAL '4 days', 'out', 1000, mf_cat_bitcoin, 'Compra BTC', 'externa');
//   
//       -- Obrigacoes SP
//       INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
//       (NEW.id, sp_id, 'IRPF Anual', 3500, CURRENT_DATE + INTERVAL '5 days', 'payable', 'pendente'),
//       (NEW.id, sp_id, 'Conta de Água e Luz', 280, CURRENT_DATE + INTERVAL '2 days', 'payable', 'pendente'),
//       (NEW.id, sp_id, 'Restituição IRPF', 1500, CURRENT_DATE + INTERVAL '15 days', 'receivable', 'pendente'),
//       (NEW.id, sp_id, 'Mensalidade Clube', 350, CURRENT_DATE - INTERVAL '5 days', 'payable', 'pago');
//   
//       -- Obrigacoes MP
//       INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
//       (NEW.id, mp_id, 'Fatura Cartão Azul', 8500, CURRENT_DATE - INTERVAL '1 day', 'payable', 'atrasado'),
//       (NEW.id, mp_id, 'Compra de Milhas Parcelada', 4200, CURRENT_DATE + INTERVAL '10 days', 'payable', 'pendente'),
//       (NEW.id, mp_id, 'Venda Balcão (Agência)', 2800, CURRENT_DATE + INTERVAL '3 days', 'receivable', 'pendente');
//   
//       -- Obrigacoes AV
//       INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
//       (NEW.id, av_id, 'Fornecedor Hotelaria', 15000, CURRENT_DATE + INTERVAL '6 days', 'payable', 'pendente'),
//       (NEW.id, av_id, 'Custos Operacionais', 4500, CURRENT_DATE + INTERVAL '20 days', 'payable', 'pendente'),
//       (NEW.id, av_id, 'Faturamento Clientes', 22000, CURRENT_DATE + INTERVAL '2 days', 'receivable', 'pendente');
//   
//       -- Obrigacoes MF
//       INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
//       (NEW.id, mf_id, 'Aporte Programado Renda Fixa', 5000, CURRENT_DATE + INTERVAL '4 days', 'payable', 'pendente'),
//       (NEW.id, mf_id, 'Vencimento Tesouro Direto', 12500, CURRENT_DATE + INTERVAL '25 days', 'receivable', 'pendente');
//   
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_obrigacoes_atrasadas()
//   CREATE OR REPLACE FUNCTION public.update_obrigacoes_atrasadas()
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE obrigacoes
//     SET status = 'atrasado'
//     WHERE status = 'pendente'
//       AND vencimento < CURRENT_DATE;
//   END;
//   $function$
//   

// --- INDEXES ---
// Table: configuracoes_milhas
//   CREATE UNIQUE INDEX configuracoes_milhas_user_id_programa_key ON public.configuracoes_milhas USING btree (user_id, programa)

