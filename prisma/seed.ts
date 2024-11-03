import { PrismaClient, TableStatus, OrderStatus, NotificationStatus, TableDetailStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.orderMerge.deleteMany(),
    prisma.tableDetail.deleteMany(),
    prisma.orderDetail.deleteMany(),
    prisma.order.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.table.deleteMany(),
    prisma.area.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.account.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  // Create Roles
  const roles = await prisma.role.createMany({
    data: [
      { name: 'ADMIN' },
      { name: 'MANAGER' },
      { name: 'STAFF' },
      { name: 'CASHIER' }
    ]
  });

  const roleIds = await prisma.role.findMany().then(roles => roles.map(r => r.roleId));

  // Create 30 Accounts with Profiles
  for (let i = 0; i < 30; i++) {
    const account = await prisma.account.create({
      data: {
        username: faker.internet.userName(),
        password: await bcrypt.hash('password123', 10),
        roleId: roleIds[Math.floor(Math.random() * roleIds.length)],
        profile: {
          create: {
            fullName: faker.person.fullName(),
            address: faker.location.streetAddress(),
            phoneNumber:  `+84${faker.string.numeric(9)}`,  
            cccd: faker.number.int({ min: 100000000000, max: 999999999999 }).toString(),
          }
        }
      }
    });
  }

  // Create 30 Categories
  const categories = await Promise.all(
    Array(30).fill(null).map(() =>
      prisma.category.create({
        data: {
          name: faker.commerce.department()
        }
      })
    )
  );

  // Create 30 Products
  for (let i = 0; i < 30; i++) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: "https://res.cloudinary.com/duoqtvvff/image/upload/v1722355413/upload_image/wtlgef0wdfl5j8zkntjd.jpg",
        imagePublicId: "upload_image/wtlgef0wdfl5j8zkntjd",
        price: parseFloat(faker.commerce.price()),
        categoryId: categories[Math.floor(Math.random() * categories.length)].categoryId
      }
    });
  }

  // Create 30 Areas
  const areas = await Promise.all(
    Array(30).fill(null).map((_, index) =>
      prisma.area.create({
        data: {
          name: `Area ${index + 1}`,
          code: `A${(index + 1).toString().padStart(2, '0')}`
        }
      })
    )
  );

  // Create 30 Tables
  const tables = await Promise.all(
    Array(30).fill(null).map((_, index) =>
      prisma.table.create({
        data: {
          name: `Table ${index + 1}`,
          status: faker.helpers.arrayElement(Object.values(TableStatus)),
          areaId: areas[Math.floor(Math.random() * areas.length)].areaId,
          startTime: faker.date.past(),
          endTime: faker.date.future()
        }
      })
    )
  );

  // Create 30 Customers
  const customers = await Promise.all(
    Array(30).fill(null).map(() =>
      prisma.customer.create({
        data: {
          name: faker.person.fullName(),
          phoneNumber: `+84${faker.string.numeric(9)}` // Vietnamese format, same as profiles
        }
      })
    )
  );

  // Create 30 Orders with OrderDetails, TableDetails, and Payments
  const products = await prisma.product.findMany();
  
  for (let i = 0; i < 30; i++) {
    const order = await prisma.order.create({
      data: {
        customerId: customers[Math.floor(Math.random() * customers.length)].customerId,
        status: faker.helpers.arrayElement(Object.values(OrderStatus)),
        totalAmount: faker.number.float({ min: 100000, max: 1000000 }),
        orderDetails: {
          create: Array(3).fill(null).map(() => {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = faker.number.int({ min: 1, max: 5 });
            return {
              productId: product.productId,
              quantity: quantity,
              total: product.price * quantity
            };
          })
        },
        tableDetails: {
          create: {
            tableId: tables[Math.floor(Math.random() * tables.length)].tableId,
            status: faker.helpers.arrayElement(Object.values(TableDetailStatus)),
            startTime: faker.date.past(),
            endTime: faker.date.future()
          }
        },
        payments: {
          create: {
            amount: faker.number.float({ min: 100000, max: 1000000 }),
            method: faker.helpers.arrayElement(['CASH', 'CARD', 'MOMO'])
          }
        },
        orderMerges: {
          create: {
            createdAt: faker.date.past()
          }
        }
      }
    });
  }

  // Create 30 Notifications
  const accounts = await prisma.account.findMany();
  
  await Promise.all(
    Array(30).fill(null).map(() =>
      prisma.notification.create({
        data: {
          content: faker.lorem.sentence(),
          status: faker.helpers.arrayElement(Object.values(NotificationStatus)),
          accountId: accounts[Math.floor(Math.random() * accounts.length)].accountId
        }
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });