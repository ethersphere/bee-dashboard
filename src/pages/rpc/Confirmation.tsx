import { Box, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { HistoryHeader } from '../../components/HistoryHeader'

export default function Confirmation(): ReactElement {
  return (
    <>
      <HistoryHeader>Connect to the blockchain</HistoryHeader>
      <Box mb={1}>
        <Typography style={{ fontWeight: 'bold' }}>Your node&apos;s RPC endpoint is set up correctly!</Typography>
      </Box>
      <Box mb={4}>
        <Typography>
          Lastly, you will need to top-up your node wallet. If you&apos;re not familiar with cryptocurrencies, you can
          start with a bank card.
        </Typography>
      </Box>
    </>
  )
}
