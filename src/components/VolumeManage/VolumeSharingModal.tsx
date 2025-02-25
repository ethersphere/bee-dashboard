import { createStyles, makeStyles, Theme } from '@material-ui/core'
import type { ReactElement } from 'react'
import CopyIcon from '../icons/CopyIcon'
import { SwarmTextInput } from '../SwarmTextInput'
import { SwarmCheckbox } from '../SwarmCheckbox'

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

export function VolumeSharingModal({ textToBeDisabled, modalDisplay }: Props): ReactElement {
  const padding = textToBeDisabled ? (textToBeDisabled?.length + 1) * 18 : undefined
  const classes = useStyles({ padding })

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', flexGrow: '1' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ width: '100%' }}>
              <SwarmTextInput
                name="Hash"
                label="Hash"
                required={false}
                defaultValue="0x9cbDe6569BA1220E46f256371368A05f480bb78E"
                backgroundColor="#F7F7F7"
                color="#878787"
                disabled={true}
              />
            </div>

            <div className={classes.copyIconContainer}>
              <CopyIcon />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <SwarmCheckbox />
          <div>Access management</div>
        </div>
        <SwarmTextInput
          name="accesslist"
          label="Access list"
          multiline={true}
          rows={8}
          required={false}
          textToBeDisabled={textToBeDisabled}
        />
      </div>
      <div style={{ display: 'flex', gap: '25px', justifyContent: 'right' }}>
        <div className={classes.buttonElement} style={{ width: '160px' }} onClick={() => modalDisplay(false)}>
          Cancel
        </div>
        <div className={classes.buttonElement} style={{ width: '160px', backgroundColor: '#DE7700', color: '#FFFFFF' }}>
          Update
        </div>
      </div>
    </div>
  )
}

export default VolumeSharingModal
