import React, { useState } from "react";
import { Box, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import { Document } from "@contentful/rich-text-types";
import ThemeContentModal from "@/components/Modal/Me/ThemeContentModal";
import { ViewIcon } from "@chakra-ui/icons";
import AnswersComponent from "./AnswersComponent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

export type Theme = {
  fields: {
    title: string;
    date: string;
    question: string;
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
  const { title, date, content, question } = post.fields;
  const [isContentModalOpen, setContentModalOpen] = useState(false);

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <Text my={4}>{children}</Text>
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
      borderColor="gray.200"
      w="full"
    >
      <Flex
        justifyContent="center"
        w="100%"
        alignItems="center"
        position="relative"
      >
        <Text fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
        <Button
          rightIcon={<ViewIcon />}
          onClick={() => setContentModalOpen(true)}
          size="sm"
          variant="outline"
          position="absolute"
          right={0}
        >
          View More
        </Button>
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
      <Box>{question}</Box>
      {!loading && (
        <AnswersComponent user={user} theme={title} question={question} />
      )}
    </VStack>
  );
};

export default ThemeOfTheWeekCard;
