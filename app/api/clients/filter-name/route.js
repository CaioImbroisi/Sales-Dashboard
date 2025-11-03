import prisma from '../../../../lib/prisma'

export async function GET(req) {
  const url = new URL(req.url)
  const name = url.searchParams.get('name')

  if (!name) return new Response(JSON.stringify({ error: 'Nome obrigatório' }), { status: 400 })

  const clients = await prisma.client.findMany({
    where: { name: { contains: name } },
    include: { consultant: true }
  })

  return new Response(JSON.stringify(clients), { status: 200 })
}
