import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export default function sessionId(): string {
  return (
    cookies().get("session")?.value ||
    cookies().set("session", nanoid(64)).get("session")!.value
  );
}
