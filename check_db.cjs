const { PrismaClient } = require('./node_modules/.bun/@prisma+client@5.22.0+f01948e2630c7aba/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const cities = await prisma.city.count();
    const categories = await prisma.category.count();
    const services = await prisma.service.count();
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
    const providers = await prisma.user.count({ where: { role: 'PROVIDER' } });
    
    console.log(`Cities: ${cities}`);
    console.log(`Categories: ${categories}`);
    console.log(`Services: ${services}`);
    console.log(`Admins: ${admins}`);
    console.log(`Providers: ${providers}`);
  } catch (error) {
    console.error("DB Query Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
