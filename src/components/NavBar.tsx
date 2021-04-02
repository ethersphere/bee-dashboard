import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Toolbar, Chip, IconButton } from '@material-ui/core/';

import { Sun, Moon } from 'react-feather';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    network: {

    }
  }),
);

interface Props {
  toggleThemeMode: () => void
  themeMode: ThemeMode
}

export default function SideBar({toggleThemeMode, themeMode}: Props) {

  const classes = useStyles();

  return (
    <div>
      <div style={{ display: 'fixed' }} className={classes.appBar}>
        <Toolbar style={{ display: 'flex' }}>
          <Chip
            style={{ marginLeft: '7px' }}
            size="small"
            label='Goerli'
            className={classes.network}
          />
          <div style={{ width: '100%' }}>
            <div style={{ float: 'right' }} >
              <IconButton style={{ marginRight: '10px' }} aria-label="dark-mode" onClick={toggleThemeMode}>
                {themeMode === 'dark' ?
                  <Moon />
                  :
                  <Sun />
                }
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </div>
    </div>
  );
}
