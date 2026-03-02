import { CircularProgress, Container } from '@mui/material'
import { ReactElement, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import PlusSquare from 'remixicon-react/AddBoxLineIcon'
import { makeStyles } from 'tss-react/mui'

import { ChainSync } from '../../../components/ChainSync'
import { Loading } from '../../../components/Loading'
import { SwarmButton } from '../../../components/SwarmButton'
import TroubleshootConnectionCard from '../../../components/TroubleshootConnectionCard'
import { CheckState, Context as BeeContext } from '../../../providers/Bee'
import { Context as StampsContext } from '../../../providers/Stamps'
import { ROUTES } from '../../../routes'
import StampsTable from '../../stamps/StampsTable'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'

const useStyles = makeStyles()(() => ({
  root: {
    width: '100%',
    display: 'grid',
  },
  actions: {
    display: 'flex',
    width: '100%',
    flex: '0 1 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
}))

export function AccountStamps(): ReactElement {
  const { classes } = useStyles()

  const navigate = useNavigate()

  const { stamps, isLoading, error, start, stop } = useContext(StampsContext)
  const { status } = useContext(BeeContext)

  useEffect(() => {
    if (!status.all) return
    start()

    return () => stop()
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  function navigateToNewStamp() {
    navigate(ROUTES.ACCOUNT_STAMPS_NEW_STANDARD)
  }

  return (
    <>
      <Header />
      <AccountNavigation active="STAMPS" />
      <div className={classes.root}>
        {error && (
          <Container style={{ textAlign: 'center', padding: '50px' }}>
            <Loading />
            <ChainSync />
          </Container>
        )}
        {!error && (
          <>
            <div className={classes.actions}>
              <SwarmButton onClick={navigateToNewStamp} iconType={PlusSquare}>
                Buy New Postage Stamp
              </SwarmButton>
              <div style={{ height: '5px' }}>{isLoading && <CircularProgress />}</div>
            </div>
            <StampsTable postageStamps={stamps} />
          </>
        )}
      </div>
    </>
  )
}
