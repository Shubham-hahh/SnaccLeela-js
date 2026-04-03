import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages (Global metadata, footer, etc.)
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "🏠 Home": "/",
      "🌿 Hazelbite": "/hazelbite/",
      "💣 Project Cannon": "/cannon/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        Component.Search(),
        Component.Darkmode(),
      ],
    }),
    // The Explorer handles internal navigation
    Component.DesktopOnly(Component.Explorer({
        title: "Navigation",
        folderClickBehavior: "collapse",
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    // We put the "Global Projects" links here for smart cross-linking
    Component.DesktopOnly(Component.RecentNotes({
      title: "Recent Notes",
      limit: 5
    })),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        Component.Search(),
        Component.Darkmode(),
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}