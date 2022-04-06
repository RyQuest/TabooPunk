/*  ./components/Navbar.jsx     */
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import styles from "../styles/navbar.module.css";
import twitter from "../images/twitter.webp";
import discord from "../images/discord.webp";
import opensea from "../images/os.webp";
import logo from "../images/apple-touch-icon.png";

export const injected = new InjectedConnector();

export const Navbar = () => {
  const [hasMetamask, setHasMetamask] = useState(false);
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
    error,
    setError,
    accountsChanged,
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

  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleToggle = () => {
    setNavbarOpen(true);
  };

  return (
    // <div className={styles.container}>
    <nav>
      <ul className={styles.menu}>
        <li className={styles.logo}>
          <a href="#">
            <Image src={logo} alt="logo" />
          </a>
        </li>
        <li className={styles.items}>
          <a
            href="https://discord.com/invite/fuYDVuVwnd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={discord} alt="Discord" />
          </a>
        </li>
        <li className={styles.items}>
          <a
            href="https://twitter.com/taboo_io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={twitter} alt="Twitter" />
          </a>
        </li>
        <li className={styles.items}>
          <a
            href="https://opensea.io/collection/taboopunks"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={opensea} alt="Opensea" />
          </a>
        </li>
        <li className={styles.items}>
          {active ? (
            <span className={styles.accountText}>
              {account.substring(0, 7) +
                "....." +
                account.substring(account.length - 5)}
            </span>
          ) : (
            <button
              className={(styles.walletbtn, styles.btn)}
              onClick={() => connect()}
              id="connectWallet"
            >
              <span>Connect Wallet</span>
            </button>
          )}
        </li>
        <li
          className={[styles.toggle, `menu ${navbarOpen ? "active" : ""}`].join(
            " "
          )}
        >
          <a href="#" onClick={() => handleToggle()}>
            ☰
          </a>
        </li>
      </ul>
    </nav>
    // </div>
  );
};
