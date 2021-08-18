import { useState, useEffect, useContext, ReactElement } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import AlertVersion from '../components/AlertVersion'
import { Container, CircularProgress } from '@material-ui/core'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import SideBar from '../components/SideBar'
import NavBar from '../components/NavBar'

import { Context } from '../providers/Bee'

import { RouteComponentProps } from 'react-router'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginLeft: '240px',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
      paddingBottom: '65px',
    },
  }),
)

interface Props extends RouteComponentProps {
  children?: ReactElement
}

const Dashboard = (props: Props): ReactElement => {
  const classes = useStyles()

  const [themeMode, toggleThemeMode] = useState('light')

  // FIXME: handle errrors and loading
  const { isLoading, lastUpdate, apiHealth, debugApiHealth } = useContext(Context)

  useEffect(() => {
    const theme = localStorage.getItem('theme')

    if (theme) {
      toggleThemeMode(String(localStorage.getItem('theme')))
    } else if (window?.matchMedia('(prefers-color-scheme: dark)')?.matches) {
      toggleThemeMode('dark')
    }

    window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', e => {
      toggleThemeMode(e?.matches ? 'dark' : 'light')
    })

    return () =>
      window?.matchMedia('(prefers-color-scheme: dark)')?.removeEventListener('change', e => {
        toggleThemeMode(e?.matches ? 'dark' : 'light')
      })
  }, [])

  return (
    <div>
      <SideBar
        {...props}
        themeMode={themeMode}
        health={apiHealth}
        nodeHealth={debugApiHealth}
        lastUpdate={lastUpdate}
      />
      <NavBar themeMode={themeMode} />
      <ErrorBoundary>
        <main className={classes.content}>
          <AlertVersion />
          {isLoading ? (
            <Container style={{ textAlign: 'center', padding: '50px' }}>
              <CircularProgress />
            </Container>
          ) : (
            props.children
          )}
        </main>
      </ErrorBoundary>
    </div>
  )
}

export default Dashboard
