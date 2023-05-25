import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import Hotjar from "@hotjar/browser";

const siteId = 3505619;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
