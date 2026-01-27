import { defineConfig } from "vocs";

export default defineConfig({
  title: "Waymark",
  description: "Type-safe routing for React",
  baseUrl: "https://waymark.strblr.workers.dev",
  iconUrl:
    "https://raw.githubusercontent.com/strblr/waymark/master/favicon.svg",
  font: {
    google: "Inter"
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
        background: "black"
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
