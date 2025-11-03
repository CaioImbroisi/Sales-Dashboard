import prisma from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany({
    include: { clients: true }
  })

  return new Response(JSON.stringify(users), { status: 200 })
}

export async function POST(req) {
  const body = await req.json()
  const { name, email, role } = body

  if (!name || !email || !role) {
    return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 })
  }

  const newUser = await prisma.user.create({
    data: { name, email, role }
  })

  return new Response(JSON.stringify(newUser), { status: 201 })
}