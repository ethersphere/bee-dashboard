import { ReactElement, useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { ListItem, Typography, Grid, IconButton, InputBase, Button } from '@material-ui/core'
import { Edit, Minus, RotateCcw, Check } from 'react-feather'

import ExpandableListItemActions from './ExpandableListItemActions'

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
  }),
)

interface Props {
  label: string
  value: string
  onConfirm: (value: string) => void
}

export default function ExpandableListItemKey({ label, value, onConfirm }: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const toggleOpen = () => setOpen(!open)

  useEffect(
    () => console.log(inputValue), // eslint-disable-line
    [inputValue],
  )

  return (
    <>
      <ListItem className={`${classes.header} ${open ? classes.headerOpen : ''}`}>
        <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            {label && <Typography variant="body1">{label}</Typography>}
            <Typography variant="body2">
              <div>
                {!open && value}
                <IconButton size="small" className={classes.copyValue}>
                  {open ? (
                    <Minus onClick={toggleOpen} strokeWidth={1} />
                  ) : (
                    <Edit onClick={toggleOpen} strokeWidth={1} />
                  )}
                </IconButton>
              </div>
            </Typography>
          </Grid>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <InputBase
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              fullWidth
              className={classes.content}
              autoFocus
            />
          </Collapse>
        </Grid>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ExpandableListItemActions>
          <Button
            variant="contained"
            disabled={inputValue === value}
            startIcon={<Check size="1rem" />}
            onClick={() => onConfirm(inputValue)}
          >
            Save
          </Button>
          <Button
            variant="contained"
            disabled={inputValue === value}
            startIcon={<RotateCcw size="1rem" />}
            onClick={() => setInputValue(value)}
          >
            Cancel
          </Button>
        </ExpandableListItemActions>
      </Collapse>
    </>
  )
}
