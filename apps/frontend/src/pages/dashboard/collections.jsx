import React from "react";

import { Box, Flex, Divider, Text } from "@chakra-ui/react";

import { AccountCircle, CheckCircle, Extension, NoteAdd, Code, ArrowDropDown, KeyboardArrowDown, ChevronRight, InsertDriveFile, Add, CameraAlt } from "@emotion-icons/material";
import { Settings, Notes, Note } from "@emotion-icons/material-outlined";

import ActionBarButton from "~/ui/ActionBarButton";

const collections = [
  {
    id: 1,
    name: "vulnsite.site",
    children: [
      {
        id: 101,
        name: "blog.php"
      },
      {
        id: 102,
        name: "news.php"
      },
      {
        id: 103,
        name: "search.php",
        children: [
          {
            id: 2222,
            name: "munchingsites.web",
            children: [
              {
                id: 20221,
                name: "comments.php"
              }
            ]
          }
        ]
      },
    ]
  },
  {
    id: 2,
    name: "munchingsites.web",
    children: [
      {
        id: 201,
        name: "comments.php"
      }
    ]
  },
  {
    id: 3,
    name: "logiathing.web",
    children: [

    ]
  }
];

function TreeCollection({ node, level = 0 }) {
  const LEFT_ICON_SIZE = 18;
  const [isOpen, setIsOpen] = React.useState(false);

  function handleToggle() {
    setIsOpen(state => !state);
  }

  return <Box>
    <Flex
      pl={`${4 + level * 12 + (node.children == undefined ? 0 : 0)}px`}
      alignItems={"center"}
      py={1}
      cursor={"pointer"}
      onClick={handleToggle}
      _hover={{
        background: "gray.800"
      }}
    >
      {node.children
        ? isOpen
          ? <KeyboardArrowDown size={LEFT_ICON_SIZE} />
          : <ChevronRight size={LEFT_ICON_SIZE} />
        : <InsertDriveFile size={LEFT_ICON_SIZE} />
      }
      <Text px={1}>{node.name}</Text>
    </Flex>

    {
      isOpen && node.children &&
      <Box>
        {node.children.map(child => {
          return <TreeCollection
            key={`tree-node-${child.id}`}
            level={level + 1}
            node={child}
          />
        })}
      </Box>
    }
  </Box>
}

export default function MainContent() {
  return <Flex
    w="full"
    h="full"
    background="blackAlpha.700"
  >
    <Box
      w="14rem"
      h="full"
      background="gray.900"
      // css={{
      //   '&::-webkit-scrollbar': {
      //     width: '4px',
      //   },
      //   '&::-webkit-scrollbar-track': {
      //     width: '6px',
      //   },
      //   '&::-webkit-scrollbar-thumb': {
      //     background: "white",
      //     borderRadius: '24px',
      //   },
      // }}
    >
      {/* Tree browser */}
      <Flex
        direction={"column"}
        w="full"
        h="full"
      >
        <Flex justifyContent={"space-between"}>
          <Text p={1} px={2} fontWeight={"semibold"} fontSize="small">Collections</Text>
          <ActionBarButton w={"auto"} h={"auto"}>
            <Add size={20} />
          </ActionBarButton>
        </Flex>

        <Divider />

        <Box
          fontSize="sm"
          flex={1}
          overflowY="auto"
        >
          {collections.map(node => {
            return <TreeCollection
              key={`tree-node-${node.id}`}
              node={node}
              level={0}
            />;
          })}
        </Box>
      </Flex>
    </Box>

    <Divider orientation="vertical" />
  </Flex>
}
