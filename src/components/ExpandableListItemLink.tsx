import { ArrowForward, OpenInNewSharp } from '@mui/icons-material'
import { Grid, IconButton, ListItemButton, Tooltip, Typography } from '@mui/material'
import { ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import { useClipboardCopy } from '../hooks/useClipboardCopy'

const useStyles = makeStyles()(theme => ({
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
}))

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
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { copied, handleCopy, tooltipCloseHandler } = useClipboardCopy(value)

  const displayValue = value.length > 22 ? value.slice(0, 19) + '...' : value

  function onNavigation() {
    if (navigationType === 'NEW_WINDOW') {
      window.open(link || value)
    } else {
      navigate(link || value)
    }
  }

  return (
    <ListItemButton className={classes.header}>
      <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          {label && <Typography variant="body1">{label}</Typography>}
          <Typography variant="body2">
            {allowClipboard && (
              <span className={classes.copyValue}>
                <Tooltip title={copied ? 'Copied' : 'Copy'} placement="top" arrow onClose={tooltipCloseHandler}>
                  <span onClick={handleCopy}>{displayValue}</span>
                </Tooltip>
              </span>
            )}
            {!allowClipboard && <span onClick={onNavigation}>{displayValue}</span>}
            <IconButton size="small" className={classes.openLinkIcon} onClick={onNavigation}>
              {navigationType === 'NEW_WINDOW' && <OpenInNewSharp strokeWidth={1} />}
              {navigationType === 'HISTORY_PUSH' && <ArrowForward strokeWidth={1} />}
            </IconButton>
          </Typography>
        </Grid>
      </Grid>
    </ListItemButton>
  )
}
