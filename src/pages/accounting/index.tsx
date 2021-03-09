import React from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Box, Typography } from '@material-ui/core';

import AccountCard from '../accounting/AccountCard';
import BalancesTable from './BalancesTable';
import ChequebookTable from './ChequebookTable';
import SettlementsTable from './SettlementsTable';
import EthereumAddressCard from '../../components/EthereumAddressCard';

import { useApiNodeAddresses, useApiChequebookAddress, useApiChequebookBalance, useApiPeerBalances, useApiPeerCheques, useApiSettlements } from '../../hooks/apiHooks';

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

    const { chequebookAddress, isLoadingChequebookAddress } = useApiChequebookAddress()
    const { chequebookBalance, isLoadingChequebookBalance } = useApiChequebookBalance()
    const { peerBalances, isLoadingPeerBalances } = useApiPeerBalances()
    const { nodeAddresses, isLoadingNodeAddresses } = useApiNodeAddresses()

    const { peerCheques, isLoadingPeerCheques } = useApiPeerCheques()
    const { settlements, isLoadingSettlements } = useApiSettlements()


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
          borderBottom: '1px solid #e8e8e8',
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
              color: '#3f51b5',
              opacity: 1,
            },
            '&$selected': {
              color: '#3f51b5',
              fontWeight: theme.typography.fontWeightMedium,
            },
            '&:focus': {
              color: '#3f51b5',
            },
          },
          selected: {},
        }),
      )((props: StyledTabProps) => <Tab disableRipple {...props} />);

    
    return (
        <div>
            <AccountCard
            chequebookAddress={chequebookAddress}
            isLoadingChequebookAddress={isLoadingChequebookAddress}
            chequebookBalance={chequebookBalance}
            isLoadingChequebookBalance={isLoadingChequebookBalance}
            settlements={settlements}
            isLoadingSettlements={isLoadingSettlements}
            />
            <EthereumAddressCard 
            nodeAddresses={nodeAddresses} 
            isLoadingNodeAddresses={isLoadingNodeAddresses}
            chequebookAddress={chequebookAddress}
            isLoadingChequebookAddress={isLoadingChequebookAddress} 
            />
            <AntTabs style={{ marginTop: '12px' }} value={value} onChange={handleChange} aria-label="ant example">
                <AntTab label="Balances" {...a11yProps(0)} />
                <AntTab label="Chequebook" {...a11yProps(1)} />
                <AntTab label="Settlements" {...a11yProps(2)} />
            </AntTabs>
            <TabPanel value={value} index={0}>
              <BalancesTable
              peerBalances={peerBalances}
              loading={isLoadingPeerBalances}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ChequebookTable
              peerCheques={peerCheques}
              loading={isLoadingPeerCheques}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <SettlementsTable
              nodeSettlements={settlements}
              loading={isLoadingSettlements}
              />
            </TabPanel>
        </div>
    )
}
