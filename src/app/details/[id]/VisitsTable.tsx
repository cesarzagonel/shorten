import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

export default function VisitsTable({
  data,
}: {
  data: { key: string; value: number }[];
}) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Country</Th>
            <Th isNumeric>Visits</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => {
            const { key, value } = row;

            return (
              <Tr key={key}>
                <Td>{key || "Unknown"}</Td>
                <Td isNumeric>{value}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
