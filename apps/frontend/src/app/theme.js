import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: props => ({
    body: {
      bg: mode('#f0e7db', '#101012')(props)
    }
  })
}

const components = {
  // Heading: {
  //   variants: {
  //     'section-title': {
  //       textDecoration: 'underline',
  //       fontSize: 20,
  //       textUnderlineOffset: 6,
  //       textDecorationColor: '#525252',
  //       textDecorationThickness: 4,
  //       marginTop: 3,
  //       marginBottom: 4
  //     }
  //   }
  // },
  // Link: {
  //   baseStyle: props => ({
  //     color: mode('#3d7aed', '#ff63c3')(props),
  //     textUnderlineOffset: 3
  //   })
  // }
  Text: {
    variants: {
      'input-label': (props) => ({
        fontSize: "sm",
        fontWeight: "bold"
      })
    }
  },
  Heading: {
    variants: {
      'small': {
        fontSize: "xl"
      }
    }
  }
}

const fonts = {
  // heading: "'M PLUS Rounded 1c'"
  heading: "Montserrat",
  body: "Roboto",
}

const colors = {
  // grassTeal: '#88ccca'
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
}

export const theme = extendTheme({ config, styles, components, fonts, colors })
