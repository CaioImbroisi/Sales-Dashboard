import prisma from '../../../../lib/prisma'

export async function GET(req) {
  const url = new URL(req.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return new Response(JSON.stringify({ error: 'Nome obrigatório' }), { status: 400 })
  }

const users = await prisma.user.findMany({
  where: { name: { contains: name } },
  include: { clients: true }
})

  return new Response(JSON.stringify(users), { status: 200 })
}
