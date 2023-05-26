
import { Box, Button, Code, Divider, Flex, Heading, Image, Input, InputGroup, InputLeftElement, Link, Text, useDisclosure } from "@chakra-ui/react";
import { ArrowDropDown, ArrowDropUp, Close, Search } from "@emotion-icons/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { API_BASE_URL, api, handleResponse } from "~/lib/http";

// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const fieldsList = [
  { path: "Screenshot", type: "image" },
  { path: "Cookies" },
  { path: "Location" },
  { path: "Referrer" },
  { path: "User-Agent" },
  { path: "Browser Time" },
  { path: "Origin" },
  { path: "DOM" },
  { path: "localStorage" },
  { path: "sessionStorage" },
];
const fieldsMapping = fieldsList.reduce((result, field) => {
  result[field.path] = field;
  return result;
}, {});

function CaptureItem({ capture, handleCaptureItemClick, isActive = false }) {
  const { data, id } = capture;

  const [itemVisible, setItemVisible] = React.useState(false);

  const handleToggleItem = () => {
    setItemVisible(state => !state);
  };

  let { Screenshot, Location, Title } = data;
  let BrowserTime = data["Browser Time"];
  let Site = Location;

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
        src={Screenshot}
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
          {Title}
        </Text>
        <Box>
          <Link
            href={Site}
            fontSize={"sm"}
            textColor={"whiteAlpha.800"}
            target="_blank"
          >
            {Site}
          </Link>
        </Box>

        <Box py={1} />
        <Divider mt={"auto"} />
        <Text
          fontSize={"xs"}
          color={"whiteAlpha.800"}
        >
          {BrowserTime?.toString()}
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
        {fieldsList.map(field => {
          return <InfoItem key={`info-item-${id}-${field.path}`}>
            <Heading variant="small">{field.path}</Heading>
            <Divider my={1} />
            {
              field.type === "image"
                ? <Image src={data[field.path]} />
                : <Code>{data[field.path]}</Code>
            }
          </InfoItem>
        })}
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

function useGetPayloadQuery({
  id,
  ...options
}) {
  return useQuery({
    queryKey: ["/payloads", id],
    queryFn: () => handleResponse(
      api.get(`/payloads/${id}`)
    ),
    ...options,
  });
}

function useGetCapturesQuery({
  id,
  page,
  limit,
  ...options
}) {
  const paginationOptions = {};
  if(page !== undefined) {
    paginationOptions.page = page;
  }
  if(limit !== undefined) {
    paginationOptions.limit = limit;
  }

  const params = new URLSearchParams(paginationOptions);
  const paramString = params.size > 0 ? params.toString() : "";

  return useQuery({
    queryKey: ["/payloads", id, page, limit],
    queryFn: () => handleResponse(
      api.get(`/payloads/${id}/captures${paramString}`)
    ),
    ...options,
  });
}

export default function Captures({ payload, ...props }) {
  const [selectedCapture, setSelectedCapture] = React.useState(null);

  function handleClose() {
    setSelectedCapture(null);
  }

  function handleCaptureItemClick(id) {
    setSelectedCapture(capture => {
      if(capture.id === id) {
        setSelectedCapture(null);
        return null;
      }
    });
  }

  let page, limit;

  const getPayloadQuery = useGetPayloadQuery({
    id: payload.id,
  });
  payload = getPayloadQuery.data?.itemByDomain("payload").data || payload;

  const getCapturesQuery = useGetCapturesQuery({
    id: payload.id,
    page,
    limit,
  });
  const captures = getCapturesQuery.data?.itemByDomain("payload").data;
  const meta = getCapturesQuery.data?.itemByDomain("meta").data;
  const scriptLink = `${API_BASE_URL}/use/${payload.id}`;

  return <Flex
    h="full"
    flexDir={"column"}
    w="full"

    {...props}
  >

    <Flex
      justifyContent={"space-between"}
      px={8}
      gap={4}
      w="full"
    >
      <Flex direction={"column"} fontSize={"sm"}>
        {
          payload.id === "root"
            ? <>
                <Heading mt={4} fontSize={36}>Captures</Heading>
              </>
            : <>
                <Heading mt={4} fontSize={36}>{payload?.name}</Heading>
                <Flex my={2} gap={2} alignItems="center">
                  <Heading size={"xs"}>Script URL: </Heading>
                  <Link href={scriptLink} target="_blank">{scriptLink}</Link>
                </Flex>
              </>
        }
      </Flex>
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
              ?.map(capture => {
                  return <CaptureItem
                    key={`capture-item-${capture.id}`}
                    capture={capture}
                    isActive={capture.id === selectedCapture?.id}
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
