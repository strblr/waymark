import { defineConfig } from "vocs";

export default defineConfig({
  title: "Waymark",
  description: "Lightweight type-safe router for React",
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
    }
  ]
});
