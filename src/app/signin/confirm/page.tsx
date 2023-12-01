import ConfirmForm from "./ConfirmForm";
import prisma from "@/prisma";

export default async function Confirm({
  searchParams: { id },
}: {
  searchParams: { id: string };
}) {
  const otp = await prisma.otp.findFirstOrThrow({
    where: { id },
    include: { user: true },
  });

  return <ConfirmForm id={otp.id} email={otp.user.email} />;
}
