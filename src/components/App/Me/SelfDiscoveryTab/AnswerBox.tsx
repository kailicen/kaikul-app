import { Reaction, WeeklyAnswer } from "@/atoms/weeklyAnswersAtom";
import {
  Avatar,
  Box,
  Button,
  useColorMode,
  Text,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { LuSmilePlus } from "react-icons/lu";

type AnswerBoxProps = {
  answer: WeeklyAnswer;
  isUserAnswer: boolean;
  onEdit?: () => void;
  onAddReaction: (emoji: string) => void;
  // ... (any other props needed for reactions)
};

export const AnswerBox = ({
  answer,
  isUserAnswer,
  onEdit,
  onAddReaction,
}: // ... (any other props)
AnswerBoxProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      display="flex"
      alignItems="flex-start"
      bg={colorMode === "light" ? "gray.50" : "gray.700"}
      w="100%"
    >
      <Avatar
        src={answer.photoURL || undefined}
        name={answer.displayName || "Anonymous"}
        size="sm"
        mr={4}
      />
      <Box>
        <Text fontSize="sm" color="gray.500">
          {answer.displayName || "Anonymous"}
        </Text>
        <Text>{answer.answer}</Text>

        {/* Add a section here to display reactions and add new reactions */}
        <Flex mt={2} direction="row" alignItems="center" gap={1} wrap="wrap">
          <Popover>
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <IconButton
                    aria-label="Share"
                    icon={<LuSmilePlus />}
                    variant="outline"
                    size="sm"
                    borderRadius="full"
                    bg={colorMode === "light" ? "gray.200" : "gray.700"}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody display="flex" gap={1}>
                    {["👍", "❤️", "🤔", "👏", "😊", "💡", "🙏"].map((emoji) => (
                      <Button
                        key={emoji}
                        size="md"
                        variant="ghost"
                        onClick={() => {
                          onAddReaction(emoji);
                          onClose(); // Use onClose here
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </PopoverBody>
                </PopoverContent>
              </>
            )}
          </Popover>

          <Flex direction="row" gap={1} wrap="wrap">
            {Object.entries(
              answer.reactions?.reduce<Record<string, Reaction[]>>(
                (acc, reaction) => {
                  if (!acc[reaction.emoji]) {
                    acc[reaction.emoji] = [];
                  }
                  acc[reaction.emoji].push(reaction);
                  return acc;
                },
                {}
              ) || {}
            ).map(([emoji, reactionGroup]) => (
              <Box key={emoji}>
                <Popover placement="top">
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      bg={colorMode === "light" ? "gray.200" : "gray.700"}
                    >
                      {emoji} {reactionGroup.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    bgColor={colorMode === "light" ? "gray.50" : "gray.800"}
                  >
                    <Text p={3}>
                      {reactionGroup
                        .map(
                          (reaction) =>
                            reaction.userDetails?.displayName ||
                            reaction.userDetails?.email?.split("@")[0] ||
                            "Anonymous"
                        )
                        .join(", ")}{" "}
                      reacted with {emoji}
                    </Text>
                  </PopoverContent>
                </Popover>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>
      {isUserAnswer && onEdit && (
        <Button size="sm" ml="2" onClick={onEdit}>
          Edit
        </Button>
      )}
    </Box>
  );
};
