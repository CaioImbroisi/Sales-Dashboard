import prisma from '../../../../lib/prisma.js'

export async function GET(req, { params }) {
  // Garantir ID válido
  let id = Number(params?.id)
  if (!id || isNaN(id)) {
    // fallback: extrair da URL
    const url = new URL(req.url)
    const segments = url.pathname.split('/')
    id = Number(segments[segments.length - 1])
  }

  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { clients: true }
  })

  if (!user) {
    return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), { status: 404 })
  }

  return new Response(JSON.stringify(user), { status: 200 })
}

export async function PUT(req, { params }) {
  let id = Number(params?.id)
  if (!id || isNaN(id)) {
    const url = new URL(req.url)
    const segments = url.pathname.split('/')
    id = Number(segments[segments.length - 1])
  }

  const body = await req.json()
  const { name, email, role } = body

  const updated = await prisma.user.update({
    where: { id },
    data: { name, email, role }
  })

  return new Response(JSON.stringify(updated), { status: 200 })
}

export async function DELETE(req, { params }) {
  let id = Number(params?.id)
  if (!id || isNaN(id)) {
    const url = new URL(req.url)
    const segments = url.pathname.split('/')
    id = Number(segments[segments.length - 1])
  }

  await prisma.user.delete({ where: { id } })
  return new Response(null, { status: 204 })
}