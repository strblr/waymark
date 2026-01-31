import { defineConfig } from "vocs";

export default defineConfig({
  title: "Waymark",
  description: "Type-safe routing for React",
  baseUrl: "https://waymarkrouter.com",
  iconUrl:
    "https://raw.githubusercontent.com/strblr/waymark/master/favicon.svg",
  ogImageUrl:
    "https://raw.githubusercontent.com/strblr/waymark/master/banner.svg",
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
      link: "https://github.com/strblr/waymark"
    }
  ],
  theme: {
    colorScheme: "dark",
    accentColor: "hsl(49, 99%, 63%)",
    variables: {
      color: {
        background: "#0B0D0F",
        codeBlockBackground: "#090a0b"
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
      link: "https://github.com/strblr/waymark"
    },
    {
      text: "Sponsor",
      link: "https://github.com/sponsors/strblr"
    }
  ]
});
