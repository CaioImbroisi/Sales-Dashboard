import prisma from '../../../../lib/prisma'

export async function GET(req) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email obrigatório' }), { status: 400 })
  }

  const users = await prisma.user.findMany({
    where: { email: { contains: email, mode: 'insensitive' } },
    include: { clients: true }
  })

  return new Response(JSON.stringify(users), { status: 200 })
}