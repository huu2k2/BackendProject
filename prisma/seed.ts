import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt'
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Tạo roles
  const role = await prisma.role.create({
    data: {
      name: 'ADMIN',
    },
  });
  
  const hashedPassword = await bcrypt.hash("123456", 10)
  // Tạo accounts
  for (let i = 0; i < 1; i++) {
    const account = await prisma.account.create({
      data: {
        username: "123456",
        password: hashedPassword,
        roleId: role.roleId,
        isActive: faker.datatype.boolean(),
        profile: {
          create: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            address: "address",
            phoneNumber: faker.phone.number({ style: 'international' }),
            cccd: faker.string.numeric(9),
          },
        },
      },
    });
    console.log(`Created account with ID: ${account.accountId}`);
  }
 
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
