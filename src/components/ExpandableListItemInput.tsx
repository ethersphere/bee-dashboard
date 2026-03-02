import { Box, IconButton, InputBase, ListItemButton, Typography } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import React, { ChangeEvent, ReactElement, useState } from 'react'
import type { RemixiconReactIconProps } from 'remixicon-react'
import Check from 'remixicon-react/CheckLineIcon'
import X from 'remixicon-react/CloseLineIcon'
import Edit from 'remixicon-react/PencilLineIcon'
import Minus from 'remixicon-react/SubtractLineIcon'
import { makeStyles } from 'tss-react/mui'

import ExpandableListItemActions from './ExpandableListItemActions'
import ExpandableListItemNote from './ExpandableListItemNote'
import { SwarmButton } from './SwarmButton'

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
  copyValue: {
    cursor: 'pointer',
    padding: theme.spacing(1),
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#fcf2e8',
      color: theme.palette.primary.main,
    },
  },
  content: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  keyMargin: {
    marginRight: theme.spacing(1),
  },
  unselectableLabel: {
    cursor: 'default',
    userSelect: 'none',
    // Many browsers don't support yet the general user-select css property
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
}))

interface Props {
  label: string
  value?: string
  placeholder?: string
  helperText?: string
  expandedOnly?: boolean
  confirmLabel?: string
  confirmLabelDisabled?: boolean
  confirmIcon?: React.ComponentType<RemixiconReactIconProps>
  loading?: boolean
  onChange?: (value: string) => void
  onConfirm?: (value: string) => void
  mapperFn?: (value: string) => string
  locked?: boolean
}

export default function ExpandableListItemInput({
  label,
  value = '',
  placeholder,
  helperText,
  expandedOnly,
  confirmLabel,
  confirmLabelDisabled,
  confirmIcon,
  loading,
  onChange,
  onConfirm,
  mapperFn,
  locked,
}: Props): ReactElement | null {
  const { classes } = useStyles()
  const [open, setOpen] = useState(Boolean(expandedOnly))
  const [inputValue, setInputValue] = useState<string>(value || '')
  const toggleOpen = () => setOpen(!open)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value

    if (mapperFn) {
      newValue = mapperFn(newValue)
    }
    setInputValue(newValue)

    if (onChange) onChange(newValue)
  }

  return (
    <ListItemButton className={`${classes.header} ${open ? classes.headerOpen : ''}`}>
      <Box display="flex" flexDirection="column" width="100%">
        <Box display="flex" flexDirection="row" alignItems="center" width="100%">
          {label && (
            <Box flex={1} minWidth={0}>
              <Typography variant="body1" className={classes.unselectableLabel} component="span">
                {label}
              </Typography>
            </Box>
          )}
          <Box flex={3} display="flex" alignItems="center" justifyContent="flex-end" minWidth={0} gap={1}>
            {!open && value && (
              <Typography
                variant="body2"
                component="span"
                sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {value}
              </Typography>
            )}
            {!expandedOnly && !locked && (
              <IconButton size="small" className={classes.copyValue} onClick={toggleOpen}>
                {open ? <Minus strokeWidth={1} /> : <Edit strokeWidth={1} />}
              </IconButton>
            )}
          </Box>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box display="flex" flexDirection="column" width="100%">
            <Box display="flex" alignItems="center" width="100%" minWidth={0}>
              <InputBase
                value={inputValue}
                placeholder={placeholder}
                onChange={handleChange}
                fullWidth
                className={classes.content}
                autoFocus
                hidden={locked}
                inputProps={{
                  style: {
                    width: '100%',
                    minWidth: 220,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  maxLength: 512,
                }}
              />
            </Box>
            {helperText && <ExpandableListItemNote>{helperText}</ExpandableListItemNote>}
            <Box mt={2}>
              <ExpandableListItemActions>
                <SwarmButton
                  disabled={
                    loading ||
                    inputValue === value ||
                    Boolean(confirmLabelDisabled) ||
                    (inputValue === '' && value === undefined)
                  }
                  loading={loading}
                  iconType={confirmIcon ?? Check}
                  onClick={() => {
                    onConfirm?.(inputValue.trim())
                  }}
                >
                  {confirmLabel || 'Save'}
                </SwarmButton>
                <SwarmButton
                  disabled={loading || inputValue === value || inputValue === ''}
                  iconType={X}
                  onClick={() => setInputValue(value || '')}
                  cancel
                >
                  Cancel
                </SwarmButton>
              </ExpandableListItemActions>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </ListItemButton>
  )
}
