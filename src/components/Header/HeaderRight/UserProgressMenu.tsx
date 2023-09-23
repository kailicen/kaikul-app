import { useBreakpointValue, Flex, IconButton, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { LuSmilePlus } from "react-icons/lu";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineForum } from "react-icons/md";
import { User } from "firebase/auth";

type UserProgressMenuProps = {
  user?: User | null;
};

const UserProgressMenu: React.FC<UserProgressMenuProps> = ({ user }) => {
  const router = useRouter();

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Flex gap={1.5}>
        {isMobile ? (
          <IconButton
            aria-label="Me"
            icon={<LuSmilePlus />}
            onClick={() => {
              router.push("/");
            }}
            borderRadius="full"
            size="md"
            bg={router.pathname === "/" ? "#ff5e0e" : undefined}
          />
        ) : (
          <Button
            leftIcon={<LuSmilePlus />}
            onClick={() => {
              router.push("/");
            }}
            bg={router.pathname === "/" ? "#ff5e0e" : undefined}
          >
            Me
          </Button>
        )}

        {isMobile ? (
          <IconButton
            aria-label="Tracker"
            icon={<BsCalendarWeek />}
            onClick={() => router.push("/tracker")}
            borderRadius="full"
            size="md"
            bg={router.pathname === "/tracker" ? "#ff5e0e" : undefined}
          />
        ) : (
          <Button
            leftIcon={<BsCalendarWeek />}
            onClick={() => router.push("/tracker")}
            bg={router.pathname === "/tracker" ? "#ff5e0e" : undefined}
          >
            Tracker
          </Button>
        )}

        {isMobile ? (
          <IconButton
            aria-label="Connect"
            icon={<MdOutlineForum />}
            onClick={() => router.push("/connect")}
            borderRadius="full"
            size="md"
            bg={router.pathname === "/connect" ? "#ff5e0e" : undefined}
          />
        ) : (
          <Button
            leftIcon={<MdOutlineForum />}
            onClick={() => router.push("/connect")}
            bg={router.pathname === "/connect" ? "#ff5e0e" : undefined}
          >
            Connect
          </Button>
        )}
      </Flex>
    </>
  );
};

export default UserProgressMenu;
