const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Students (Institutional Simulation)...');

  const students = [
    { controlNumber: '2021001', name: 'Juan Perez', group: '601-A' },
    { controlNumber: '2021002', name: 'Maria Garcia', group: '601-B' },
    { controlNumber: '2021003', name: 'Carlos Rodriguez', group: '602-A' },
    { controlNumber: '2021004', name: 'Ana Martinez', group: '602-B' },
    { controlNumber: '2021005', name: 'Luis Hernandez', group: '603-A' },
  ];

  for (const student of students) {
    await prisma.student.upsert({
      where: { controlNumber: student.controlNumber },
      update: {},
      create: student,
    });
  }

  console.log('✅ Students Seeded');

  console.log('🌱 Seeding Initial Dishes...');
  const dishes = [
    { name: 'Ensalada Cesar', calories: 350, protein: 15, carbs: 20, fat: 22, price: 45, category: 'Ensaladas' },
    { name: 'Pechuga a la Plancha', calories: 450, protein: 35, carbs: 10, fat: 12, price: 65, category: 'Platos Fuertes' },
    { name: 'Torta de Jamón', calories: 550, protein: 20, carbs: 50, fat: 25, price: 35, category: 'Snacks' },
  ];

  for (const dish of dishes) {
    await prisma.dish.create({ data: dish });
  }

  console.log('✅ Dishes Seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
