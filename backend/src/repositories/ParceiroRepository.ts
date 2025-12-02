import { randomUUID } from 'crypto'
import type { RegisterParceiroDTO, Parceiro } from '../types/parceiro'
import { supabase } from '../config/SupabaseClient'

// Implementação temporária em memória até existir o modelo Prisma `Parceiro`.
const store: Map<string, Parceiro> = new Map()

class ParceiroRepository {
    static async register(payload: RegisterParceiroDTO): Promise<Parceiro> {
        const { data, error } = await supabase
            .from('parceiros')
            .insert({
                nome: payload.nome,
                email: payload.email,
                telefone: payload.telefone ?? null,
                documento: payload.documento ?? null,
                
            })
            .select()
            .single()

        if (error) throw error

        const parceiro: Parceiro = {
            id: data.id,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone ?? undefined,
            documento: data.documento ?? undefined,
            criadoEm: new Date(data.created_at),
            atualizadoEm: new Date(data.updated_at),
        }
        
        store.set(parceiro.id, parceiro)
        return parceiro
    }

    static async findById(id: string): Promise<Parceiro | null> {
        const { data, error } = await supabase
            .from('parceiros')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) return null

        return {
            id: data.id,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone ?? undefined,
            documento: data.documento ?? undefined,
            criadoEm: new Date(data.created_at),
            atualizadoEm: new Date(data.updated_at),
        }
    }

    static async update(id: string, data: Partial<RegisterParceiroDTO>): Promise<Parceiro | null> {
        const current = store.get(id)
        if (!current) return null
        const updated: Parceiro = {
            ...current,
            nome: data.nome !== undefined ? String(data.nome) : current.nome,
            email: data.email !== undefined ? String(data.email) : current.email,
            telefone: data.telefone !== undefined ? (data.telefone ? String(data.telefone) : undefined) : current.telefone,
            documento: data.documento !== undefined ? (data.documento ? String(data.documento) : undefined) : current.documento,
            atualizadoEm: new Date(),
        }
        store.set(id, updated)
        return updated
    }

    static async list(params?: Record<string, unknown>): Promise<Parceiro[]> {
        const { data, error } = await supabase
            .from('parceiros')
            .select('*')
            .order('created_at', { ascending: false })

        if (error || !data) return []

        return data.map(row => ({
            id: row.id,
            nome: row.nome,
            email: row.email,
            telefone: row.telefone ?? undefined,
            documento: row.documento ?? undefined,
            criadoEm: new Date(row.created_at),
            atualizadoEm: new Date(row.updated_at),
        }))
    }

    static async remove(id: string): Promise<boolean> {
        return store.delete(id)
    }
}   






export default ParceiroRepository;