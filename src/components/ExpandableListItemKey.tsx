import { Grid, IconButton, ListItem, Tooltip, Typography } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactElement, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Eye, Minus } from 'react-feather'

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
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    keyMargin: {
      marginRight: theme.spacing(1),
    },
  }),
)

interface Props {
  label: string
  value: string
  expanded?: boolean
}

const lengthWithoutPrefix = (s: string) => s.replace(/^0x/i, '').length

function isPrefixedHexString(s: unknown): boolean {
  return typeof s === 'string' && /^0x[0-9a-f]+$/i.test(s)
}

const split = (s: string): string[] => {
  const nonPrefixLength = lengthWithoutPrefix(s)

  if (nonPrefixLength % 6 === 0) return s.match(/(0x|.{6})/gi) || []

  return s.match(/(0x|.{1,8})/gi) || []
}

export default function ExpandableListItemKey({ label, value, expanded }: Props): ReactElement | null {
  const classes = useStyles()
  const [open, setOpen] = useState(expanded || false)
  const [copied, setCopied] = useState(false)
  const toggleOpen = () => setOpen(!open)

  const tooltipClickHandler = () => setCopied(true)
  const tooltipCloseHandler = () => setCopied(false)

  const splitValues = split(value)
  const hasPrefix = isPrefixedHexString(value)
  const spanText = `${hasPrefix ? `${splitValues[0]} ${splitValues[1]}` : splitValues[0]}[…]${
    splitValues[splitValues.length - 1]
  }`

  return (
    <ListItem className={`${classes.header} ${open ? classes.headerOpen : ''}`}>
      <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          {label && <Typography variant="body1">{label}</Typography>}
          <Typography variant="body2">
            <div>
              {!open && (
                <span className={classes.copyValue}>
                  <Tooltip title={copied ? 'Copied' : 'Copy'} placement="top" arrow onClose={tooltipCloseHandler}>
                    <CopyToClipboard text={value}>
                      <span onClick={tooltipClickHandler}>{value ? spanText : ''}</span>
                    </CopyToClipboard>
                  </Tooltip>
                </span>
              )}
              <IconButton size="small" className={classes.copyValue}>
                {open ? <Minus onClick={toggleOpen} strokeWidth={1} /> : <Eye onClick={toggleOpen} strokeWidth={1} />}
              </IconButton>
            </div>
          </Typography>
        </Grid>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <div className={classes.content}>
            <Tooltip title={copied ? 'Copied' : 'Copy'} placement="top" arrow onClose={tooltipCloseHandler}>
              <CopyToClipboard text={value}>
                {/* This has to be wrapped in two spans otherwise either the tooltip or the highlighting does not work*/}
                <span onClick={tooltipClickHandler}>
                  <span className={classes.copyValue}>
                    {splitValues.map((s, i) => (
                      <Typography variant="body2" key={i} className={classes.keyMargin} component="span">
                        {s}
                      </Typography>
                    ))}
                  </span>
                </span>
              </CopyToClipboard>
            </Tooltip>
          </div>
        </Collapse>
      </Grid>
    </ListItem>
  )
}
