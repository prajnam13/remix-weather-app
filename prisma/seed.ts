import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "ipgautomotive@example.com"; // Use a default email
  const username = "ipgautomotive";
  const password = "carmaker";

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Delete existing user if exists (for re-seeding)
    await prisma.user.deleteMany();

    // Create a new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(`Created user: ${user.username}`);

    // Seed favorite cities (Max: 5)
    const cities = ["New York", "Los Angeles", "London", "Tokyo", "Paris"];
    
    await prisma.city.createMany({
      data: cities.map((city) => ({
        name: city,
        userId: user.id,
      })),
    });

    console.log("Seeded favorite cities:", cities);
    console.log("Database has been seeded successfully! 🌱");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
