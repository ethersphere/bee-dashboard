import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton'
import { ReactElement, ReactNode } from 'react'
import Info from 'remixicon-react/InformationLineIcon'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(theme => ({
  header: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(0.25),
    wordBreak: 'break-word',
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
  label?: ReactNode
  value?: ReactNode
  tooltip?: string
}

export default function ExpandableListItem({ label, value, tooltip }: Props): ReactElement | null {
  const { classes } = useStyles()

  return (
    <ListItemButton className={classes.header}>
      <Box display="flex" flexDirection="row" alignItems="center" width="100%">
        {label && (
          <Box flex={2}>
            <Typography variant="body1">{label}</Typography>
          </Box>
        )}
        {value && (
          <Box flex={1} textAlign="right">
            <Typography variant="body2">
              {value}
              {tooltip && (
                <Tooltip title={tooltip} placement="top" arrow>
                  <IconButton size="small" className={classes.copyValue}>
                    <Info strokeWidth={1} />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </ListItemButton>
  )
}
