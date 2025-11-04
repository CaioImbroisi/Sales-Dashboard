// app/api/users/route.ts
import prisma from '../../../lib/prisma'
import { userCreateSchema } from '@/lib/validators'
import { z } from 'zod'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name') ?? undefined
    const email = searchParams.get('email') ?? undefined
    const tipo = searchParams.get('tipo') ?? undefined

    const where: any = {}
    if (name) where.nome = { contains: name, mode: 'insensitive' }
    if (email) where.email = { contains: email, mode: 'insensitive' }
    if (tipo) where.tipoUsuario = { equals: tipo.toUpperCase() }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Erro ao listar usuários' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // validação com Zod
    const parsed = userCreateSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten() }),
        { status: 400 }
      );
    }

    const data = parsed.data;

    const cpf = data.cpf;

    // checar duplicidade de email/cpf em User e Client
    const emailInUser = await prisma.user.findUnique({ where: { email: data.email } });
    const emailInClient = await prisma.client.findUnique({ where: { email: data.email } });
    if (emailInUser || emailInClient) {
      return new Response(JSON.stringify({ error: 'Email já existe no sistema' }), { status: 400 });
    }

    const cpfInUser = await prisma.user.findUnique({ where: { cpf } });
    const cpfInClient = await prisma.client.findUnique({ where: { cpf } });
    if (cpfInUser || cpfInClient) {
      return new Response(JSON.stringify({ error: 'CPF já existe no sistema' }), { status: 400 });
    }

    // cria o usuário
    const created = await prisma.user.create({
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
    });

// pegar clientIds do body e garantir number[]
const clientIds: number[] = (data.clientIds || []).map((id: any) => Number(id));
console.log(created)
// se for consultor e houver clientes selecionados, atualiza todos de uma vez
if (created.tipoUsuario.toUpperCase() === "CONSULTOR" && clientIds.length > 0) {
  const consultant = await prisma.findunique({where: {email: created.email}})
  console.log(consultant)
  const updateResult = await prisma.client.updateMany({
    where: { id: { in: clientIds } },
    data: { consultantId: consultant.id }, // garante que é number
  });
  console.log("Clientes atualizados:", updateResult);
}

    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || 'Erro ao criar usuário' }), { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return new Response(JSON.stringify({ error: 'ID não informado' }), { status: 400 })

    // tenta deletar
    await prisma.user.delete({ where: { id } })
    return new Response(JSON.stringify({ message: 'Usuário deletado' }), { status: 200 })
  } catch (err: any) {
    console.error(err)
    // se for FK ou não encontrado, retorna 400/404
    return new Response(JSON.stringify({ error: err.message || 'Erro ao deletar' }), { status: 500 })
  }
}
