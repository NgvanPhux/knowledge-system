// @ts-check

const config = {
  title: 'Knowledge System',
  tagline: 'Engineering Knowledge Base',
  favicon: 'img/favicon.ico',

  url: 'http://localhost',
  baseUrl: '/',

  organizationName: 'tong-hop-kien-thuc',
  projectName: 'knowledge-system',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          path: './docs',
          sidebarPath: require.resolve('./sidebars.js'),
          include: ['**/*.{md,mdx}'],
          sidebarCollapsible: true,
        },

        blog: false,

        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    [
      require.resolve(
        '@easyops-cn/docusaurus-search-local'
      ),
      {
        hashed: true,

        language: ['en', 'vi'],

        indexDocs: true,
        indexBlog: false,
        indexPages: true,

        docsRouteBasePath: '/',

        highlightSearchTermsOnTargetPage: true,

        explicitSearchResultPath: true,

        searchBarPosition: 'right',

        searchBarShortcut: true,
        searchBarShortcutHint: true,
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Knowledge System',

      items: [
        {
          to: '/',
          label: 'Docs',
          position: 'left',
        },

        {
          to: '/notes',
          label: '🛠 Note thông tin',
          position: 'left',
        },
      ],
    },

    footer: {
      style: 'dark',

      copyright: `Copyright © ${new Date().getFullYear()} VĂN PHỤC X CHATGPT`,
    },

    prism: {
      additionalLanguages: ['python', 'bash'],
    },
  },
};

module.exports = config;