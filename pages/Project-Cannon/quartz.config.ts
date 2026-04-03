import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Project Cannon",
    pageTitleSuffix: " 🚀",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "Shubham-hahh.github.io/SnaccLeela-js/pages/ProjectCannon/",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Gloria Hallelujah", // Handwritten and sketchy
        body: "Patrick Hand",        // Clean but still handwritten
        code: "IBM Plex Mono",       // Keep code sharp
      },
      colors: {
        lightMode: {
          light: "#ffffff",          // Pure white
          lightgray: "#fce4ec",      // Soft pink borders
          gray: "#f06292",           // Meta text (Bubblegum Pink)
          darkgray: "#2c3e50",       // Readable dark text
          dark: "#1a237e",           // Titles (Royal Blue)
          secondary: "#2979ff",      // Links (Electric Blue)
          tertiary: "#ff4081",       // Hover state (Neon Pink)
          highlight: "rgba(41, 121, 255, 0.1)", 
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#0a0b10",          // Deep space blue/black
          lightgray: "#1e1e2e",      // Darker containers
          gray: "#f06292",           // Pink accents
          darkgray: "#cdd6f4",       // Soft white text
          dark: "#89b4fa",           // Headings (Sky Royal Blue)
          secondary: "#ff79c6",      // Links (Electric Pink)
          tertiary: "#8be9fd",       // Hover state (Cyan)
          highlight: "rgba(255, 121, 198, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config