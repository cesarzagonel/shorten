import prisma from "@/prisma";

beforeEach(async () => {
  await prisma.$transaction([
    prisma.url.deleteMany(),
    prisma.otp.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});
