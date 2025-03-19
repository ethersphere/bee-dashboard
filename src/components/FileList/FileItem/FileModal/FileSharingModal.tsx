import { createStyles, makeStyles, Theme } from '@material-ui/core'
import type { ReactElement } from 'react'
import CopyIcon from '../../../icons/CopyIcon'
import { SwarmCheckbox } from '../../../SwarmCheckbox'
import { SwarmTextInput } from '../../../SwarmTextInput'

interface Props {
  textToBeDisabled?: string[]
  modalDisplay: (value: boolean) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    copyIconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: '#FFFFFF',
      height: '53px',
      width: '53px',
    },
    buttonElement: {
      backgroundColor: '#FFFFFF',
      width: '256px',
      height: '42px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: '#DE7700',
        color: '#FFFFFF',
      },
    },
    field: {
      background: theme.palette.background.paper,
      '& fieldset': {
        border: 0,
      },
      '& .Mui-focused': {
        background: theme.palette.background.paper,
      },
      '& .MuiInputBase-root': {
        background: theme.palette.background.paper,
        paddingTop: (props: { padding: number | undefined }) =>
          props.padding !== undefined ? `${props.padding}px` : undefined,
        fontFamily: '"iAWriterMonoV", monospace',
        lineHeight: '18px',
      },
      '& .MuiFilledInput-root': {
        borderRadius: 0,
      },
    },
  }),
)

export function FileSharingModal({ textToBeDisabled, modalDisplay }: Props): ReactElement {
  const padding = textToBeDisabled ? (textToBeDisabled?.length + 1) * 18 : undefined
  const classes = useStyles({ padding })

  return <div></div>
}

export default FileSharingModal
