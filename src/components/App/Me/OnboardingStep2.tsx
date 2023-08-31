// OnboardingStep2.tsx
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { OnboardingStepProps } from "./OnboardingStep1";
import { useUserProfile } from "@/hooks/useUserProfile";

function OnboardingStep2({
  onNext,
  onPrevious,
  onClose,
  user,
  stepNumber,
}: OnboardingStepProps) {
  const {
    profile,
    handleInputChange,
    saveProfileToFirebase,
    saveOnboardingStateToFirebase,
  } = useUserProfile(user);

  const formik = useFormik({
    initialValues: profile,
    onSubmit: async (values) => {
      try {
        const docId = await saveProfileToFirebase();
        console.log(`Profile2 saved with ID: ${docId}`);
        onNext();
      } catch (error) {
        console.error("Error saving profile to Firebase:", error);
      }
    },
    validate: (values) => {
      let errors: { [key: string]: string } = {};
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

  function validateURL(value: string) {
    const pattern =
      /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/;
    let error;
    if (!pattern.test(value)) {
      error = "Please enter a valid link.";
    }
    return error;
  }

  const handleBuddyOrSoloChange = (value: string) => {
    formik.setFieldValue("buddyOrSolo", value);
    handleInputChange("buddyOrSolo", value);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel>How would you like to proceed on this journey?</FormLabel>
          <RadioGroup
            value={formik.values.buddyOrSolo}
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

        {formik.values.buddyOrSolo === "buddy" && (
          <>
            <FormControl
              isInvalid={
                !!(formik.touched.linkedinURL && formik.errors.linkedinURL)
              }
            >
              <FormLabel mt={4}>
                LinkedIn Profile (Alternatively, share what you do)
              </FormLabel>
              <Input
                type="text"
                name="linkedinURL"
                placeholder="LinkedIn link or brief about you"
                onChange={(e) => {
                  handleInputChange("linkedinURL", e.target.value);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.linkedinURL}
              />
              <FormErrorMessage>{formik.errors.linkedinURL}</FormErrorMessage>
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
                name="selfIntroduction"
                placeholder="E.g., Hi, I'm Jane. I've been in the marketing field for 5 years..."
                onChange={(e) => {
                  handleInputChange("selfIntroduction", e.target.value);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.selfIntroduction}
              />
              <FormErrorMessage>
                {formik.errors.selfIntroduction}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                !!(formik.touched.calendarLink && formik.errors.calendarLink)
              }
            >
              <FormLabel mt={4}>Your schedule link</FormLabel>
              <Input
                type="text"
                name="calendarLink"
                placeholder="Google Calendar link or similar"
                onChange={(e) => {
                  handleInputChange("calendarLink", e.target.value);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.calendarLink}
              />
              <FormErrorMessage>{formik.errors.calendarLink}</FormErrorMessage>
            </FormControl>
          </>
        )}

        <Flex my={7} justify="flex-end">
          <Button variant="ghost" onClick={onClose} mr={2}>
            Continue Later
          </Button>
          {stepNumber !== 1 && (
            <Button variant="outline" onClick={onPrevious} mr={2}>
              Previous
            </Button>
          )}
          <Button
            colorScheme="blue"
            type={stepNumber === 3 ? "button" : "submit"} // If it's the last step, it doesn't need to submit the form
            onClick={stepNumber === 3 ? onNext : undefined} // If it's the last step, handle with onNext
            mr={2}
          >
            {stepNumber === 3 ? "Done" : "Next Step"}
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default OnboardingStep2;
