import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Tag,
  TagLabel,
  Box,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useFormik } from "formik";

export const domains = [
  "Professional & Financial Development",
  "Health & Well-being",
  "Relationships & Community",
  "Spiritual & Inner Growth",
  "Lifestyle & Leisure",
  "Contribution & Legacy",
];

export type OnboardingStepProps = {
  onNext: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  user: User;
  stepNumber: number;
};

function OnboardingStep1({
  onNext,
  onPrevious,
  onClose,
  user,
  stepNumber,
}: OnboardingStepProps) {
  const { profile, handleInputChange, saveProfileToFirebase } =
    useUserProfile(user);

  const formik = useFormik({
    initialValues: profile,
    onSubmit: async (values) => {
      // Save to Firestore:
      try {
        const docId = await saveProfileToFirebase(values);
        console.log(docId);
        onNext(); // Move to the next step after saving
      } catch (error) {
        console.error("Error saving profile to Firebase:", error);
      }
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

      return errors;
    },
  });

  const toggleDomain = (domain: string) => {
    const newDomains = formik.values.domains.includes(domain)
      ? formik.values.domains.filter((d) => d !== domain)
      : [...formik.values.domains, domain];

    formik.setFieldValue("domains", newDomains);
    handleInputChange("domains", newDomains);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={!!(formik.touched.domains && formik.errors.domains)}
        >
          <FormLabel>Which areas would you like to improve in?</FormLabel>
          <Box display="flex" flexWrap="wrap" gap=".5rem">
            {domains.map((domain) => (
              <Tag
                size="lg"
                key={domain}
                borderRadius="full"
                variant={
                  formik.values.domains.includes(domain) ? "solid" : "outline"
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

        <FormControl
          isInvalid={
            !!(formik.touched.biggestGoal && formik.errors.biggestGoal)
          }
        >
          <FormLabel mt={4}>
            What&apos;s the biggest goal you&apos;re aiming for?
          </FormLabel>
          <Textarea
            placeholder="E.g., Build leadership skills"
            name="biggestGoal"
            onChange={(e) => {
              handleInputChange("biggestGoal", e.target.value);
              formik.handleChange(e);
            }}
            value={formik.values.biggestGoal}
          />
          <FormErrorMessage>{formik.errors.biggestGoal}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!(formik.touched.challenges && formik.errors.challenges)}
        >
          <FormLabel mt={4}>
            What challenges might stop you from reaching this goal?
          </FormLabel>
          <Textarea
            placeholder="E.g., Time management, distractions, lack of resources"
            name="challenges"
            onChange={(e) => {
              handleInputChange("challenges", e.target.value);
              formik.handleChange(e);
            }}
            value={formik.values.challenges}
          />
          <FormErrorMessage>{formik.errors.challenges}</FormErrorMessage>
        </FormControl>

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

export default OnboardingStep1;
