import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Hazelbite",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "shubham-hahh.github.io/SnaccLeela-js/pages/public/Hazelbite",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Fredoka",           // Friendly, rounded professional headers
        body: "Quicksand",          // Clean, hand-printed feel for readability
        code: "IBM Plex Mono",       // Sharp and clear for your code blocks
      },
      colors: {
        lightMode: {
          light: "#fff5f7",         // Very soft pink-white background
          lightgray: "#fce4ec",     // Bubblegum pink borders/search bar
          gray: "#f06292",          // Meta info (Dates/Tags) in Pink
          darkgray: "#2c3e50",      // Main text (Deep Navy for readability)
          dark: "#1a237e",          // Headings in Royal Blue
          secondary: "#1565c0",     // Links in Bright Royal Blue
          tertiary: "#f48fb1",      // Hover states in Bubblegum Pink
          highlight: "rgba(244, 143, 177, 0.15)", // Pink internal link glow
          textHighlight: "#ff80ab88", // Pink highlighter
        },
        darkMode: {
          light: "#121212",         // Dark background
          lightgray: "#2d2d2d",     // Dark borders
          gray: "#f06292",          // Pink accents for meta info
          darkgray: "#e0e0e0",      // Light gray text
          dark: "#90caf9",          // Headings in soft Royal Blue
          secondary: "#448aff",     // Links in Neon Royal Blue
          tertiary: "#ff80ab",      // Hover states in bright Pink
          highlight: "rgba(68, 138, 255, 0.15)", // Blue link glow
          textHighlight: "#1565c088", // Blue highlighter
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