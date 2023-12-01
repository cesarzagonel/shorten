import { Box, Container as ChakraContainer } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Container({
  children,
  darkBackground,
}: {
  children: ReactNode;
  darkBackground?: boolean;
}) {
  return (
    <Box
      display={"flex"}
      flexGrow={1}
      backgroundColor={darkBackground ? "gray.100" : undefined}
    >
      <ChakraContainer
        maxW={"5xl"}
        flexDirection={"column"}
        display={"flex"}
        flexGrow={1}
      >
        {children}
      </ChakraContainer>
    </Box>
  );
}
