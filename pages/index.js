import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { abi } from "../constants/abis";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSnackbar } from "react-simple-snackbar";
// import { Navbar } from "../components/navbar";
//merkle tree param
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const tokens = require("../constants/tokens.json");

export const injected = new InjectedConnector();

export default function Home() {
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [hasMetamask, setHasMetamask] = useState(false);
  const [amount, setAmount] = useState(1);
  const [verified, setVerified] = useState(false);
  const [proofs, setProof] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [PersonalAmount, setPersonalAmount] = useState(0);
  const [claimed, setClaimed] = useState("");

  const contractAddress = "0x769563387abe7f5d0609a79fd538f426243e4adf";

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
      //    inWL();
    }
  });

  const {
    active,
    activate,
    chainId,
    account,
    onChangeAccount,
    library: provider,
  } = useWeb3React();

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function inWL() {
    if (active) {
      //get address wl
      let tab = [];
      tokens.map((token) => {
        tab.push(token.address);
      });
      const leaves = tab.map((addr) => keccak256(addr));
      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      const root = tree.getRoot().toString("hex");
      const leaf = keccak256(account);
      const proof = tree.getHexProof(leaf);
      console.log("root:", "0x" + root); //0x8bef28f0ac54da10614be726622f54ce02e3736d8f100ee126f3bfed268ef0ef
      // console.log("proof:", proof); // true
      setProof(proof);
      setVerified(tree.verify(proof, leaf, root));
      // console.log("verified?", tree.verify(proof, leaf, root)); // true
    }
  }

  useEffect(() => {
    if (active) {
      inWL();
      info();
    }
    // onChangeAccount ? info() : null;
  }, [active]);

  async function info() {
    if (active) {
      const signer = provider.getSigner();
      // const contractAddress = "0x10C33D5E79d3e76d099247aBb72B6d6C3c3c24B5";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        let totalAmountClaimed = await contract.amountClaimed();
        console.log(ethers.utils.formatUnits(totalAmountClaimed, 0));
        setTotalAmount(ethers.utils.formatUnits(totalAmountClaimed, 0));
      } catch (error) {
        console.log(error);
      }

      try {
        let amountClaimed = await contract.nftAmount(account);
        console.log(ethers.utils.formatUnits(amountClaimed, 0));
        let amountTobeClaimed = ethers.utils.formatUnits(amountClaimed, 0);
        setPersonalAmount(amountTobeClaimed);
      } catch (error) {
        console.log(error);
      }
      try {
        let eligble = await contract.whitelistClaimed(account);
        console.log(eligble);
        setClaimed(eligble);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  async function execute() {
    if (active) {
      const signer = provider.getSigner();
      // const contractAddress = "0x10C33D5E79d3e76d099247aBb72B6d6C3c3c24B5";
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        if (verified) {
          console.log(PersonalAmount, proofs);
          let sym = await contract.whitelistMint(PersonalAmount, proofs);
          console.log(sym);
        }
      } catch (error) {
        openSnackbar(error.message);
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Taboo Claiming dapp</title>
        <meta name="description" content="Taboo Dapp Nft claim" />
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Hurricane&family=Space+Mono:ital,wght@1,700&display=swap"
          rel="stylesheet"
        /> */}

        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Claim Your TABOOPUNK!</h1>
        <div className={styles.grid}>
          {/* <h2>Claim your Taboo Nft</h2> */}
          {active ? (
            <div className={styles.card}>
              <p>Already Claimed {totalAmount}/4000</p>

              <p>
                {claimed || PersonalAmount < 1 ? (
                  <span className={styles.warning}>
                    You Arent eligible to claim{" "}
                  </span>
                ) : (
                  <p>You are eligble to claim {PersonalAmount} NFTs </p>
                )}
              </p>
              {/* <div className={styles.showamount}>{amount} </div> */}
              {/* hasMetamask */}
              <div>
                <br></br>
                {/* <br></br>
          <button
            className={styles.buttonsign}
            onClick={() => {
              setAmount(amount + 1);
            }}
          >
            +
          </button>
          <button
            className={styles.buttonsign}
            onClick={() => {
              setAmount(amount - 1);
            }}
          >
            -
          </button>
          <br></br> */}

                <br></br>
                {hasMetamask ? (
                  active ? (
                    verified ? (
                      <button
                        className={styles.buttonsign}
                        disabled={!verified || claimed || PersonalAmount < 1}
                        onClick={() => execute()}
                      >
                        Claim
                      </button>
                    ) : (
                      <p className={styles.warning}>You are not Whiltelisted</p>
                    )
                  ) : null
                ) : (
                  openSnackbar(
                    <a href="#" onClick={() => connect()}>
                      Connect to metamask
                    </a>
                  )
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://discord.com/invite/fuYDVuVwnd"
          target="_blank"
          rel="noopener noreferrer"
          // className={styles.herobtn}
        >
          Find us on Discord
        </a>
      </footer>
    </div>
  );
}
