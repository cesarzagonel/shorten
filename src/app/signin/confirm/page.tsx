import ConfirmForm from "./ConfirmForm";

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
