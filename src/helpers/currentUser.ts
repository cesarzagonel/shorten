import prisma from "@/prisma";
import { cookies } from "next/headers";

export default async function currentUser() {
  const token = cookies().get("token");

  if (!token) return;

  return await prisma.user.findFirst({
    where: { token: token.value },
  });
}
