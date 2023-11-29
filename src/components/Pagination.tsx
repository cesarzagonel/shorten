import { Button, HStack } from "@chakra-ui/react";
import Link from "next/link";

export default function Pagination({
  pages,
  currentPage,
}: {
  pages: number;
  currentPage: number;
}) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  let pageLow = currentPage - 3;
  pageLow = pageLow + 5 >= pages ? pages - 5 : pageLow;
  pageLow = pageLow < 0 ? 0 : pageLow;

  if (pages < 2) return <></>;

  return (
    <HStack
      mt={4}
      mb={4}
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
    >
      <Button
        as={currentPage == 1 ? undefined : Link}
        href={currentPage == 1 ? undefined : `/`}
        colorScheme="teal"
        variant={currentPage == 1 ? undefined : "outline"}
      >
        &lt; &lt;
      </Button>

      <Button
        as={currentPage == 1 ? undefined : Link}
        href={currentPage == 1 ? undefined : `/?page=${prevPage}`}
        colorScheme="teal"
        variant={currentPage == 1 ? undefined : "outline"}
      >
        &lt;
      </Button>

      {Array(pages > 5 ? 5 : pages)
        .fill(1)
        .map((_, index) => {
          const page = pageLow + index;

          return (
            <Button
              key={page}
              as={Link}
              href={page == 0 ? "/" : `/?page=${page + 1}`}
              colorScheme="teal"
              variant={page + 1 == currentPage ? undefined : "outline"}
            >
              {page + 1}
            </Button>
          );
        })}

      <Button
        as={currentPage == pages ? undefined : Link}
        href={currentPage == pages ? undefined : `/?page=${nextPage}`}
        colorScheme="teal"
        variant={currentPage == pages ? undefined : "outline"}
      >
        &gt;
      </Button>
      <Button
        as={currentPage == pages ? undefined : Link}
        href={currentPage == pages ? undefined : `/?page=${pages}`}
        colorScheme="teal"
        variant={currentPage == pages ? undefined : "outline"}
      >
        &gt;&gt;
      </Button>
    </HStack>
  );
}
