import type { Metadata } from "next";

interface BuildMetadataOpts {
  title: string;
  description?: string;
  ogImage?: string;
  siteName?: string;
  url?: string;
}

export function buildMetadata({
  title,
  description,
  ogImage,
  siteName,
  url,
}: BuildMetadataOpts): Metadata {
  const metadata: Metadata = {
    title,
    description: description ?? undefined,
    openGraph: {
      title,
      description: description ?? undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      ...(siteName ? { siteName } : {}),
      ...(url ? { url } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };

  return metadata;
}

type JsonLdOpts =
  | {
      type: "WebSite";
      name: string;
      url: string;
      description?: string;
    }
  | {
      type: "Article";
      headline: string;
      description?: string;
      image?: string;
      datePublished?: string;
      dateModified?: string;
      author?: { name: string; url?: string };
    }
  | {
      type: "Organization";
      name: string;
      url: string;
      logo?: string;
      description?: string;
    };

export function buildJsonLd(opts: JsonLdOpts): string {
  let data: Record<string, unknown>;

  switch (opts.type) {
    case "WebSite":
      data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: opts.name,
        url: opts.url,
        ...(opts.description ? { description: opts.description } : {}),
      };
      break;

    case "Article":
      data = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: opts.headline,
        ...(opts.description ? { description: opts.description } : {}),
        ...(opts.image ? { image: opts.image } : {}),
        ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
        ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
        ...(opts.author
          ? {
              author: {
                "@type": "Person",
                name: opts.author.name,
                ...(opts.author.url ? { url: opts.author.url } : {}),
              },
            }
          : {}),
      };
      break;

    case "Organization":
      data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: opts.name,
        url: opts.url,
        ...(opts.logo
          ? { logo: { "@type": "ImageObject", url: opts.logo } }
          : {}),
        ...(opts.description ? { description: opts.description } : {}),
      };
      break;
  }

  return JSON.stringify(data);
}
