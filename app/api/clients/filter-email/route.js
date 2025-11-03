import prisma from '../../../../lib/prisma'

export async function GET(req) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')

  if (!email) return new Response(JSON.stringify({ error: 'Email obrigatório' }), { status: 400 })

  const clients = await prisma.client.findMany({
    where: { email: { contains: email } },
    include: { consultant: true }
  })

  return new Response(JSON.stringify(clients), { status: 200 })
}
