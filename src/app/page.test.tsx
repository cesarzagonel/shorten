import "@/test/serverTestCase";
import "@testing-library/jest-dom";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { screen } from "@testing-library/react";
import Home from "./page";
import prisma from "@/prisma";
import UrlList from "@/components/UrlList";
import { renderServerComponent } from "@/test/renderServerComponent";
import { cookies } from "next/headers";

jest.mock("../helpers/currentUser");
jest.mock("../components/UrlList");

const client = new QueryClient();

function Wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

it("should render", async () => {
  await renderServerComponent(<Home />, Wrapper);

  expect(screen.getByText("Free")).toBeInTheDocument();
});

it("should render session urls", async () => {
  const session = "session-a";
  cookies().set("session", session);

  const url = await prisma.url.create({
    data: {
      id: "url-a",
      title: "url a",
      url: "localhost",
      session,
    },
    include: {
      _count: {
        select: { visits: true },
      },
    },
  });

  await renderServerComponent(<Home />, Wrapper);

  expect(UrlList).toHaveBeenCalledWith({ urls: [url] }, {});
});
