import prisma from '../../../lib/prisma.js'

export async function GET() {
  const clients = await prisma.client.findMany({
    include: { consultant: true } // inclui o consultor relacionado
  })

  return new Response(JSON.stringify(clients), { status: 200 })
}

export async function POST(req) {
  const body = await req.json()
  const { name, email, phone, status, consultantId } = body

  if (!name || !email || !phone || !status || !consultantId) {
    return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 })
  }

  const newClient = await prisma.client.create({
    data: { name, email, phone, status, consultantId }
  })

  return new Response(JSON.stringify(newClient), { status: 201 })
}
