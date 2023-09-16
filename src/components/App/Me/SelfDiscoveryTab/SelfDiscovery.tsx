import { Text, VStack, Grid, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { UserProfileAddition } from "@/atoms/userProfileAdditionAtom";
import { InfoIcon } from "@chakra-ui/icons";
import SelfDiscoveryModal from "@/components/Modal/Instructions/SelfDiscoveryModal";
import SelfDiscoveryCard from "./SelfDiscoveryCard";
import ThemeOfTheWeekCard, { Theme } from "./ThemeOfTheWeekCard";
import OtherThemeCards from "./OtherThemeCards";

type Props = {
  profileAddition: UserProfileAddition;
  onEdit: (updatedProfileAddition: UserProfileAddition) => void;
  posts: Theme[];
};

function SelfDiscovery({ profileAddition, onEdit, posts }: Props) {
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleInstructionOpen = () => {
    setIsInstructionOpen(true);
  };

  const handleInstructionClose = () => {
    setIsInstructionOpen(false);
  };

  const uniqueThemes = Array.from(
    new Set(posts.map((post) => post.fields.title))
  );

  const filteredPosts = selectedTheme
    ? posts.filter((post) => post.fields.title === selectedTheme)
    : posts;

  return (
    <VStack width="100%">
      <Text fontWeight="bold" fontSize="lg" mb="2">
        Weekly Theme Exercise{" "}
        <InfoIcon
          color="purple.500"
          onClick={handleInstructionOpen}
          mb={1}
          cursor="pointer"
        />
      </Text>

      {/* Use the modal component here */}
      <SelfDiscoveryModal
        isOpen={isInstructionOpen}
        onClose={handleInstructionClose}
      />

      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={4}
        width="100%"
      >
        <VStack alignItems="flex-start">
          <Select
            placeholder="Select theme"
            onChange={(e) => setSelectedTheme(e.target.value)}
            borderRadius="full"
            w="auto"
          >
            {uniqueThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </Select>
          {/* First Post into ThemeOfTheWeekCard */}
          {filteredPosts.map((post: Theme) => (
            <ThemeOfTheWeekCard key={post.sys.id} post={post} />
          ))}
        </VStack>

        {/* SelfDiscoveryCard on the right */}
        <VStack gap={2}>
          <SelfDiscoveryCard
            profileAddition={profileAddition}
            onEdit={onEdit}
          />
        </VStack>
      </Grid>
    </VStack>
  );
}

export default SelfDiscovery;
