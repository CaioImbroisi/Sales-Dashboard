import prisma from '../../../../lib/prisma'

export async function GET(req) {
  const url = new URL(req.url)
  const startDate = url.searchParams.get('startDate')
  const endDate = url.searchParams.get('endDate')

  if (!startDate && !endDate) {
    return new Response(JSON.stringify({ error: 'Informe pelo menos uma data' }), { status: 400 })
  }

  const where = { createdAt: {} }
  if (startDate) where.createdAt.gte = new Date(startDate)
  if (endDate) where.createdAt.lte = new Date(endDate)

  const users = await prisma.user.findMany({
    where,
    include: { clients: true },
    orderBy: { createdAt: 'desc' }
  })

  return new Response(JSON.stringify(users), { status: 200 })
}