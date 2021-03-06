/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: "Codering's Knowledge" /* title for your website */,
  tagline: 'A website for learning',
  url: 'https://codering.github.io' /* your website url */,
  baseUrl: '/knowledge/' /* base url for your project */,
  projectName: 'knowledge',
  algolia: {
    apiKey: "35661468ccd73ff72b970d01662bde7b",
    indexName: "codering"
  },
  headerLinks: [
    {search: true },
    {doc: 'nginx_basic_auth', label: 'Docs'},
    {doc: 'java/juc_object_lock', label: 'Java Concurrency'},
  //  {doc: 'doc4', label: 'API'},
  //  {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  //  {page: 'about-slash', label: 'About/'},
  ],
  noIndex: false,
  users,
  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: 'Copyright © ' + new Date().getFullYear() + ' Codering',
  organizationName: 'codering', // or set an env variable ORGANIZATION_NAME
  projectName: 'knowledge', // or set an env variable PROJECT_NAME
  usePrism: ['jsx'],
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'atom-one-dark',
  },
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-blocks-buttons.js'
  ],
  stylesheets: ['/css/code-blocks-buttons.css'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/codering/knowledge',
  onPageNav: 'separate',
  cleanUrl: true,
  scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100,
  },
  enableUpdateTime: true
};

module.exports = siteConfig;
