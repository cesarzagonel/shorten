import "core-js/actual/set-immediate";
import { otpRequest } from "./otpRequest";

jest.mock("../services/mailer");

it("should request otp", async () => {
  await otpRequest("test@mail.com");
});
