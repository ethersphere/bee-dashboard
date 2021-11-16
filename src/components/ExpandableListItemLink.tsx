import { Grid, IconButton, ListItem, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { OpenInNewSharp } from '@material-ui/icons'
import { ReactElement, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing(0.25),
      borderLeft: `${theme.spacing(0.25)}px solid rgba(0,0,0,0)`,
      wordBreak: 'break-word',
    },
    headerOpen: {
      borderLeft: `${theme.spacing(0.25)}px solid ${theme.palette.primary.main}`,
    },
    openLinkIcon: {
      cursor: 'pointer',
      padding: theme.spacing(1),
      borderRadius: 0,
      '&:hover': {
        backgroundColor: '#fcf2e8',
        color: theme.palette.primary.main,
      },
    },
    content: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    keyMargin: {
      marginRight: theme.spacing(1),
    },
    copyValue: {
      cursor: 'pointer',
      padding: theme.spacing(1),
      borderRadius: 0,
      '&:hover': {
        backgroundColor: '#fcf2e8',
        color: theme.palette.primary.main,
      },
    },
  }),
)

interface Props {
  label: string
  value: string
}

export default function ExpandableListItemLink({ label, value }: Props): ReactElement | null {
  const classes = useStyles()
  const [copied, setCopied] = useState(false)

  const tooltipClickHandler = () => setCopied(true)
  const tooltipCloseHandler = () => setCopied(false)

  return (
    <ListItem className={classes.header}>
      <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          {label && <Typography variant="body1">{label}</Typography>}
          <Typography variant="body2">
            <div>
              <span className={classes.copyValue}>
                <Tooltip title={copied ? 'Copied' : 'Copy'} placement="top" arrow onClose={tooltipCloseHandler}>
                  <CopyToClipboard text={value}>
                    <span onClick={tooltipClickHandler}>{value.slice(0, 19)}...</span>
                  </CopyToClipboard>
                </Tooltip>
              </span>
              <IconButton size="small" className={classes.openLinkIcon}>
                <OpenInNewSharp onClick={() => window.open(value)} strokeWidth={1} />
              </IconButton>
            </div>
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  )
}
