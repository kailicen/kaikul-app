import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  FormLabel,
  Textarea,
  Tag,
  TagLabel,
  Box,
  FormControl,
  DrawerCloseButton,
  DrawerFooter,
  Button,
  TagCloseButton,
  Heading,
  OrderedList,
  ListItem,
  UnorderedList,
  Text,
  List,
  Link,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { UserProfileAddition } from "@/atoms/userProfileAdditionAtom";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profileAddition: UserProfileAddition;
  onSubmit: (updatedProfile: UserProfileAddition) => void;
  inputType: string;
};

function EditSelfDiscoveryDrawer({
  isOpen,
  onClose,
  profileAddition,
  onSubmit,
  inputType,
}: Props) {
  const [currentValue, setCurrentValue] = useState<string>("");
  const [currentStrength, setCurrentStrength] = useState<string>("");

  const getHeaderTitle = (inputType: string) => {
    switch (inputType) {
      case "values":
        return "Discovering Your Core Values";
      case "strengths":
        return "Discovering Your Strengths";
      case "accountabilityMethods":
        return "Understanding Accountability";
      case "roleModels":
        return "Recognizing Role Models";
      case "personalGrowthInvestments":
        return "Investing in Personal Growth";
      default:
        return "Exercise"; // This can be your default value if required
    }
  };

  const handleAddValue = () => {
    if (currentValue.trim()) {
      formik.setFieldValue("values", [
        ...formik.values.values,
        currentValue.trim(),
      ]);
      setCurrentValue("");
    }
  };
  const handleAddStrength = () => {
    if (currentStrength.trim()) {
      formik.setFieldValue("strengths", [
        ...formik.values.strengths,
        currentStrength.trim(),
      ]);
      setCurrentStrength("");
    }
  };

  const formik = useFormik({
    initialValues: profileAddition,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{getHeaderTitle(inputType)}</DrawerHeader>

          <DrawerBody>
            <form onSubmit={formik.handleSubmit}>
              {inputType === "values" && (
                <>
                  <Box mb={4}>
                    <Text mt={2}>
                      Core values shape our actions and define what&apos;s
                      meaningful to us. Dive deeper and reflect on what truly
                      resonates with you.
                    </Text>

                    <Heading size="sm" mt={4}>
                      Quick Exercise:
                    </Heading>
                    <Text mt={2}>
                      Think about moments when you felt truly happy or proud.
                      Consider:
                    </Text>
                    <UnorderedList mt={2}>
                      <ListItem>What was happening?</ListItem>
                      <ListItem>Who were you with?</ListItem>
                      <ListItem>Why did it matter?</ListItem>
                    </UnorderedList>

                    <Heading size="sm" mt={4}>
                      Learn More:
                    </Heading>
                    <List mt={2} styleType="none">
                      <ListItem>
                        <Link
                          href="https://brenebrown.com/resources/dare-to-lead-list-of-values/"
                          isExternal
                          color="purple.700"
                          fontWeight="semibold"
                        >
                          Brené Brown&apos;s Core Values{" "}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link
                          href="https://jamesclear.com/core-values"
                          isExternal
                          color="purple.700"
                          fontWeight="semibold"
                        >
                          James Clear&apos;s Core Values List{" "}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link
                          href="https://simonsinek.com/find-your-why/"
                          isExternal
                          color="purple.700"
                          fontWeight="semibold"
                        >
                          Simon Sinek&apos;s &quot;Find Your Why&quot;{" "}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </ListItem>
                    </List>
                  </Box>

                  {/* Values Input Section */}
                  <FormLabel>
                    <Heading size="sm" pt={4}>
                      Add Your Values
                    </Heading>
                  </FormLabel>
                  <Box display="flex" flexWrap="wrap" alignItems="center">
                    {formik.values.values.map((value, index) => (
                      <Tag
                        key={index}
                        m={1}
                        variant="solid"
                        colorScheme="purple"
                        size="lg"
                      >
                        <TagLabel>{value}</TagLabel>
                        <TagCloseButton
                          onClick={() => {
                            const newValues = [...formik.values.values];
                            newValues.splice(index, 1);
                            formik.setFieldValue("values", newValues);
                          }}
                        />
                      </Tag>
                    ))}
                    <Input
                      placeholder="Enter a value, e.g., Consciousness"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddValue();
                        }
                      }}
                      my={3}
                    />
                    <Button onClick={handleAddValue} variant="outline">
                      Add
                    </Button>
                  </Box>
                </>
              )}

              {inputType === "strengths" && (
                <>
                  {/* Explanation and Guidance for Strengths */}
                  <Box mb={4}>
                    <Text mt={2}>
                      Identifying your strengths is essential to harnessing your
                      full potential. Recognizing what you&apos;re innately good
                      at can drive both personal and professional growth.
                    </Text>

                    <Heading size="sm" mt={4}>
                      Quick Exercise:
                    </Heading>
                    <Text mt={2}>
                      Recall times when you achieved something significant or
                      when tasks felt naturally easy for you. Ask:
                    </Text>
                    <UnorderedList mt={2}>
                      <ListItem>What were you doing?</ListItem>
                      <ListItem>Why did it feel easy or fulfilling?</ListItem>
                      <ListItem>
                        What skills or traits were you leveraging?
                      </ListItem>
                    </UnorderedList>

                    <Heading size="sm" mt={4}>
                      Learn More:
                    </Heading>
                    <List mt={2} styleType="none">
                      <ListItem>
                        <Link
                          href="https://www.viacharacter.org/"
                          isExternal
                          color="purple.700"
                          fontWeight="semibold"
                        >
                          VIA Character Strengths <ExternalLinkIcon mx="2px" />
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link
                          href="https://www.16personalities.com/"
                          isExternal
                          color="purple.700"
                          fontWeight="semibold"
                        >
                          16 Personalities Test <ExternalLinkIcon mx="2px" />
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link
                          href="https://openpsychometrics.org/tests/IPIP-BFFM/"
                          isExternal
                          color="purple.700"
                          fontWeight="semibold"
                        >
                          Big Five Personality Test{" "}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </ListItem>
                    </List>
                  </Box>

                  {/* Strengths Input Section */}
                  <FormLabel>
                    <Heading size="sm" pt={4}>
                      Add Your Strengths
                    </Heading>
                  </FormLabel>
                  <Box display="flex" flexWrap="wrap" alignItems="center">
                    {formik.values.strengths.map((strength, index) => (
                      <Tag
                        key={index}
                        m={1}
                        variant="solid"
                        colorScheme="purple"
                        size="lg"
                      >
                        <TagLabel>{strength}</TagLabel>
                        <TagCloseButton
                          onClick={() => {
                            const newStrengths = [...formik.values.strengths];
                            newStrengths.splice(index, 1);
                            formik.setFieldValue("strengths", newStrengths);
                          }}
                        />
                      </Tag>
                    ))}
                    <Input
                      placeholder="Enter a strength, e.g., Adaptability"
                      value={currentStrength}
                      onChange={(e) => setCurrentStrength(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddStrength();
                        }
                      }}
                      my={3}
                    />
                    <Button onClick={handleAddStrength} variant="outline">
                      Add
                    </Button>
                  </Box>
                </>
              )}

              {inputType === "accountabilityMethods" && (
                <FormControl>
                  <Box mb={4}>
                    <Text mt={2}>
                      Accountability is taking ownership of your actions and
                      responsibilities. It&apos;s an integral part of goal
                      achievement, helping you stay on track and ensuring you
                      meet your commitments.
                    </Text>

                    <Heading size="sm" mt={4}>
                      Quick Exercise:
                    </Heading>
                    <Text mt={2}>
                      Before you describe your accountability methods,
                      let&apos;s identify areas where it&apos;s crucial.
                    </Text>
                    <UnorderedList mt={2}>
                      <ListItem>
                        Think about tasks or goals where you missed deadlines or
                        didn&apos;t follow through as planned. Why did that
                        happen?
                      </ListItem>
                      <ListItem>
                        How did you feel when you weren&apos;t accountable? How
                        did others react?
                      </ListItem>
                      <ListItem>
                        What methods or systems could have helped you stay on
                        track?
                      </ListItem>
                    </UnorderedList>
                    <Text mt={2}>
                      Use these reflections to guide you in defining your
                      accountability methods below.
                    </Text>
                  </Box>

                  {/* Accountability Methods Input Section */}
                  <FormLabel>
                    <Heading size="sm" pt={4}>
                      Describe Your Accountability Methods
                    </Heading>
                  </FormLabel>
                  <Textarea
                    placeholder="For example: 'I use a daily journal to track my tasks and reflect on any misses. I also have a weekly check-in with a mentor to discuss progress and challenges.'"
                    value={formik.values.accountabilityMethods}
                    rows={7}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "accountabilityMethods",
                        e.target.value
                      )
                    }
                  />
                </FormControl>
              )}

              {inputType === "roleModels" && (
                <FormControl>
                  <Box mb={4}>
                    <Text mt={2}>
                      Role models inspire us, guiding our decisions and
                      influencing our behaviors. They embody qualities we admire
                      and wish to emulate.
                    </Text>

                    <Heading size="sm" mt={4}>
                      Quick Exercise:
                    </Heading>
                    <Text mt={2}>
                      Before you list your role models, take a moment to think:
                    </Text>
                    <UnorderedList mt={2}>
                      <ListItem>
                        Who has inspired you most in your life and why?
                      </ListItem>
                      <ListItem>
                        Which qualities or actions of theirs do you admire?
                      </ListItem>
                      <ListItem>
                        How have they influenced your personal or professional
                        journey?
                      </ListItem>
                    </UnorderedList>
                  </Box>

                  {/* Role Models Input Section */}
                  <FormLabel>
                    <Heading size="sm" pt={4}>
                      Who are your role models?
                    </Heading>
                  </FormLabel>
                  <Textarea
                    placeholder="E.g., Malala Yousafzai, Elon Musk, My Grandfather"
                    value={formik.values.roleModels}
                    onChange={(e) =>
                      formik.setFieldValue("roleModels", e.target.value)
                    }
                    rows={7}
                  />
                </FormControl>
              )}

              {inputType === "personalGrowthInvestments" && (
                <FormControl>
                  <Box mb={4}>
                    <Text mt={2}>
                      Personal growth investments are resources, time, or
                      strategies you commit towards your own development and
                      self-improvement.
                    </Text>

                    <Heading size="sm" mt={4}>
                      Quick Exercise:
                    </Heading>
                    <Text mt={2}>
                      Think about how you&apos;ve invested in your personal
                      growth:
                    </Text>
                    <UnorderedList mt={2}>
                      <ListItem>
                        What books, courses, or workshops have you recently
                        explored?
                      </ListItem>
                      <ListItem>
                        Have you dedicated time for reflection, meditation, or
                        self-assessment?
                      </ListItem>
                      <ListItem>
                        Do you have mentors or coaching sessions? How have they
                        impacted your growth?
                      </ListItem>
                    </UnorderedList>
                    <Text mt={2}>
                      These insights can help you describe your current and
                      future personal growth investments.
                    </Text>
                  </Box>

                  {/* Personal Growth Investments Input Section */}
                  <FormLabel>
                    <Heading size="sm" pt={4}>
                      Describe Your Personal Growth Investments
                    </Heading>
                  </FormLabel>
                  <Textarea
                    placeholder="For example: 'I've recently taken an online course on leadership, set aside 10 minutes daily for mindfulness meditation, and have monthly check-ins with a career coach.'"
                    value={formik.values.personalGrowthInvestments}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "personalGrowthInvestments",
                        e.target.value
                      )
                    }
                    rows={7}
                  />
                </FormControl>
              )}
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => formik.handleSubmit()}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default EditSelfDiscoveryDrawer;
