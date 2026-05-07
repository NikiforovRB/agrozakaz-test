import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const u = await prisma.user.findUnique({
  where: { email: "nikiforovrb@yandex.ru" },
});

if (!u) {
  console.log("NOT FOUND");
} else {
  console.log("Found:", u.email, u.role, u.name);
  const ok = await bcrypt.compare("1vngbwxcn", u.passwordHash);
  console.log("Password match:", ok);
}

const counts = {
  categories: await prisma.category.count(),
  products: await prisma.product.count(),
  schemas: await prisma.schema.count(),
  markers: await prisma.partMarker.count(),
  users: await prisma.user.count(),
};
console.log("Counts:", counts);

await prisma.$disconnect();
