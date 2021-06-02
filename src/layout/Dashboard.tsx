import { useState, useEffect, ReactElement } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import AlertVersion from '../components/AlertVersion'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import SideBar from '../components/SideBar'
import NavBar from '../components/NavBar'

import { useApiHealth, useDebugApiHealth } from '../hooks/apiHooks'
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
  const { health } = useApiHealth()
  const { nodeHealth } = useDebugApiHealth()

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
      <SideBar {...props} themeMode={themeMode} health={health} nodeHealth={nodeHealth} />
      <NavBar themeMode={themeMode} />
      <ErrorBoundary>
        <main className={classes.content}>
          <AlertVersion />
          {props.children}
        </main>
      </ErrorBoundary>
    </div>
  )
}

export default Dashboard
