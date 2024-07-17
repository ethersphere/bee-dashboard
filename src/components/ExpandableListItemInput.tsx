import { Box, Grid, IconButton, InputBase, ListItem, Typography } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ChangeEvent, ReactElement, useState } from 'react'
import type { RemixiconReactIconProps } from 'remixicon-react'
import Check from 'remixicon-react/CheckLineIcon'
import X from 'remixicon-react/CloseLineIcon'
import Edit from 'remixicon-react/PencilLineIcon'
import Minus from 'remixicon-react/SubtractLineIcon'
import ExpandableListItemActions from './ExpandableListItemActions'
import ExpandableListItemNote from './ExpandableListItemNote'
import { SwarmButton } from './SwarmButton'

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
  }),
)

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

export default function ExpandableListItemKey({
  label,
  value,
  onConfirm,
  onChange,
  confirmLabel,
  confirmLabelDisabled,
  confirmIcon,
  expandedOnly,
  helperText,
  placeholder,
  loading,
  mapperFn,
  locked,
}: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState(Boolean(expandedOnly))
  const [inputValue, setInputValue] = useState<string>(value || '')
  const toggleOpen = () => setOpen(!open)
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (mapperFn) {
      e.target.value = mapperFn(e.target.value)
    }

    setInputValue(e.target.value)

    if (onChange) onChange(e.target.value)
  }

  return (
    <>
      <ListItem className={`${classes.header} ${open ? classes.headerOpen : ''}`}>
        <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            {label && (
              <Typography variant="body1" className={classes.unselectableLabel}>
                {label}
              </Typography>
            )}
            <Typography variant="body2">
              <div>
                {!open && value}
                {!expandedOnly && !locked && (
                  <IconButton size="small" className={classes.copyValue} onClick={toggleOpen}>
                    {open ? <Minus strokeWidth={1} /> : <Edit strokeWidth={1} />}
                  </IconButton>
                )}
              </div>
            </Typography>
          </Grid>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <InputBase
              value={inputValue}
              placeholder={placeholder}
              onChange={handleChange}
              fullWidth
              className={classes.content}
              autoFocus
              hidden={locked}
            />
          </Collapse>
        </Grid>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {helperText && <ExpandableListItemNote>{helperText}</ExpandableListItemNote>}
        <Box mt={2}>
          <ExpandableListItemActions>
            <SwarmButton
              disabled={
                loading ||
                inputValue === value ||
                Boolean(confirmLabelDisabled) || // Disable if external validation is provided
                (inputValue === '' && value === undefined) // Disable if no initial value was not provided and the field is empty. The undefined check is improtant so that it is possible to submit with empty input in other cases
              }
              loading={loading}
              iconType={confirmIcon ?? Check}
              onClick={() => {
                if (onConfirm) onConfirm(inputValue)
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
      </Collapse>
    </>
  )
}
