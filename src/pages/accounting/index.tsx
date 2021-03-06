import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Tabs, Tab, AppBar, Box, Typography } from '@material-ui/core';

import { beeDebugApi } from '../../services/bee';
import AccountCard from '../accounting/AccountCard';
import BalancesTable from './BalancesTable';
import ChequebookTable from './ChequebookTable';
import EthereumAddressCard from '../status/EthereumAddressCard';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}


function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Accounting() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const [chequebookAddress, setChequebookAddress] = useState({ chequebookaddress: '' });
    const [loadingChequebookAddress, setLoadingChequebookAddress] = useState(false);

    const [chequebookBalance, setChequebookBalance] = useState({ totalBalance: '', availableBalance: ''});
    const [loadingChequebookBalance, setLoadingChequebookBalance] = useState(false);

    const [peerBalances, setPeerBalances] = useState({ balances: [{peer: '', balance: 0 }] });
    const [loadingPeerBalances, setLoadingPeerBalances] = useState(false);

    const [peerCheques, setPeerCheques] = useState({ lastcheques: [{peer: '', lastsent: {beneficiary: '', chequebook: '', payout: 0}, lastreceived: {beneficiary: '', chequebook: '', payout: 0} }] });
    const [loadingPeerCheques, setLoadingPeerCheques] = useState(false);

    const [nodeAddresses, setNodeAddresses] = useState({ overlay: '', underlay: [""], ethereum: '', public_key: '', pss_public_key: ''});
    const [loadingNodeAddresses, setLoadingNodeAddresses] = useState(false);

    const fetchChequebookAddress = () => {
        setLoadingChequebookAddress(true)
        beeDebugApi.chequebook.address()
        .then(res => {
            let address: any = res.data;
            setLoadingChequebookAddress(false)
            setChequebookAddress(address)
        })
        .catch(error => {
            console.log(error)
            setLoadingChequebookAddress(false)
        })
    }

    const fetchChequebookBalance = () => {
        setLoadingChequebookBalance(true)
        beeDebugApi.chequebook.balance()
        .then(res => {
            let balance: any = res.data;
            setLoadingChequebookBalance(false)
            setChequebookBalance(balance)
        })
        .catch(error => {
            console.log(error)
            setLoadingChequebookBalance(false)
        })
    }

    const fetchPeerBalances = () => {
      setLoadingPeerBalances(true)
      beeDebugApi.balance.balances()
      .then(res => {
          let peerBalances: any = res.data;
          setLoadingPeerBalances(false)
          setPeerBalances(peerBalances)
      })
      .catch(error => {
          console.log(error)
          setLoadingPeerBalances(false)
      })
    }

    const fetchNodeAddresses = () => {
      setLoadingNodeAddresses(true)
      beeDebugApi.connectivity.addresses()
      .then(res => {
          let addresses: any = res.data;
          setLoadingNodeAddresses(false)
          setNodeAddresses(addresses)
      })
      .catch(error => {
          console.log(error)
          setLoadingNodeAddresses(false)
      })
    }

    const fetchPeerCheques = () => {
      setLoadingPeerCheques(true)
      beeDebugApi.chequebook.getLastCheques()
      .then(res => {
          let lastcheques: any = res.data;
          setLoadingPeerCheques(false)
          setPeerCheques(lastcheques)
      })
      .catch(error => {
          console.log(error)
          setLoadingPeerCheques(false)
      })
    }

    useEffect(() => {
        fetchChequebookAddress()
        fetchChequebookBalance()
        fetchPeerBalances()
        fetchNodeAddresses()
        fetchPeerCheques()
    }, []);

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box style={{ marginTop: '20px' }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }

      const AntTabs = withStyles({
        root: {
          borderBottom: '2px solid #e8e8e8',
        },
        indicator: {
          backgroundColor: '#3f51b5',
        },
      })(Tabs);

      interface StyledTabProps {
        label: string;
      }
      
      const AntTab = withStyles((theme: Theme) =>
        createStyles({
          root: {
            textTransform: 'none',
            minWidth: 72,
            backgroundColor: 'transparent',
            fontWeight: theme.typography.fontWeightRegular,
            marginRight: theme.spacing(4),
            fontFamily: [
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
              '"Segoe UI Symbol"',
            ].join(','),
            '&:hover': {
              color: '#40a9ff',
              opacity: 1,
            },
            '&$selected': {
              color: '#3f51b5',
              fontWeight: theme.typography.fontWeightMedium,
            },
            '&:focus': {
              color: '#40a9ff',
            },
          },
          selected: {},
        }),
      )((props: StyledTabProps) => <Tab disableRipple {...props} />);

    
    return (
        <div>
            <AccountCard
            chequebookAddress={chequebookAddress}
            loadingChequebookAddress={loadingChequebookAddress}
            chequebookBalance={chequebookBalance}
            loadingChequebookBalance={loadingChequebookBalance}
            />
            <EthereumAddressCard 
            nodeAddresses={nodeAddresses} 
            loadingNodeAddresses={loadingNodeAddresses}
            chequebookAddress={chequebookAddress}
            loadingChequebookAddress={loadingChequebookAddress} 
            />
            <AntTabs style={{ marginTop: '12px' }} value={value} onChange={handleChange} aria-label="ant example">
                <AntTab label="Balances" {...a11yProps(0)} />
                <AntTab label="Chequebook" {...a11yProps(1)} />
                <AntTab label="Settlements" {...a11yProps(2)} />
            </AntTabs>
            <TabPanel value={value} index={0}>
              <BalancesTable
              peerBalances={peerBalances}
              loadingPeerBalances={loadingPeerBalances}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ChequebookTable
              peerCheques={peerCheques}
              loadingPeerCheques={loadingPeerCheques}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
            Item Three
            </TabPanel>
        </div>
    )
}
