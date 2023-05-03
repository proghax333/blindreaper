import { Box, Button, Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import ActionBarButton from "~/ui/ActionBarButton";

import { AccountCircle, CheckCircle, Extension, NoteAdd, Code, ArrowDropDown, KeyboardArrowDown, ChevronRight, InsertDriveFile, Add, CameraAlt } from "@emotion-icons/material";
import { Settings, Notes, Note } from "@emotion-icons/material-outlined"
import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function DashboardIndex() {
  return null;
}

export function Dashboard() {
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
          <ActionBarButton h="12" minH="12" as={Link} to="/dashboard/captures">
            <CameraAlt size={"18"} />
          </ActionBarButton>
          <ActionBarButton h="12" minH="12" as={Link} to="/dashboard/collections">
            <Code size={"18"} />
          </ActionBarButton>
          <ActionBarButton h="12" minH="12">
            <Settings size={"18"} />
          </ActionBarButton>
          <ActionBarButton h="12" minH="12">
            <AccountCircle size={"18"} />
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
