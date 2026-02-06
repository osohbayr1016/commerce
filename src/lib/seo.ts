import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

const DEFAULT_METADATA_IMAGE = "/favicon.ico";

export function generateSEO({
  title = "MaayaaUvuu",
  description = "MaayaaUvuu",
  image = DEFAULT_METADATA_IMAGE,
  url,
  type = "website",
}: SEOProps = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maayaauvuu.com";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return {
    title,
    description,
    keywords: [
      "maayaauvuu",
      "maayaa uvuu",
      "maayaa uvuu mongolia",
      "maayaa uvuu mongolia shoes",
      "maayaa uvuu mongolia bags",
      "maayaa uvuu mongolia women",
      "maayaa uvuu mongolia men",
      "maayaa uvuu mongolia kids",
      "maayaa uvuu mongolia fashion",
      "maayaa uvuu website",
    ],
    authors: [{ name: "MaayaaUvuu " }],
    metadataBase: new URL(siteUrl),
    icons: { icon: DEFAULT_METADATA_IMAGE, shortcut: DEFAULT_METADATA_IMAGE, apple: DEFAULT_METADATA_IMAGE },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "MaayaaUvuu",
      images: [
        {
          url: fullImage,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
      locale: "mn_MN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {},
  };
}
