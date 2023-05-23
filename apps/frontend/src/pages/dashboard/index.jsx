import { Box, Button, Divider, Flex, Text, Tooltip, useToast } from "@chakra-ui/react";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import ActionBarButton from "~/ui/ActionBarButton";

import { AccountCircle, CheckCircle, Extension, NoteAdd, Code, ArrowDropDown, KeyboardArrowDown, ChevronRight, InsertDriveFile, Add, CameraAlt } from "@emotion-icons/material";
import { Settings, Notes, Note } from "@emotion-icons/material-outlined"
import React, { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "~/modules/auth/auth.context";
import { wait } from "~/lib/utils";

export default function DashboardIndex() {
  return null;
}

export function Dashboard() {
  const toast = useToast();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Not logged in!",
        // description: "",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate("/auth/login");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  return <Flex
    w="full"
    h="full"
    overflow="hidden"
    flexDir={"column"}
  >
    <Box background="gray.900">
      <Header>
        <HeadingLogo />
      </Header>
    </Box>

    <Divider />

    <Flex
      minH={0}
      w="full"
      h="full"
    >
      {/* Action Bar */}
      <Flex
        h="full"
        flexDirection="column"
        background="gray.900"
      >
        <Flex
          flexDir="column"
          flex={1}
          overflowY={"auto"}
        >
          <ActionBarButton h="12" minH="12" as={Link} to="/dashboard/payloads">
            <Code size={"18"} />
          </ActionBarButton>
          <ActionBarButton h="12" minH="12" as={Link} to="/dashboard/settings">
            <Settings size={"18"} />
          </ActionBarButton>
        </Flex>
      </Flex>

      <Divider orientation="vertical" />

      {/* Content */}
      <Outlet />
    </Flex>

    <Divider />

    {/* Bottom Status Bar */}
    <Flex w="full" background="gray.900" minH="8" alignItems="center">
      <ActionBarButton w={"8"} h={"full"}>
        <CheckCircle size={"16"} />
      </ActionBarButton>
      <Divider orientation="vertical" />
      <Text px={3} fontSize={"sm"}>
        Loaded
      </Text>
    </Flex>
  </Flex>
}
