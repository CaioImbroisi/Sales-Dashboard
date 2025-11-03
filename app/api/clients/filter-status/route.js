import prisma from '../../../../lib/prisma'

export async function GET(req) {
  const url = new URL(req.url)
  const status = url.searchParams.get('status')

  if (!status) return new Response(JSON.stringify({ error: 'Status obrigatório' }), { status: 400 })

  const clients = await prisma.client.findMany({
    where: { status },
    include: { consultant: true }
  })

  return new Response(JSON.stringify(clients), { status: 200 })
}
