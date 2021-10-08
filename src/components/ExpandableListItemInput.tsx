import { ReactElement, ChangeEvent, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { ListItem, Typography, Grid, IconButton, InputBase, Button } from '@material-ui/core'
import { Edit, Minus, RotateCcw, Check } from 'react-feather'

import ExpandableListItemActions from './ExpandableListItemActions'
import ExpandableListItemNote from './ExpandableListItemNote'

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
  onChange?: (value: string) => void
  onConfirm: (value: string) => void
}

export default function ExpandableListItemKey({
  label,
  value,
  onConfirm,
  onChange,
  confirmLabel,
  confirmLabelDisabled,
  expandedOnly,
  helperText,
  placeholder,
}: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState(Boolean(expandedOnly))
  const [inputValue, setInputValue] = useState<string>(value || '')
  const toggleOpen = () => setOpen(!open)
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
                {!expandedOnly && (
                  <IconButton size="small" className={classes.copyValue}>
                    {open ? (
                      <Minus onClick={toggleOpen} strokeWidth={1} />
                    ) : (
                      <Edit onClick={toggleOpen} strokeWidth={1} />
                    )}
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
            />
          </Collapse>
        </Grid>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {helperText && <ExpandableListItemNote>{helperText}</ExpandableListItemNote>}
        <ExpandableListItemActions>
          <Button
            variant="contained"
            disabled={
              inputValue === value ||
              Boolean(confirmLabelDisabled) || // Disable if external validation is provided
              (inputValue === '' && value === undefined) // Disable if no initial value was not provided and the field is empty. The undefined check is improtant so that it is possible to submit with empty input in other cases
            }
            startIcon={<Check size="1rem" />}
            onClick={() => onConfirm(inputValue)}
          >
            {confirmLabel || 'Save'}
          </Button>
          <Button
            variant="contained"
            disabled={inputValue === value || inputValue === ''}
            startIcon={<RotateCcw size="1rem" />}
            onClick={() => setInputValue(value || '')}
          >
            Cancel
          </Button>
        </ExpandableListItemActions>
      </Collapse>
    </>
  )
}
