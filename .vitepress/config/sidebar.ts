import type { DefaultTheme } from "@/config";

export const sidebar: DefaultTheme.Config["sidebar"] = {
  "/": [
    {
      text: "Guide",
      items: [
        {
          text: "Getting Started",
          link: "/guide/"
        },
        {
          text: "Why using Pipelight ?",
          link: "/guide/why"
        },
        {
          text: "Command line usage",
          link: "/guide/cli"
        },
        {
          text: "Basic pipeline definition",
          link: "/guide/config"
        },
        {
          text: "Raw and Pretty logs",
          link: "/guide/logs"
        },
        {
          text: "How it works ?",
          link: "/guide/internal"
        }
      ]
    },
    {
      text: "Helpers",
      items: [
        {
          text: "Composition API",
          link: "/helpers/composition"
        },
        {
          text: "Docker",
          link: "/helpers/docker"
        }
      ]
    },
    {
      text: "Cookbook",
      items: [
        {
          text: "Usefull Tips",
          link: "/cookbook/tips"
        },
        {
          text: "Deployement Strategies",
          link: "/cookbook/strategies"
        }
      ]
    },
    {
      text: "Next",
      items: [
        {
          text: "Why another CICD tool ?",
          link: "/roadmap/the_story"
        },
        {
          text: "Roadmap",
          link: "/roadmap/index"
        },
        {
          text: "Breaking Changes",
          link: "/roadmap/breaking"
        },
        {
          text: "Changelog",
          link: "/roadmap/changelog"
        }
      ]
    }
  ]
};
