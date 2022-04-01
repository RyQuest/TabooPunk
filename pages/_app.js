import "../styles/globals.css";
import React from "react";
import SnackbarProvider from "react-simple-snackbar";
import ReactDom from "react-dom";
import { Navbar } from "../components/navbar";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const getLibrary = (provider) => {
  return new Web3Provider(provider);
};

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <SnackbarProvider>
        <Navbar />
        <Component {...pageProps} />
      </SnackbarProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
