
import { Heading } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export default function HeadingLogo() {
  return <Heading
    m={4}
    textAlign={"center"}
    fontFamily={"fantasy"}
    fontWeight={"light"}
    px={2}
    shadow={"2xl"}
  >
    <Link to={"/"}>
      BlindReaper
    </Link>
  </Heading>
}
