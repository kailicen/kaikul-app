import LoadingScreen from "@/components/LoadingScreen";
import { auth } from "@/firebase/clientApp";
import { useTeamTab } from "@/hooks/useWeeklyReflections";
import {
  Box,
  Text,
  Heading,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  DrawerFooter,
  useDisclosure,
  Input,
  Select,
  Flex,
} from "@chakra-ui/react";
import {
  endOfWeek,
  startOfWeek as startOfWeekDateFns,
  format,
  parseISO,
} from "date-fns";
import { User } from "firebase/auth";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {};

function UserInfoSection({}: Props) {
  return (
    <VStack gap={4} p={6} align="start" w="100%">
      <Text mb={3}>
        Track your week&apos;s highlights effortlessly! Fill out your weekly
        updates, a fun, vital part of our sessions.
      </Text>
    </VStack>
  );
}

export default UserInfoSection;
