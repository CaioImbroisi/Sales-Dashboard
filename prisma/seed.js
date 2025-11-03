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

  await prisma.client.createMany({
    data: [
      { name: 'Cliente A', email: 'clienteA@mail.com', phone: '1111-1111', consultantId: c1.id, status: 'active' },
      { name: 'Cliente B', email: 'clienteB@mail.com', phone: '2222-2222', consultantId: c1.id, status: 'lead' },
      { name: 'Cliente C', email: 'clienteC@mail.com', phone: '3333-3333', consultantId: c2.id, status: 'active' },
      { name: 'Cliente D', email: 'clienteD@mail.com', phone: '4444-4444', consultantId: c2.id, status: 'lead' }
    ]
  })

  console.log('Seed finished');
}
main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
