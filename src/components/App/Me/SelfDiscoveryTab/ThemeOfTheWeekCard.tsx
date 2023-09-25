import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  useColorMode,
  UnorderedList,
  ListItem,
  OrderedList,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import { Document } from "@contentful/rich-text-types";
import ThemeContentModal from "@/components/Modal/Me/ThemeContentModal";
import AnswersComponent from "./AnswersComponent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { FaSearchPlus } from "react-icons/fa";

export type Theme = {
  fields: {
    title: string;
    date: string;
    long_question: string;
    content: Document;
  };
  sys: {
    id: string;
  };
};

type Props = {
  post: Theme;
};

const ThemeOfTheWeekCard: React.FC<Props> = ({ post }) => {
  const [user, loading] = useAuthState(auth);
  const { title, date, content, long_question } = post.fields;
  const [isContentModalOpen, setContentModalOpen] = useState(false);
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <Text my={4}>{children}</Text>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <UnorderedList>{children}</UnorderedList>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <OrderedList>{children}</OrderedList>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <ListItem>{children}</ListItem>
      ),
    },
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: any) => <em>{text}</em>,
    },
  };

  return (
    <VStack
      gap={4}
      boxShadow="lg"
      py={6}
      px={{ base: 3, md: 6 }}
      rounded="md"
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      w="full"
      bg={colorMode === "light" ? "white" : "gray.800"}
      alignItems="flex-start"
    >
      <Flex justifyContent="space-between" w="100%">
        <Text fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
        {isMobile ? (
          <IconButton
            aria-label="Me"
            icon={<FaSearchPlus />}
            onClick={() => setContentModalOpen(true)}
            borderRadius="full"
            size="sm"
            variant="outline"
          />
        ) : (
          <Button
            rightIcon={<FaSearchPlus />}
            onClick={() => setContentModalOpen(true)}
            size="sm"
            variant="outline"
          >
            View More
          </Button>
        )}
      </Flex>
      {isContentModalOpen && (
        <ThemeContentModal
          isOpen={isContentModalOpen}
          onClose={() => setContentModalOpen(false)}
          content={content}
          title={title}
          options={options}
        />
      )}

      <Text fontSize="sm" color="gray.500">
        {new Date(date).toLocaleDateString()}
      </Text>
      <Box>{long_question}</Box>
      {!loading && (
        <AnswersComponent user={user} theme={title} question={long_question} />
      )}
    </VStack>
  );
};

export default ThemeOfTheWeekCard;
