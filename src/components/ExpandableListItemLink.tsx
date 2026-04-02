import { ArrowForward, OpenInNewSharp } from '@mui/icons-material'
import { Box, IconButton, ListItemButton, Tooltip, Typography } from '@mui/material'
import { ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import { useClipboardCopy } from '../hooks/useClipboardCopy'

const useStyles = makeStyles()(theme => ({
  header: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(0.25),
    borderLeft: `${theme.spacing(0.25)} solid rgba(0,0,0,0)`,
    wordBreak: 'break-word',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
    '&:focus-within': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  headerOpen: {
    borderLeft: `${theme.spacing(0.25)} solid ${theme.palette.primary.main}`,
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

export enum NavigationType {
  NEW_WINDOW = 'NEW_WINDOW',
  HISTORY_PUSH = 'HISTORY_PUSH',
}

interface Props {
  label: string
  value: string
  link?: string
  navigationType?: NavigationType
  allowClipboard?: boolean
}

export default function ExpandableListItemLink({
  label,
  value,
  link,
  navigationType = NavigationType.NEW_WINDOW,
  allowClipboard = true,
}: Props): ReactElement | null {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { copied, handleCopy, tooltipCloseHandler } = useClipboardCopy(value)

  const displayValue = value.length > 22 ? value.slice(0, 19) + '...' : value

  function onNavigation() {
    if (navigationType === NavigationType.NEW_WINDOW) {
      window.open(link || value)
    } else {
      navigate(link || value)
    }
  }

  return (
    <ListItemButton className={classes.header} sx={{ width: '100%' }}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
        {label && <Typography variant="body1">{label}</Typography>}
        <Box display="flex" alignItems="center">
          <Typography variant="body2">
            {allowClipboard && (
              <span className={classes.copyValue}>
                <Tooltip title={copied ? 'Copied' : 'Copy'} placement="top" arrow onClose={tooltipCloseHandler}>
                  <span onClick={handleCopy}>{displayValue}</span>
                </Tooltip>
              </span>
            )}
            {!allowClipboard && <span onClick={onNavigation}>{displayValue}</span>}
          </Typography>
          <IconButton size="small" className={classes.openLinkIcon} onClick={onNavigation}>
            {navigationType === NavigationType.NEW_WINDOW && <OpenInNewSharp strokeWidth={1} />}
            {navigationType === NavigationType.HISTORY_PUSH && <ArrowForward strokeWidth={1} />}
          </IconButton>
        </Box>
      </Box>
    </ListItemButton>
  )
}
