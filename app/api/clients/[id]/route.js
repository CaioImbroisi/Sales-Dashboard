import prisma from '../../../../lib/prisma.js'

function getId(params, req) {
  let id = Number(params?.id)
  if (!id || isNaN(id)) {
    const url = new URL(req.url)
    const segments = url.pathname.split('/')
    id = Number(segments[segments.length - 1])
  }
  return id
}

export async function GET(req, { params }) {
  const id = getId(params, req)
  if (!id) return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 })

  const client = await prisma.client.findUnique({
    where: { id },
    include: { consultant: true }
  })

  if (!client) return new Response(JSON.stringify({ error: 'Cliente não encontrado' }), { status: 404 })

  return new Response(JSON.stringify(client), { status: 200 })
}

export async function PUT(req, { params }) {
  const id = getId(params, req)
  const body = await req.json()
  const { name, email, phone, status, consultantId } = body

  const updated = await prisma.client.update({
    where: { id },
    data: { name, email, phone, status, consultantId }
  })

  return new Response(JSON.stringify(updated), { status: 200 })
}

export async function DELETE(req, { params }) {
  const id = getId(params, req)

  await prisma.client.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
