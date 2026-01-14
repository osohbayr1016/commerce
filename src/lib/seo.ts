import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function generateSEO({
  title = "E-Commerce",
  description = "E-Commerce website",
  image = "/og-image.jpg",
  url,
  type = "website",
}: SEOProps = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return {
    title,
    description,
    keywords: [
      "гутал",
      "цүнх",
      "эмэгтэй",
      "shoes",
      "bags",
      "women",
      "Mongolia",
      "Монгол",
      "shoez",
      "брэнд",
      "fashion",
    ],
    authors: [{ name: "E-Commerce" }],
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "E-Commerce",
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
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
    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}
