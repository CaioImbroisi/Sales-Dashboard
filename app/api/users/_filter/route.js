import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)

    const name = searchParams.get('name') || undefined
    const email = searchParams.get('email') || undefined
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where = {}
    if (name) where.name = { contains: name, mode: 'insensitive' }
    if (email) where.email = { contains: email, mode: 'insensitive' }
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (!isNaN(start) && !isNaN(end)) {
        where.createdAt = { gte: start, lte: end }
      }
    }

    const users = await prisma.user.findMany({
      where,
      include: { clients: true },
    })

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify([]), { status: 200 })
  }
}
