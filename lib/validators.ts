import { z } from 'zod'

const cpfString = z
  .string()
  .min(11)
  .max(14)
  .transform((val) => val.replace(/\D/g, ''))

export const userCreateSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  cpf: cpfString,
  idade: z.number().int().min(0).max(150),
  tipoUsuario: z.enum(['ADMIN', 'CONSULTOR', 'CLIENTE']),
  cep: z.string().min(5),
  estado: z.string().min(2),
  endereco: z.string().min(3),
  complemento: z.string().optional(),
})

export const clientCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  cpf: cpfString,
  age: z.number().int().min(0).max(150),
  address: z.string().min(3),
  status: z.string().min(2),
  consultantId: z.string().or(z.number()),
})

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type ClientCreateInput = z.infer<typeof clientCreateSchema>
