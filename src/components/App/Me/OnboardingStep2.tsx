// OnboardingStep2.tsx
import {
  Button,
  FormControl,
  FormLabel,
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  Flex,
  FormErrorMessage,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { OnboardingStepProps } from "./OnboardingStep1";
import { useUserProfile } from "@/hooks/useUserProfile";

export function validateURL(value: string) {
  const pattern =
    /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/;
  let error;
  if (!pattern.test(value)) {
    error = "Please enter a valid link.";
  }
  return error;
}

function OnboardingStep2({
  onNext,
  onPrevious,
  onClose,
  user,
  stepNumber,
  loading,
}: OnboardingStepProps) {
  const { profile, handleInputChange, saveProfileToFirebase } =
    useUserProfile(user);

  const formik = useFormik({
    initialValues: profile,
    onSubmit: async (values) => {
      try {
        const docId = await saveProfileToFirebase(values);
        console.log(`Profile2 saved with ID: ${docId}`);
        onNext();
      } catch (error) {
        console.error("Error saving profile to Firebase:", error);
      }
    },
    validate: (values) => {
      let errors: { [key: string]: string } = {};
      if (values.buddyOrSolo === "buddy") {
        if (!values.selfIntroduction) {
          errors.selfIntroduction = "Self Introduction is required.";
        }
      }
      return errors;
    },
  });

  const handleBuddyOrSoloChange = (value: string) => {
    formik.setFieldValue("buddyOrSolo", value);
    handleInputChange("buddyOrSolo", value);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <Flex alignItems="center">
            <FormLabel>
              How would you like to proceed on this journey?
            </FormLabel>
            <Tooltip label="Choosing 'Join the Club' will send a Slack invitation to your email. Remember, you can always change your choice later.">
              <Icon name="info-outline" color="orange.500" mb={2} />
            </Tooltip>
          </Flex>
          <RadioGroup
            value={formik.values.buddyOrSolo}
            onChange={handleBuddyOrSoloChange}
          >
            <Stack direction="row">
              <Radio value="buddy" colorScheme="purple">
                Join the Club
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
                !!(
                  formik.touched.selfIntroduction &&
                  formik.errors.selfIntroduction
                )
              }
            >
              <FormLabel mt={4}>Introduce yourself</FormLabel>
              <Textarea
                name="selfIntroduction"
                placeholder="Hi there! Share a bit about yourself, a passion, or a fun fact. Let's connect! 😊"
                onChange={(e) => {
                  handleInputChange("selfIntroduction", e.target.value);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.selfIntroduction}
                rows={5}
              />
              <FormErrorMessage>
                {formik.errors.selfIntroduction}
              </FormErrorMessage>
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
            isLoading={loading}
            type={stepNumber === 3 ? "button" : "submit"}
            onClick={stepNumber === 3 ? onNext : undefined}
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
