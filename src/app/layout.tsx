import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Box, Container } from "@chakra-ui/react";
import currentUser from "@/helpers/currentUser";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shortim",
  description: "Shorten URLs for free",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Box display={"flex"} flexDirection={"column"} h={"100vh"}>
            <Navbar user={user} />

            <Box
              display={"flex"}
              flexDir={"column"}
              flexGrow={1}
              overflowX={"auto"}
            >
              <Container
                maxW={"5xl"}
                display={"flex"}
                flexGrow={1}
                flexDirection={"column"}
              >
                {children}
              </Container>

              <Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  h={"50px"}
                  borderTop={"solid 1px"}
                  borderColor={"gray.200"}
                >
                  <Box>
                    Built with{" "}
                    <a href="https://chakra-ui.com/" target="_blank">
                      Chakra UI
                    </a>{" "}
                    and{" "}
                    <a href="https://chakra-templates.dev/" target="_blank">
                      chakra-templates.dev
                    </a>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
