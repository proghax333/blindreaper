
import { Box, Button, Divider, Flex, Heading, Image, Input, InputGroup, InputLeftElement, Link, Text } from "@chakra-ui/react";
import { ArrowDropDown, Close, Search } from "@emotion-icons/material";
import React from "react";

function CaptureItem({ data, handleCaptureItemClick, isActive = false }) {
  const { id, site, screenshot, title, time } = data;

  return <Flex
    borderWidth={1}
    // borderRadius={"md"}
    borderColor={"gray.700"}
    p={2}
    w={"full"}
    // _hover={{
    //   background: "#181818"
    // }}
    background={isActive ? "#181818" : "#0c0c0c"}
    cursor={"pointer"}
    gap={2}
    flexWrap={"wrap"}
    position="relative"
  >
    <Button
      position="absolute"
      right={"0.4rem"}
      top={"0.4rem"}
      p={0}
      border={"1px"}
      borderColor={"gray.500"}
      rounded="full"
      minW={0}
      w={7}
      h={7}
      alignItems={"center"}
      justifyContent="center"
    >
      <ArrowDropDown style={{margin: 0}} size={24} />
    </Button>
    <Image
      // alignSelf={"center"}
      src={screenshot}
      w="32"
    />

    <Flex
      flex={1}
      flexDirection={"column"}
      w="full"
    >
      <Text
        fontSize={"xs"}
        textColor="#999"
      >
        #{id}
      </Text>
      <Text
        fontWeight={"bold"}
        fontSize={"lg"}
        fontFamily={"Montserrat"}
        // onClick={() => handleCaptureItemClick(id)}
      >
        {title}
      </Text>
      <Box>
        <Link
          href={site}
          fontSize={"sm"}
          textColor={"whiteAlpha.800"}
          target="_blank"
        >
          {site}
        </Link>
      </Box>

      <Box py={1} />
      <Divider mt={"auto"} />
      <Text
        fontSize={"xs"}
        color={"whiteAlpha.800"}
      >
        {time.toString()}
      </Text>
    </Flex>
  </Flex>;
}

function CapturesList({ ...props }) {
  return <Flex
    p={4}
    flex={1}
    gap={2}
    flexDirection={"column"}
    {...props}
  />
}

function CaptureInfo({
  data,
  onClose
}) {
  return <Flex
    flex={2}
    flexDirection={"column"}
    w="full"
  >
    <Flex
      alignItems="center" 
      p={4}
      py={2}
    >
      <Text>
        View capture
      </Text>

      <Button
        onClick={onClose}
        marginLeft={"auto"}
        w={10}
        h={10}
        p={0}
        borderRadius={"none"}
        // background={"none"}
      >
        <Close size={14} />
      </Button>
    </Flex>

    <Divider />

    <Box>
    </Box>
  </Flex>
}

export default function Captures({ ...props }) {
  const captures = [
    {
      id: 101,
      title: "Home | GUGURU",
      site: "https://www.google.com",
      screenshot: "https://cdn.dribbble.com/users/239755/screenshots/2476419/media/12af6dbdc389c698bc59e404cb7305ed.png?compress=1&resize=400x300",
      time: new Date(),
    },
    {
      id: 102,
      title: "Post | GUGURU",
      site: "https://www.google.com",
      screenshot: "https://cdn.dribbble.com/users/239755/screenshots/2476419/media/12af6dbdc389c698bc59e404cb7305ed.png?compress=1&resize=400x300",
      time: new Date(),
    },
    {
      id: 103,
      title: "Post | GUGURU",
      site: "https://www.google.com",
      screenshot: "https://cdn.dribbble.com/users/239755/screenshots/2476419/media/12af6dbdc389c698bc59e404cb7305ed.png?compress=1&resize=400x300",
      time: new Date(),
    },
    {
      id: 105,
      title: "Post | GUGURU",
      site: "https://www.google.com",
      screenshot: "https://cdn.dribbble.com/users/239755/screenshots/2476419/media/12af6dbdc389c698bc59e404cb7305ed.png?compress=1&resize=400x300",
      time: new Date(),
    },
    {
      id: 108,
      title: "Post | GUGURU",
      site: "https://www.google.com",
      screenshot: "https://cdn.dribbble.com/users/239755/screenshots/2476419/media/12af6dbdc389c698bc59e404cb7305ed.png?compress=1&resize=400x300",
      time: new Date(),
    },
    {
      id: 110,
      title: "Post | GUGURU",
      site: "https://www.google.com",
      screenshot: "https://cdn.dribbble.com/users/239755/screenshots/2476419/media/12af6dbdc389c698bc59e404cb7305ed.png?compress=1&resize=400x300",
      time: new Date(),
    },
  ];

  const [selectedCaptureId, setSelectedCaptureId] = React.useState(null);
  const [selectedCapture, setSelectedCapture] = React.useState(null);

  function handleClose() {
    setSelectedCaptureId(null);
    setSelectedCapture(null);
  }

  function handleCaptureItemClick(id) {
    setSelectedCaptureId(captureId => {
      if(id == captureId) {
        setSelectedCapture(null);
        return null;
      }

      setSelectedCapture(captures.find(c => c.id === id));
      return id;
    });
  }

  return <Flex
    h="full"
    flexDir={"column"}
    w="full"

    {...props}
  >
    <Flex
      alignItems="center"
      justifyContent={"space-between"}
      px={8}
      gap={4}
      w="full"
    >
      <Heading fontSize={36}>Captures</Heading>
      <Box maxW={72} p={6}>
        <form>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<Search size={20} color="#aaa" />}
            />
            <Input
              type='text'
              placeholder='Search'
              variant="filled"
            />
          </InputGroup>
        </form>
      </Box>
    </Flex>

    <Divider />

    <Flex minH={0} h="full">
      <Flex
        flex={1}
        flexDirection={"column"}
        overflowY="auto"
      >
        <CapturesList>
          {
            captures
              .map(capture => {
                  return <CaptureItem
                    key={`capture-item-${capture.id}`}
                    data={capture}
                    isActive={capture.id === selectedCaptureId}
                    handleCaptureItemClick={handleCaptureItemClick}
                  />
                }
              )
          }
        </CapturesList>
      </Flex>

      {/* <Divider orientation="vertical" /> */}
{/* 
      <Flex
        flex={2}
        flexDirection={"column"}
        overflowY="auto"
      >
        {selectedCapture && <CaptureInfo
          data={selectedCapture}
          onClose={handleClose}
        />}
      </Flex> */}
    </Flex>
  </Flex>
}
