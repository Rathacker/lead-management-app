import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_USER_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Seeded user: ${email} / ${password}`);

  const count = await prisma.lead.count();
  if (count === 0) {
    await prisma.lead.createMany({
      data: [
        {
          name: "Ava Thompson",
          company: "Northwind Traders",
          email: "ava@northwind.com",
          phone: "555-0101",
          source: "Website Form",
          status: "NEW",
          notes: "Requested a demo.",
        },
        {
          name: "Liam Chen",
          company: "Globex Corp",
          email: "liam@globex.com",
          phone: "555-0102",
          source: "Referral",
          status: "CONTACTED",
          notes: "Follow up next week.",
        },
        {
          name: "Sofia Martinez",
          company: "Initech",
          email: "sofia@initech.com",
          phone: "555-0103",
          source: "LinkedIn",
          status: "QUALIFIED",
          notes: "Budget confirmed.",
        },
        {
          name: "Noah Patel",
          company: "Umbrella Inc",
          email: "noah@umbrella.com",
          phone: "555-0104",
          source: "Website Form",
          status: "WON",
          notes: "Signed contract.",
        },
        {
          name: "Emma Wilson",
          company: "Hooli",
          email: "emma@hooli.com",
          phone: "555-0105",
          source: "Cold Call",
          status: "LOST",
          notes: "Went with a competitor.",
        },
        {
          name: "Olivia Brooks",
          company: "Stark Industries",
          email: "olivia@stark.com",
          phone: "555-0106",
          source: "Referral",
          status: "NEW",
          notes: "",
        },
        {
          name: "Mason Reed",
          company: "Wayne Enterprises",
          email: "mason@wayne.com",
          phone: "555-0107",
          source: "Event",
          status: "CONTACTED",
          notes: "Met at SaaSConf.",
        },
        {
          name: "Isabella Cruz",
          company: "Soylent Corp",
          email: "isabella@soylent.com",
          phone: "555-0108",
          source: "LinkedIn",
          status: "QUALIFIED",
          notes: "Sent proposal.",
        },
        {
          name: "Ethan Ward",
          company: "Acme Co",
          email: "ethan@acme.com",
          phone: "555-0109",
          source: "Website Form",
          status: "NEW",
          notes: "",
        },
        {
          name: "Mia Foster",
          company: "Cyberdyne Systems",
          email: "mia@cyberdyne.com",
          phone: "555-0110",
          source: "Cold Call",
          status: "WON",
          notes: "Upsell opportunity.",
        },
      ],
    });
    console.log("Seeded 10 sample leads.");
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
