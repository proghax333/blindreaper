
import { Box, Button, Code, Divider, Flex, Heading, Image, Input, InputGroup, InputLeftElement, Link, Text } from "@chakra-ui/react";
import { ArrowDropDown, ArrowDropUp, Search } from "@emotion-icons/material";
import styled from "@emotion/styled";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
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

function CaptureItem({ capture }) {
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
  const paramString = params.toString() ? "?" + params.toString() : "";

  return useQuery({
    queryKey: ["/payloads", id, page, limit],
    queryFn: ({ signal }) => handleResponse(
      api.get(`/payloads/${id}/captures${paramString}`, {
        signal
      })
    ),
    ...options,
  });
}

function usePagination() {
  let [searchParams, setSearchParams] = useSearchParams();
  const options = {
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
  };

  function getData() {
    return options;
  }

  return {
    ...options,
    getData,
    setData: setSearchParams,
  }
}

export default function Captures({ payload, ...props }) {
  const queryClient = useQueryClient();
  const pagination = usePagination();

  const getPayloadQuery = useGetPayloadQuery({
    id: payload.id,
  });
  payload = getPayloadQuery.data?.itemByDomain("payload").data || payload;

  const getCapturesQuery = useGetCapturesQuery({
    id: payload.id,
    page: pagination.page,
    limit: pagination.limit,

    onSuccess: (data) => {
      if(capturesScrollableViewRef.current) {
        capturesScrollableViewRef.current.scrollTo(0, 0);
      }
    }
  });
  const captures = getCapturesQuery.data?.itemByDomain("payload").data;
  const meta = getCapturesQuery.data?.itemByDomain("meta").data;

  const scriptLink = `${API_BASE_URL}/use/${payload.id}`;

  function handlePageClick(page) {
    const { selected } = page;

    function changePage() {
      pagination.setData((data) => ({
        ...data,
        page: selected + 1,
      }))
    }

    if(getPayloadQuery.isFetching) {
      queryClient.cancelQueries({
        queryKey: ["/payloads", payload.id, pagination.page, pagination.limit],
      }).then(() => {
        changePage();
      });
    } else {
      changePage();
    }
  }

  const capturesScrollableViewRef = React.useRef();

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
        ref={capturesScrollableViewRef}
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
                  />
                }
              )
          }
        </CapturesList>
        {getCapturesQuery.isSuccess && <Flex>
          <CustomPaginate
            pageCount={meta?.totalPages || 1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            activeClassName="active"
            forcePage={(meta?.page || 1) - 1}
          />
        </Flex>}
      </Flex>
    </Flex>
  </Flex>
}

const CustomPaginate = styled(ReactPaginate)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style-type: none;
  margin: 0.30rem 0 1rem 0;

  li a {
    padding: 0.5rem 1rem;
    border: gray 1px solid;
    cursor: pointer;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    background-color: #0366d6;
    border-color: transparent;
    color: white;
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;
