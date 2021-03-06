import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Tabs, Tab, AppBar, Box, Typography } from '@material-ui/core';

import { beeDebugApi } from '../../services/bee';
import AccountCard from '../accounting/AccountCard';

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

    const fetchChequebookAddress = () => {
        setLoadingChequebookAddress(true)
        beeDebugApi.chequebook.address()
        .then(res => {
            console.log(res.data)
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
            console.log(res.data)
            let balance: any = res.data;
            setLoadingChequebookBalance(false)
            setChequebookBalance(balance)
        })
        .catch(error => {
            console.log(error)
            setLoadingChequebookBalance(false)
        })
    }

    useEffect(() => {
        fetchChequebookAddress()
        fetchChequebookBalance()
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
              <Box p={3}>
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
            <AntTabs style={{ marginTop: '12px' }} value={value} onChange={handleChange} aria-label="ant example">
                <AntTab label="Balances" {...a11yProps(0)} />
                <AntTab label="Chequebook" {...a11yProps(1)} />
                <AntTab label="Settlements" {...a11yProps(2)} />
            </AntTabs>
            <TabPanel value={value} index={0}>
            Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
            Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
            Item Three
            </TabPanel>
        </div>
    )
}
