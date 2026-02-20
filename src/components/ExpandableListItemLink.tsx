import { ArrowForward, OpenInNewSharp } from '@mui/icons-material'
import { Grid, IconButton, ListItemButton, Tooltip, Typography } from '@mui/material'
import { closeSnackbar, useSnackbar } from 'notistack'
import { ReactElement, useState } from 'react'
import { useNavigate } from 'react-router'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'
import { makeStyles } from 'tss-react/mui'

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
  const { enqueueSnackbar } = useSnackbar()

  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      enqueueSnackbar(`Failed to copy text`, {
        variant: 'error',
        action: key => (
          <IconButton onClick={() => closeSnackbar(key)} size="small" color="inherit">
            <CloseLineIcon fontSize="small" />
          </IconButton>
        ),
      })
    }
  }

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
