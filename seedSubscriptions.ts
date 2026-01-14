import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import { connectToDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { cookies } from 'next/headers';

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await connectToDB();
    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    const user = await User.findById(userId)

    const startDate = new Date();
    const currentDate = new Date();

    // 30 days subcription
    const endDate = currentDate.setDate(currentDate.getDate() + 30);


    // 2. Generate an array of fake users
    for (let i = 0; i < 50; i++) {
      user.subcriptions?.facebook.push({
        page: {
          id: faker.number.bigInt(),
          name: faker.person.fullName(),
        },
        startDate: startDate,
        endDate: endDate,
        status: "pending",
        isPaid: false
      });
      user.subcriptions?.instagram.push({
        user: {
          id: faker.string.uuid(),
          username: faker.person.fullName(),
        },
        startDate: new Date(),
        endDate: new Date(),
        status: "pending",
        isPaid: false
      });
    }

    // 3. Insert into the database
    await user.save()

  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();