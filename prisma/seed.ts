import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ethara.ai' },
    update: {},
    create: {
      email: 'admin@ethara.ai',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const memberHashedPassword = await bcrypt.hash('member123', 10)
  
  const member = await prisma.user.upsert({
    where: { email: 'member@ethara.ai' },
    update: {},
    create: {
      email: 'member@ethara.ai',
      name: 'Member User',
      password: memberHashedPassword,
      role: 'MEMBER',
    },
  })

  console.log('Seed data created:')
  console.log('Admin:', admin.email, 'password: admin123')
  console.log('Member:', member.email, 'password: member123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
