import { Text, VStack, Grid, Select, Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { UserProfileAddition } from "@/atoms/userProfileAdditionAtom";
import { InfoIcon } from "@chakra-ui/icons";
import SelfDiscoveryModal from "@/components/Modal/Instructions/SelfDiscoveryModal";
import SelfDiscoveryCard from "./SelfDiscoveryCard";
import ThemeOfTheWeekCard, { Theme } from "./ThemeOfTheWeekCard";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // You can adjust this number as needed

  // Calculating the index of the first and last post of the current page
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;

  // Slice the posts array to get only the posts for the current page
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate the total number of pages
  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < pageCount ? prev + 1 : prev));
  };

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
        <VStack alignItems="flex-start" gap={4}>
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
          {/* Paginated Posts */}
          {currentPosts.map((post: Theme) => (
            <ThemeOfTheWeekCard key={post.sys.id} post={post} />
          ))}
          {/* Pagination Controls */}
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap={2}
            mt={5}
          >
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
              Prev
            </Button>
            <Text>Page: {currentPage}</Text>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </Box>
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
