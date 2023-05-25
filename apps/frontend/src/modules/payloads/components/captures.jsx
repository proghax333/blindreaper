
import { Box, Button, Code, Divider, Flex, Heading, Image, Input, InputGroup, InputLeftElement, Link, Text, useDisclosure } from "@chakra-ui/react";
import { ArrowDropDown, ArrowDropUp, Close, Search } from "@emotion-icons/material";
import React from "react";

// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CaptureItem({ data, handleCaptureItemClick, isActive = false }) {
  const { id, site, screenshot, title, time } = data;
  const createPayloadModal = useDisclosure();

  const [itemVisible, setItemVisible] = React.useState(false);

  const handleToggleItem = () => {
    setItemVisible(state => !state);
  };

  return <Flex
    flexDirection="column"
    borderWidth={1}
    borderColor={"gray.700"}
    background={itemVisible ? "#141414" : "#0c0c0c"}
    p={2}
  >
    <Flex
      flexWrap={"wrap"}
      w={"full"}
      cursor={"pointer"}
      gap={2}
      position="relative"
    >
      <Button
        position="absolute"
        right={"0.1rem"}
        top={"0.1rem"}
        p={0}
        border={"1px"}
        borderColor={"gray.500"}
        rounded="full"
        minW={0}
        w={7}
        h={7}
        alignItems={"center"}
        justifyContent="center"

        onClick={handleToggleItem}
      >
        {itemVisible ? <ArrowDropUp /> : <ArrowDropDown style={{margin: 0}} size={24} />}
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
    </Flex>
    {itemVisible && <>
      <Divider mt={4} mb={2} />
      <Flex
        flexDirection={"column"}
        w={"full"}
        gap={2}
      >
        <InfoItem>
          <Heading variant="small">Screenshot</Heading>
          <Divider my={1} />

          <Image src={screenshot} />
        </InfoItem>
      </Flex>
    </>}
  </Flex>;
}

/*
        <InfoItem>
          <Heading variant="small">Location</Heading>
          <Divider my={1}/>

          <Code w="full" p={2}>https://www.google.com</Code>
        </InfoItem>
        <InfoItem>
          <Heading variant="small">IP Address</Heading>
          <Divider my={1}/>

          <Code w="full" p={2}>192.168.1.100</Code>
        </InfoItem>
        <InfoItem>
          <Heading variant="small">Cookies</Heading>
          <Divider my={1}/>

          <Code w="full" p={2}>BASESESSID=123123;</Code>
        </InfoItem>
        <InfoItem
          // bg="pink.200"
        >
          <Heading variant="small">HTML DOM</Heading>
          <Divider my={1}/>

          <Flex
            overflowX="auto"
          >
            <Code
              wordBreak={"break-word"}
              whiteSpace={"pre-wrap"}
              p={2}
            >
              {
  `<html>
  <head>
    <title>Href Attribute Example</title>
  </head>
  <body>
    <h1>Href Attribute Example</h1>
    <p>
      <a href="https://www.freecodecamp.org/contribute/">The freeCodeCamp Contribution Page</a> shows you how and where you can contribute to freeCodeCamp's community and growth.
    </p>
  </body>
</html>`
              }
            </Code>
          </Flex>
        </InfoItem>
        <InfoItem>
          <Heading variant="small">Browser Time</Heading>
          <Divider my={1}/>

          <Code w="full" p={2}>{time.toString()}</Code>
        </InfoItem>
*/

function InfoItem({ ...props }) {
  return <Box
    my={2}
    w="full"
    {...props}
  />
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
        overflowX="auto"
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
