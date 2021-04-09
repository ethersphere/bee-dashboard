import { ReactElement, useState, ChangeEvent, ReactChild } from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Tabs, Tab, Box, Typography, Container, CircularProgress } from '@material-ui/core'

import AccountCard from '../accounting/AccountCard'
import BalancesTable from './BalancesTable'
import ChequebookTable from './ChequebookTable'
import SettlementsTable from './SettlementsTable'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'

import {
  useApiNodeAddresses,
  useApiChequebookAddress,
  useApiChequebookBalance,
  useApiPeerBalances,
  useApiPeerCheques,
  useApiSettlements,
  useApiHealth,
  useDebugApiHealth,
} from '../../hooks/apiHooks'

interface TabPanelProps {
  children?: ReactChild
  index: number
  value: number
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(3),
    },
  }),
)

export default function Accounting(): ReactElement {
  const [value, setValue] = useState(0)
  const classes = useStyles()

  const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue)
  }

  const { chequebookAddress, isLoadingChequebookAddress } = useApiChequebookAddress()
  const { chequebookBalance, isLoadingChequebookBalance } = useApiChequebookBalance()
  const { peerBalances, isLoadingPeerBalances } = useApiPeerBalances()
  const { nodeAddresses, isLoadingNodeAddresses } = useApiNodeAddresses()
  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  const { peerCheques, isLoadingPeerCheques } = useApiPeerCheques()
  const { settlements, isLoadingSettlements } = useApiSettlements()

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

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
            <Typography component="div">{children}</Typography>
          </Box>
        )}
      </div>
    )
  }

  const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: '#3f51b5',
    },
  })(Tabs)

  interface StyledTabProps {
    label: string
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
    }),
  )((props: StyledTabProps) => <Tab disableRipple {...props} />)

  return (
    <div>
      {
        // FIXME: this should be broken up
        /* eslint-disable no-nested-ternary */
        nodeHealth?.status === 'ok' && health ? (
          <div className={classes.root}>
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
            <div>
              <AntTabs style={{ marginTop: '12px' }} value={value} onChange={handleChange} aria-label="ant example">
                <AntTab label="Balances" {...a11yProps(0)} />
                <AntTab label="Chequebook" {...a11yProps(1)} />
                <AntTab label="Settlements" {...a11yProps(2)} />
              </AntTabs>
              <TabPanel value={value} index={0}>
                <BalancesTable peerBalances={peerBalances} loading={isLoadingPeerBalances} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ChequebookTable peerCheques={peerCheques} loading={isLoadingPeerCheques} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <SettlementsTable nodeSettlements={settlements} loading={isLoadingSettlements} />
              </TabPanel>
            </div>
          </div>
        ) : isLoadingHealth || isLoadingNodeHealth ? (
          <Container style={{ textAlign: 'center', padding: '50px' }}>
            <CircularProgress />
          </Container>
        ) : (
          <TroubleshootConnectionCard />
        ) /* eslint-enable no-nested-ternary */
      }
    </div>
  )
}
