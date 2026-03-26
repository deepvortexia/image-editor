import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AI Image Editor — Edit Photos with AI | Deep Vortex AI",
  description: "Edit any photo with AI in seconds. Change backgrounds, transfer styles, apply dramatic lighting, remove objects and more — just describe what you want in plain English.",
  keywords: "AI image editor, edit photos with AI, AI photo editor, change background AI, style transfer AI, AI image editing, remove background, edit image with text, Deep Vortex AI, AI creative tools",
  authors: [{ name: "Deep Vortex AI" }],
  creator: "Deep Vortex AI",
  publisher: "Deep Vortex AI",
  robots: "index, follow, max-image-preview:large",
  metadataBase: new URL("https://image-editor.deepvortexai.com"),
  alternates: {
    canonical: "https://image-editor.deepvortexai.com",
  },
  openGraph: {
    type: "website",
    url: "https://image-editor.deepvortexai.com",
    title: "AI Image Editor — Edit Photos with AI | Deep Vortex AI",
    description: "Edit any photo with AI in seconds. Change backgrounds, transfer styles, apply dramatic lighting and more — just describe what you want.",
    siteName: "Deep Vortex AI",
    locale: "en_US",
    images: [{ url: "https://image-editor.deepvortexai.com/deepgoldremoveetiny.png", width: 512, height: 512, alt: "Deep Vortex AI Image Editor" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@deepvortexart",
    creator: "@deepvortexart",
    title: "AI Image Editor — Edit Photos with AI | Deep Vortex AI",
    description: "Edit any photo with AI in seconds. Change backgrounds, transfer styles, apply dramatic lighting and more.",
    images: ["https://image-editor.deepvortexai.com/deepgoldremoveetiny.png"],
  },
  icons: {
    icon: [
      { url: "https://image-editor.deepvortexai.com/favicon.ico?v=4", sizes: "any" },
      { url: "https://image-editor.deepvortexai.com/favicon.svg?v=4", type: "image/svg+xml" },
    ],
    apple: "https://image-editor.deepvortexai.com/apple-touch-icon.png?v=4",
  },
  other: {
    "theme-color": "#D4AF37",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Deep Vortex AI",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "application-name": "Deep Vortex AI Image Editor",
    "ai-content-declaration": "AI-powered creative tools",
    "perplexity-verification": "deepvortexai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="revisit-after" content="3 days" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://replicate.delivery" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Deep Vortex AI Image Editor",
              "description": "Edit and transform images with AI. Upload an image, describe your changes, get instant results.",
              "url": "https://image-editor.deepvortexai.com",
              "image": "https://image-editor.deepvortexai.com/deepgoldremoveetiny.png",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "4.99",
                "highPrice": "99.99",
                "offerCount": "5"
              },
              "creator": {
                "@type": "Organization",
                "name": "Deep Vortex AI",
                "url": "https://deepvortexai.com",
                "sameAs": [
                  "https://www.tiktok.com/@deepvortexai",
                  "https://x.com/deepvortexart",
                ]
              },
              "featureList": [
                "Edit Images with AI",
                "Change Backgrounds with AI",
                "AI Photo Editing",
                "Style Transfer",
                "Remove Backgrounds",
                "Apply Dramatic Lighting",
                "Text-Guided Transformations",
                "Instant Results",
                "Download Edited Images"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
