import { ReactElement, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { ListItem, Typography, Grid, IconButton, Tooltip } from '@material-ui/core'
import { Eye, Minus } from 'react-feather'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    header: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(0.25),
    },
    tooltip: {
      cursor: 'pointer',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        '@media (hover: none)': {
          textDecoration: theme.palette.primary.main,
        },
      },
    },
  }),
)

interface Props {
  label: string
  value: string
}

export default function ExpandableListItemKey({ label, value }: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)

  return (
    <ListItem className={classes.header}>
      <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" style={{ overflowWrap: 'break-word' }}>
            {label}
          </Typography>
          <Typography variant="body2">
            <div>
              {!open && (
                <Tooltip title="Copy" placement="top">
                  <CopyToClipboard text={value}>
                    <span className={classes.tooltip}>{`${value.substr(0, 8)}[...]${value.substr(
                      value.length - 8,
                      8,
                    )}`}</span>
                  </CopyToClipboard>
                </Tooltip>
              )}
              <IconButton size="small">
                {open ? <Minus onClick={toggleOpen} strokeWidth={1} /> : <Eye onClick={toggleOpen} strokeWidth={1} />}
              </IconButton>
            </div>
          </Typography>
        </Grid>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Tooltip title="Copy" placement="top">
            <CopyToClipboard text={value}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                style={{ marginTop: 16, marginBottom: 16 }}
                className={classes.tooltip}
              >
                {typeof value === 'string' &&
                  value.match(/.{1,8}/g)?.map((s, i) => (
                    <Grid item key={i} style={{ marginRight: 8 }}>
                      <Typography variant="body2">{s}</Typography>
                    </Grid>
                  ))}
              </Grid>
            </CopyToClipboard>
          </Tooltip>
        </Collapse>
      </Grid>
    </ListItem>
  )
}
