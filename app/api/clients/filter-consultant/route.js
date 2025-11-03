import prisma from '../../../../lib/prisma'

export async function GET(req) {
  const url = new URL(req.url)
  const consultantId = Number(url.searchParams.get('consultantId'))

  if (!consultantId || isNaN(consultantId)) {
    return new Response(JSON.stringify({ error: 'consultantId inválido' }), { status: 400 })
  }

  const clients = await prisma.client.findMany({
    where: { consultantId },
    include: { consultant: true }
  })

  return new Response(JSON.stringify(clients), { status: 200 })
}
