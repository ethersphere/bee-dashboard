import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Web3 from 'web3';

import BaseRouter from './routes/routes';


declare global {
  interface Window {
      ethereum: {};
      web3: {};
  }
}

const lightTheme = createMuiTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: '#0d1117', //'#111827',
      paper: '#161b22', //'#1f2937',
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#5e72e4' //'#3f51b5',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#1f2937',
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});


function App() {
  const [themeMode, toggleThemeMode] = useState('light');

  // const [accounts, setAccounts] = useState([]);
  // const [loadingAccounts, setLoadingAccounts] = useState(false);

  // const [network, setNetwork] = useState({});
  // const [loadingNetwork, setLoadingNetwork] = useState(false);

  // async loadWeb3() {
  //   if(window.ethereum) {
  //     window.web3 = new Web3(window.ethereum)
  //     await window.ethereum.enable()
  //     window.ethereum.on('chainChanged', (_chainId: string) => window.location.reload());
  //   } else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider)
  //   } else {
  //     console.log('Non ethereum supported browser detected. Consider installing metamask')
  //   }

  // }

  // async loadBlockChainData() {
  //   const web3 = window.web3
  //   const accounts = await web3.eth.getAccounts()
  //   setAccounts(accounts[0])

  //   const networkId = await web3.eth.net.getId()

  //   let chainData = await (await fetch('https://chainid.network/chains.json')).json()

  //   let network = 'unknown';
  //   network = chainData.find(chain => chain.networkId === networkId)

  //   if (networkId === 1) {
  //     network = 'mainNet';
  //   } else if (networkId === 3) {
  //     network = 'ropsten';
  //   } else if (networkId === 4) {
  //     network = 'rinkeby';
  //   } else if (networkId === 42) {
  //     network = 'kovan';
  //   } else if (networkId === 5) {
  //     network = 'goerli';
  //   }
  //   setNetwork(network)

  //   // const networkData = Decentragram.networks[networkId]
  //   // if (networkData) {
  //   //   const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address)
  //   //   this.setState({decentragram})
  //   //   this.setState({ loading: false})
  //   // } else {
  //   //   window.alert('Decentragram contract not deployed to detected network.')
  //   // }
  // }

  // interface Setup {
  //   loadWeb3: () => Promise<any>;
  //   loadBlockchainData: () => Promise<any>;
  // }

  useEffect(() => {
    // await loadWeb3()
    // await loadBlockchainData()

    let theme = localStorage.getItem('theme')

    if (theme) {
      toggleThemeMode(String(localStorage.getItem('theme')))
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      toggleThemeMode('dark')
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      toggleThemeMode(e.matches ? "dark" : "light")
    });

    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', e => {
      toggleThemeMode(e.matches ? "dark" : "light")
    })
  
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <Router>
          <BaseRouter />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
