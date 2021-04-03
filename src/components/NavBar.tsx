import { useState, ReactElement } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Toolbar, Chip, IconButton } from '@material-ui/core/'

import { Sun, Moon } from 'react-feather'

const drawerWidth = 240

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    network: {},
  }),
)
interface Props {
  themeMode: string
}

export default function SideBar(props: Props): ReactElement {
  const [darkMode, toggleDarkMode] = useState(false)

  const switchTheme = () => {
    const theme = localStorage.getItem('theme')

    if (theme) {
      localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light')
    } else {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }

    toggleDarkMode(!darkMode)
    window.location.reload()
  }

  const classes = useStyles()

  return (
    <div>
      <div style={{ display: 'fixed' }} className={classes.appBar}>
        <Toolbar style={{ display: 'flex' }}>
          <Chip style={{ marginLeft: '7px' }} size="small" label="Goerli" className={classes.network} />
          <div style={{ width: '100%' }}>
            <div style={{ float: 'right' }}>
              <IconButton style={{ marginRight: '10px' }} aria-label="dark-mode" onClick={() => switchTheme()}>
                {props.themeMode === 'dark' ? <Moon /> : <Sun />}
              </IconButton>
              {/* <Chip 
              label="Connect Wallet"
              color="primary"
              /> */}
            </div>
          </div>
        </Toolbar>
      </div>
    </div>
  )
}
