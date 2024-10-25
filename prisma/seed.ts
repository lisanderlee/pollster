import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const campaigns = [
    { name: "TechCorp", description: "Innovative software solutions", image: "/placeholder.svg?height=100&width=100" },
    { name: "GreenEnergy", description: "Sustainable energy technologies", image: "/placeholder.svg?height=100&width=100" },
    { name: "HealthPlus", description: "Advanced healthcare services", image: "/placeholder.svg?height=100&width=100" },
    { name: "EduLearn", description: "Online education platform", image: "/placeholder.svg?height=100&width=100" },
    { name: "FinanceWise", description: "Smart financial management", image: "/placeholder.svg?height=100&width=100" },
    { name: "FoodDelight", description: "Gourmet food delivery", image: "/placeholder.svg?height=100&width=100" }
  ]

  for (const campaign of campaigns) {
    await prisma.campaign.create({
      data: campaign,
    })
  }

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })