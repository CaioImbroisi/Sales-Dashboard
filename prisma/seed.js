import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const c1 = await prisma.user.create({
    data: { name: 'Maria Silva', email: 'maria@empresa.com', role: 'CONSULTANT' }
  })
  const c2 = await prisma.user.create({
    data: { name: 'Alberto Souza', email: 'alberto@empresa.com', role: 'CONSULTANT' }
  })
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@empresa.com', role: 'ADMIN' }
  })

  const clients = [
    { name: 'Cliente A', email: 'clienteA@mail.com', phone: '1111-1111', cpf: '123.456.789-00', age: 30, address: 'Rua A, 123', consultantId: c1.id, status: 'active' },
    { name: 'Cliente B', email: 'clienteB@mail.com', phone: '2222-2222', cpf: '234.567.890-11', age: 25, address: 'Rua B, 456', consultantId: c1.id, status: 'lead' },
    { name: 'Cliente C', email: 'clienteC@mail.com', phone: '3333-3333', cpf: '345.678.901-22', age: 40, address: 'Rua C, 789', consultantId: c2.id, status: 'active' },
    { name: 'Cliente D', email: 'clienteD@mail.com', phone: '4444-4444', cpf: '456.789.012-33', age: 35, address: 'Rua D, 101', consultantId: c2.id, status: 'lead' }
  ]

  for (const client of clients) {
    await prisma.client.create({ data: client })
  }

  console.log('Seed finished')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
