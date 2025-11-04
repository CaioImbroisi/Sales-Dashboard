// app/api/clients/route.ts
import prisma from '@/lib/prisma'
import { clientCreateSchema } from '@/lib/validators'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name') ?? undefined
    const email = searchParams.get('email') ?? undefined
    const startDate = searchParams.get('startDate') ?? undefined
    const endDate = searchParams.get('endDate') ?? undefined

    const where: any = {}

    if (name) where.name = { contains: name, mode: 'insensitive' }
    if (email) where.email = { contains: email, mode: 'insensitive' }
    if (startDate && endDate) {
      const s = new Date(startDate)
      const e = new Date(endDate)
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        where.createdAt = { gte: s, lte: e }
      }
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return new Response(JSON.stringify(clients), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Erro ao listar clientes' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = userCreateSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 })
    }
    const data = parsed.data

    const cpf = data.cpf

    // valida duplicidade
    const emailInUser = await prisma.user.findUnique({ where: { email: data.email } })
    const emailInClient = await prisma.client.findUnique({ where: { email: data.email } })
    if (emailInUser || emailInClient) {
      return new Response(JSON.stringify({ error: 'Email já existe no sistema' }), { status: 400 })
    }
    const cpfInUser = await prisma.user.findUnique({ where: { cpf } })
    const cpfInClient = await prisma.client.findUnique({ where: { cpf } })
    if (cpfInUser || cpfInClient) {
      return new Response(JSON.stringify({ error: 'CPF já existe no sistema' }), { status: 400 })
    }

    // cria o usuário
    const created = await prisma.client.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cpf,
        idade: data.idade,
        tipoUsuario: data.tipoUsuario,
        cep: data.cep,
        estado: data.estado,
        endereco: data.endereco,
        complemento: data.complemento ?? null,
      },
    })

    return new Response(JSON.stringify(created), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message || 'Erro ao criar usuário' }), { status: 500 })
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return new Response(JSON.stringify({ error: 'ID não informado' }), { status: 400 })

    // Client.id é Int no schema; garantir Number
    await prisma.client.delete({ where: { id: Number(id) } })

    return new Response(JSON.stringify({ message: 'Cliente removido' }), { status: 200 })
  } catch (err: any) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message || 'Erro ao deletar cliente' }), { status: 500 })
  }
}
