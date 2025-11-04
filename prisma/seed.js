import pkg from '@prisma/client'
import { faker } from '@faker-js/faker/locale/pt_BR'

const { PrismaClient } = pkg
const prisma = new PrismaClient()

function makeEmailFromName(nome) {
  const clean = nome
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")

  const first = clean[0]
  const last = clean[clean.length - 1]
  const num = faker.number.int({ min: 1, max: 9999 })

  return `${first}.${last}${num}@mail.com`
}

async function main() {
  console.log('🧹 Limpando banco...')
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  console.log('👑 Criando admin...')
  await prisma.user.create({
    data: {
      nome: 'Admin Master',
      email: 'admin@system.com',
      telefone: faker.phone.number('(##) #####-####'),
      cpf: faker.string.numeric(11),
      idade: 30,
      tipoUsuario: 'ADMIN',
      cep: faker.location.zipCode(),
      estado: faker.location.state(),
      endereco: faker.location.streetAddress(),
      complemento: 'Sala 1',
    },
  })

  console.log('🧑‍💼 Criando consultores...')
  const consultores = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      const nome = faker.person.fullName()
      const email = makeEmailFromName(nome)

      return prisma.user.create({
        data: {
          nome,
          email,
          telefone: faker.phone.number('(##) #####-####'),
          cpf: faker.string.numeric(11),
          idade: faker.number.int({ min: 20, max: 50 }),
          tipoUsuario: 'CONSULTOR',
          cep: faker.location.zipCode(),
          estado: faker.location.state(),
          endereco: faker.location.streetAddress(),
          complemento: faker.location.secondaryAddress(),
        },
      })
    })
  )

  console.log('👥 Criando clientes...')
  await Promise.all(
    Array.from({ length: 100 }).map(() => {
      const nome = faker.person.fullName()
      const email = makeEmailFromName(nome)
      const randomConsultor = faker.helpers.arrayElement(consultores)

      return prisma.client.create({
        data: {
          name: nome,
          email,
          phone: faker.phone.number('(##) #####-####'),
          cpf: faker.string.numeric(11),
          age: faker.number.int({ min: 18, max: 80 }),
          address: faker.location.streetAddress(),
          status: faker.helpers.arrayElement(['Ativo', 'Inativo']),
          consultantId: randomConsultor.id,
        },
      })
    })
  )

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(err => {
    console.error(err)
    prisma.$disconnect()
    process.exit(1)
  })
