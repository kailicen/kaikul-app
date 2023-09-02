import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  Input,
  FormLabel,
  Box,
  FormControl,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
  Tag,
  TagLabel,
  Textarea,
} from "@chakra-ui/react";
import { UserProfile } from "@/atoms/userProfileAtom";
import { useFormik } from "formik";
import { domains } from "./OnboardingStep1";
import { validateURL } from "./OnboardingStep2";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSubmit: (updatedProfile: UserProfile) => void;
  mode: "personalInfo" | "shareInfo" | "personalInfoDepth";
};

const EditProfileDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  onSubmit,
  mode,
}) => {
  let headerTitle = "";

  switch (mode) {
    case "personalInfo":
      headerTitle = "Edit Personal Info";
      break;
    case "shareInfo":
      headerTitle = "Edit Sharing Info";
      break;
    case "personalInfoDepth":
      headerTitle = "Dive Deeper";
      break;
  }

  const formik = useFormik({
    initialValues: profile,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
    validate: (values) => {
      let errors: { [key: string]: string } = {};

      if (values.domains.length === 0) {
        errors.domains = "Please select at least one domain.";
      }
      if (!values.biggestGoal) {
        errors.biggestGoal = "This field is required.";
      }
      if (!values.challenges) {
        errors.challenges = "This field is required.";
      }
      if (values.buddyOrSolo === "buddy") {
        if (!values.linkedinURL) {
          errors.linkedinURL = "Professional profile is required.";
        }
        if (!values.selfIntroduction) {
          errors.selfIntroduction = "Self Introduction is required.";
        }
        const calendarLinkError = validateURL(values.calendarLink);
        if (calendarLinkError) {
          errors.calendarLink = calendarLinkError;
        }
      }

      return errors;
    },
  });
  const toggleDomain = (domain: string) => {
    const newDomains = formik.values.domains.includes(domain)
      ? formik.values.domains.filter((d) => d !== domain)
      : [...formik.values.domains, domain];

    formik.setFieldValue("domains", newDomains);
  };

  const handleBuddyOrSoloChange = (value: string) => {
    formik.setFieldValue("buddyOrSolo", value);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{headerTitle}</DrawerHeader>

        <DrawerBody>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4}>
              {mode === "personalInfo" && (
                <>
                  {/* Domains */}
                  <FormControl
                    isInvalid={
                      !!(formik.touched.domains && formik.errors.domains)
                    }
                  >
                    <FormLabel>
                      Which areas would you like to improve in?
                    </FormLabel>
                    <Box display="flex" flexWrap="wrap" gap=".5rem">
                      {domains.map((domain) => (
                        <Tag
                          size="lg"
                          key={domain}
                          borderRadius="full"
                          variant={
                            formik.values.domains.includes(domain)
                              ? "solid"
                              : "outline"
                          }
                          cursor="pointer"
                          onClick={() => toggleDomain(domain)}
                          colorScheme="purple"
                        >
                          <TagLabel>{domain}</TagLabel>
                        </Tag>
                      ))}
                    </Box>
                    <FormErrorMessage>{formik.errors.domains}</FormErrorMessage>
                  </FormControl>

                  {/* Biggest Goal */}
                  <FormControl
                    isInvalid={
                      !!(
                        formik.touched.biggestGoal && formik.errors.biggestGoal
                      )
                    }
                  >
                    <FormLabel mt={4}>
                      What&apos;s the biggest goal you&apos;re aiming for?
                    </FormLabel>
                    <Textarea
                      placeholder="E.g., Build leadership skills"
                      {...formik.getFieldProps("biggestGoal")}
                    />
                    <FormErrorMessage>
                      {formik.errors.biggestGoal}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Challenges */}
                  <FormControl
                    isInvalid={
                      !!(formik.touched.challenges && formik.errors.challenges)
                    }
                  >
                    <FormLabel mt={4}>
                      What challenges might stop you from reaching this goal?
                    </FormLabel>
                    <Textarea
                      placeholder="E.g., Time management, distractions, lack of resources"
                      {...formik.getFieldProps("challenges")}
                    />
                    <FormErrorMessage>
                      {formik.errors.challenges}
                    </FormErrorMessage>
                  </FormControl>
                </>
              )}

              {mode === "shareInfo" && (
                <>
                  {/* Buddy or Solo Preference */}
                  <FormControl>
                    <FormLabel>
                      How would you like to proceed on this journey?
                    </FormLabel>
                    <RadioGroup
                      {...formik.getFieldProps("buddyOrSolo")}
                      onChange={handleBuddyOrSoloChange}
                    >
                      <Stack direction="row">
                        <Radio value="buddy" colorScheme="purple">
                          Buddy Up
                        </Radio>
                        <Radio value="solo" colorScheme="purple">
                          Solo
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  {/* LinkedIn and Self Introduction - Only when Buddy */}
                  {formik.values.buddyOrSolo === "buddy" && (
                    <>
                      <FormControl
                        isInvalid={
                          !!(
                            formik.touched.linkedinURL &&
                            formik.errors.linkedinURL
                          )
                        }
                      >
                        <FormLabel mt={4}>
                          LinkedIn Profile (Alternatively, share what you do)
                        </FormLabel>
                        <Input {...formik.getFieldProps("linkedinURL")} />
                        <FormErrorMessage>
                          {formik.errors.linkedinURL}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl
                        isInvalid={
                          !!(
                            formik.touched.selfIntroduction &&
                            formik.errors.selfIntroduction
                          )
                        }
                      >
                        <FormLabel mt={4}>
                          Introduce yourself to potential partners
                        </FormLabel>
                        <Textarea
                          {...formik.getFieldProps("selfIntroduction")}
                        />
                        <FormErrorMessage>
                          {formik.errors.selfIntroduction}
                        </FormErrorMessage>
                      </FormControl>

                      {/* Calendar Link */}
                      <FormControl
                        isInvalid={
                          !!(
                            formik.touched.calendarLink &&
                            formik.errors.calendarLink
                          )
                        }
                      >
                        <FormLabel mt={4}>Your schedule link</FormLabel>
                        <Input {...formik.getFieldProps("calendarLink")} />
                        <FormErrorMessage>
                          {formik.errors.calendarLink}
                        </FormErrorMessage>
                      </FormControl>
                    </>
                  )}
                </>
              )}

              {mode === "personalInfoDepth" && (
                <>
                  {/* Domains Depth */}
                  <FormControl>
                    <FormLabel>
                      Reflect on your chosen domains:{" "}
                      {profile.domains.join(", ")}.
                    </FormLabel>
                    <Textarea
                      placeholder="Recent actions or decisions related to these domains..."
                      {...formik.getFieldProps("domainsDepth")}
                      height="120px" // Adjust as needed
                    />
                  </FormControl>

                  {/* Biggest Goal Depth */}
                  <FormControl mt={4}>
                    <FormLabel>
                      Thoughts on your ultimate goal: {profile.biggestGoal}.
                    </FormLabel>
                    <Textarea
                      placeholder="Reasons and alignment with your life purpose..."
                      {...formik.getFieldProps("biggestGoalDepth")}
                      height="120px" // Adjust as needed
                    />
                  </FormControl>

                  {/* Challenges Depth */}
                  <FormControl mt={4}>
                    <FormLabel>
                      Delve into your challenges: {profile.challenges}.
                    </FormLabel>
                    <Textarea
                      placeholder="Past attempts and potential solutions..."
                      {...formik.getFieldProps("challengesDepth")}
                      height="120px" // Adjust as needed
                    />
                  </FormControl>
                </>
              )}
            </VStack>
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
    </Drawer>
  );
};

export default EditProfileDrawer;
