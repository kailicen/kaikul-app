import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PointSystemModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Understanding the Point System</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb={4}>
          Earn points through various activities to track your progress and
          achieve your goals. Here is how you can earn points:
        </Text>
        <Table variant="simple" size="sm" mb={4}>
          <Thead>
            <Tr>
              <Th>Activity</Th>
              <Th isNumeric>Points</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                Complete a task
                <br />
                <Text as="span" fontSize="sm" color="gray.500">
                  (aligned with goal: +1)
                </Text>
              </Td>
              <Td isNumeric>2</Td>
            </Tr>
            <Tr>
              <Td>Daily reflection</Td>
              <Td isNumeric>2</Td>
            </Tr>
            <Tr>
              <Td>Share daily/weekly progress</Td>
              <Td isNumeric>1</Td>
            </Tr>
            <Tr>
              <Td>Weekly updates</Td>
              <Td isNumeric>
                <Text as="span" fontSize="sm">
                  (7 + RW + RH + PH) / 5
                </Text>
                <br />
                <Text as="span" fontSize="xs" color="gray.500">
                  RW: Rate Week, RH: Rate Happiness, PH: Practice Hours
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td>Complete a goal</Td>
              <Td isNumeric>
                <Text as="span" fontSize="sm">
                  ≤ 30d: 5 | ≤ 3m: 10 | &lt; 1y: 20 | ≥ 1y: 50
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Badge colorScheme="green" variant="solid" mr={1}>
                  New
                </Badge>
                Share profile
              </Td>
              <Td isNumeric>2</Td>
            </Tr>
            <Tr>
              <Td>
                <Badge colorScheme="green" variant="solid" mr={1}>
                  New
                </Badge>
                Weekly theme exercise
              </Td>
              <Td isNumeric>2</Td>
            </Tr>
          </Tbody>
        </Table>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button onClick={onClose}>Start Earning Points</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default PointSystemModal;
