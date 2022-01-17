import { Grid, IconButton, ListItem, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ArrowForward, OpenInNewSharp } from '@material-ui/icons'
import { ReactElement, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useNavigate } from 'react-router'

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
  link?: string
  navigationType?: 'NEW_WINDOW' | 'HISTORY_PUSH'
  allowClipboard?: boolean
}

export default function ExpandableListItemLink({
  label,
  value,
  link,
  navigationType = 'NEW_WINDOW',
  allowClipboard = true,
}: Props): ReactElement | null {
  const classes = useStyles()
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const tooltipClickHandler = () => setCopied(true)
  const tooltipCloseHandler = () => setCopied(false)

  const displayValue = value.length > 22 ? value.slice(0, 19) + '...' : value

  function onNavigation() {
    if (navigationType === 'NEW_WINDOW') {
      window.open(link || value)
    } else {
      navigate(link || value)
    }
  }

  return (
    <ListItem className={classes.header}>
      <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          {label && <Typography variant="body1">{label}</Typography>}
          <Typography variant="body2">
            <div>
              {allowClipboard && (
                <span className={classes.copyValue}>
                  <Tooltip title={copied ? 'Copied' : 'Copy'} placement="top" arrow onClose={tooltipCloseHandler}>
                    <CopyToClipboard text={value}>
                      <span onClick={tooltipClickHandler}>{displayValue}</span>
                    </CopyToClipboard>
                  </Tooltip>
                </span>
              )}
              {!allowClipboard && <span onClick={onNavigation}>{displayValue}</span>}
              <IconButton size="small" className={classes.openLinkIcon}>
                {navigationType === 'NEW_WINDOW' && <OpenInNewSharp onClick={onNavigation} strokeWidth={1} />}
                {navigationType === 'HISTORY_PUSH' && <ArrowForward onClick={onNavigation} strokeWidth={1} />}
              </IconButton>
            </div>
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  )
}
