import Hotjar from "@hotjar/browser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";

// const siteId = 3505619;
// const hotjarVersion = 6;

// Hotjar.init(siteId, hotjarVersion);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
          <Analytics />
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
}
