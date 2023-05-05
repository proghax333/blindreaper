import React from "react";

import { Box, Flex, Divider, Text } from "@chakra-ui/react";

import { KeyboardArrowDown, ChevronRight, InsertDriveFile, Add } from "@emotion-icons/material";

import ActionBarButton from "~/ui/ActionBarButton";
import { useSelector } from "react-redux";

export function useMemoSortedCollection(collections) {
  return React.useMemo(() => {
    const colls = collections;

    if(!colls) {
      return;
    }

    const result = [...colls];
    result.sort((a, b) => {
      if(a.children && b.children) {
        return a.name.localeCompare(b.name);
      } else if(a.children) {
        return -1;
      } else {
        return 1;
      }
    });

    return result;
  }, [collections]);
}

function TreeCollection({ node: node_, level = 0 }) {
  const LEFT_ICON_SIZE = 18;
  const [isOpen, setIsOpen] = React.useState(false);

  const node = {
    ...node_,
  };
  
  const nodeChildren = useMemoSortedCollection(node.children);

  function handleToggle() {
    setIsOpen(state => !state);
  }

  return <Box>
    <Flex
      pl={`${4 + level * 12 + (nodeChildren == undefined ? 0 : 0)}px`}
      alignItems={"center"}
      py={1}
      cursor={"pointer"}
      onClick={handleToggle}
      _hover={{
        background: "gray.800"
      }}
    >
      {nodeChildren
        ? isOpen
          ? <KeyboardArrowDown size={LEFT_ICON_SIZE} />
          : <ChevronRight size={LEFT_ICON_SIZE} />
        : <InsertDriveFile size={LEFT_ICON_SIZE} />
      }
      <Text px={1}>{node.name}</Text>
    </Flex>

    {
      isOpen && nodeChildren &&
      <Box>
        {nodeChildren.map(child => {
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
  const payloads = useSelector(state => state.payloads);
  // const { collections } = payloads;
  const collections = useMemoSortedCollection(payloads.collections);


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
