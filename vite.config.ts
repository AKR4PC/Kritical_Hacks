import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { renderPrerenderedBody, renderStructuredData } from './scripts/prerender';
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  PRODUCTION_ORIGIN,
  SITEMAP_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_PUBLISHER,
  SITE_TITLE,
  absoluteUrl,
} from './scripts/site';

/**
 * Publishes the document a crawler receives.
 *
 * The experience is one long scroll-driven page, so there is exactly one URL
 * worth indexing. Everything a search engine or a chat client needs to judge
 * that URL — a canonical address, an Open Graph card, JSON-LD, and the page's
 * own words — is injected into the served HTML here rather than hand-written
 * into `index.html`, so that all of it derives from `scripts/site.ts` and
 * cannot drift out of agreement with itself.
 */
function publishDocument(): Plugin {
  const ogImage = absoluteUrl(OG_IMAGE_PATH);

  /** Compressed to one line so the served head stays small and readable. */
  const tag = (attrs: Record<string, string>) =>
    Object.entries(attrs)
      .map(([k, v]) => `${k}="${escAttr(v)}"`)
      .join(' ');

  const meta = (property: string, content: string) =>
    `    <meta ${tag({ property, content })} />`;
  /** Twitter reads `name`, not `property`; both are tolerated but only one is right. */
  const twitter = (name: string, content: string) =>
    `    <meta ${tag({ name, content })} />`;

  return {
    name: 'kriticalhacks:publish-document',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(
            // The marker is matched with its own indentation so the injected
            // block lands flush with the surrounding markup.
            '    <!--seo-head-->',
            [
              `    <link ${tag({ rel: 'canonical', href: `${PRODUCTION_ORIGIN}/` })} />`,
            `    <link ${tag({ rel: 'alternate', hreflang: 'en', href: `${PRODUCTION_ORIGIN}/` })} />`,
              '',
              meta('og:type', 'website'),
              meta('og:site_name', SITE_NAME),
              meta('og:title', SITE_TITLE),
              meta('og:description', SITE_DESCRIPTION),
              meta('og:url', `${PRODUCTION_ORIGIN}/`),
              meta('og:image', ogImage),
              meta('og:image:secure_url', ogImage),
              meta('og:image:type', 'image/png'),
              meta('og:image:width', String(OG_IMAGE_WIDTH)),
              meta('og:image:height', String(OG_IMAGE_HEIGHT)),
              meta('og:image:alt', `${SITE_NAME} — ${SITE_PUBLISHER}`),
              meta('og:locale', 'en_IN'),
              '',
              twitter('twitter:card', 'summary_large_image'),
              twitter('twitter:title', SITE_TITLE),
              twitter('twitter:description', SITE_DESCRIPTION),
              twitter('twitter:image', ogImage),
              twitter('twitter:image:alt', `${SITE_NAME} — ${SITE_PUBLISHER}`),
              '',
              `    <link ${tag({ rel: 'sitemap', type: 'application/xml', href: SITEMAP_URL })} />`,
            ].join('\n')
          )
          // The structured data has to sit in the head and must not be
          // self-closing; `<` is escaped inside the payload.
          .replace(
            '    <!--seo-structured-data-->',
            `    <script type="application/ld+json">\n${renderStructuredData()}\n    </script>`
          )
          // `</script>` inside a JSON payload would close the tag early.
          // The page's own words, so the served HTML is not an empty shell.
          .replace(
            '<div id="root"></div>',
            `<div id="root">\n    ${renderPrerenderedBody()}\n    </div>`
          );
      },
    },
    generateBundle() {
      // Emitted rather than committed, because both files have to carry the
      // absolute production origin. A committed copy is a copy that drifts.
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: renderRobotsTxt(),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: renderSitemap(),
      });
    },
  };
}

/**
 * `robots.txt`. The experience is one scroll-driven document, so the file's job
 * is to say which single URL is canonical and to keep crawl budget off the
 * large art that carries no indexable text.
 */
function renderRobotsTxt(): string {
  return `User-agent: *
Allow: /

# The experience is a single scroll-driven page, so there is exactly one URL
# worth indexing. Everything below exists to say so unambiguously.

# Deep links into a chapter collapse to the same document.
Disallow: /*?*

# Large art is linked from the page and carries no indexable text.
Disallow: /models/
Disallow: /*.glb

Sitemap: ${SITEMAP_URL}
`;
}

/** A one-URL sitemap, which is the honest description of this site. */
function renderSitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${PRODUCTION_ORIGIN}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

function escAttr(value: string): string {
  return value.replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

export default defineConfig({
  plugins: [react(), publishDocument()],
  build: {
    // The illustrations ship as files, never inlined, so their paths stay
    // individually addressable and the bundle stays cacheable.
    assetsInlineLimit: 0,
    // The prisoners illustration is 2.1 MB of path data that has to be measured
    // and drawn at runtime, so a single large chunk is expected here.
    chunkSizeWarningLimit: 1600,
  },
});