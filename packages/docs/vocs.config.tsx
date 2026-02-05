import { defineConfig } from "vocs";

export default defineConfig({
  title: "TypeRoute",
  description:
    "Type-safe React router that just works - simple setup, full autocomplete, 4kB gzipped",
  baseUrl: "https://typeroute.com",
  iconUrl:
    "https://raw.githubusercontent.com/strblr/typeroute/master/favicon.svg",
  ogImageUrl:
    "https://raw.githubusercontent.com/strblr/typeroute/master/banner.svg",
  font: {
    default: {
      google: "Inter"
    },
    mono: {
      google: "JetBrains Mono"
    }
  },
  socials: [
    {
      icon: "github",
      link: "https://github.com/strblr/typeroute"
    }
  ],
  theme: {
    colorScheme: "dark",
    accentColor: "hsl(49, 99%, 63%)",
    variables: {
      color: {
        background: "rgb(13, 17, 23)",
        background2: "rgb(21, 27, 35)",
        background3: "rgb(21, 27, 35)",
        codeBlockBackground: "rgb(21, 27, 35)"
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600"
      },
      borderRadius: {
        "0": "0",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px"
      }
    }
  },
  topNav: [
    {
      text: "Docs",
      link: "/"
    },
    {
      text: "GitHub",
      link: "https://github.com/strblr/typeroute"
    },
    {
      text: "Sponsor",
      link: "https://github.com/sponsors/strblr"
    }
  ]
});
