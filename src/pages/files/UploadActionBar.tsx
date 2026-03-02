import { Box, Grid } from '@mui/material'
import { ReactElement } from 'react'
import PlusSquare from 'remixicon-react/AddBoxLineIcon'
import ArrowLeft from 'remixicon-react/ArrowLeftLineIcon'
import Check from 'remixicon-react/CheckLineIcon'
import X from 'remixicon-react/CloseLineIcon'
import Layers from 'remixicon-react/StackLineIcon'

import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'

export enum StampMode {
  Buy = 'BUY',
  Select = 'SELECT',
}

interface Props {
  step: number
  onUpload: () => void
  onCancel: () => void
  onGoBack: () => void
  onProceed: () => void
  isUploading: boolean
  hasStamp: boolean
  hasAnyStamps: boolean
  uploadLabel: string
  stampMode: StampMode
  setStampMode: (mode: StampMode) => void
}

export function UploadActionBar({
  step,
  onUpload,
  onCancel,
  onGoBack,
  onProceed,
  isUploading,
  hasStamp,
  hasAnyStamps,
  uploadLabel,
  stampMode,
  setStampMode,
}: Props): ReactElement {
  if (step === 0) {
    return (
      <>
        <Box mb={1}>
          <ExpandableListItemActions>
            <SwarmButton onClick={onProceed} iconType={Layers}>
              Add Postage Stamp
            </SwarmButton>
            <SwarmButton onClick={onCancel} iconType={X} cancel>
              Cancel
            </SwarmButton>
          </ExpandableListItemActions>
        </Box>
        <DocumentationText>
          You need a postage stamp to upload. Find out more in{' '}
          <a
            href="https://medium.com/ethereum-swarm/how-to-upload-data-to-the-swarm-network-c0766c3ae381"
            target="_blank"
            rel="noreferrer"
          >
            this guide
          </a>
          .
        </DocumentationText>
      </>
    )
  }

  if (step === 1) {
    return (
      <Grid container direction="row" justifyContent="space-between">
        <ExpandableListItemActions>
          {stampMode === StampMode.Select && (
            <SwarmButton onClick={onProceed} iconType={Check} disabled={!hasStamp}>
              Proceed With Selected Stamp
            </SwarmButton>
          )}
          <SwarmButton onClick={onGoBack} iconType={ArrowLeft} cancel>
            Back To Preview
          </SwarmButton>
        </ExpandableListItemActions>
        {hasAnyStamps && (
          <SwarmButton
            disabled={stampMode === StampMode.Buy && !hasAnyStamps}
            onClick={() => setStampMode(stampMode === StampMode.Buy ? StampMode.Select : StampMode.Buy)}
            iconType={stampMode === StampMode.Buy ? Layers : PlusSquare}
          >
            {stampMode === StampMode.Buy ? 'Use Existing Stamp' : 'Buy New Stamp'}
          </SwarmButton>
        )}
      </Grid>
    )
  }

  if (step === 2) {
    return (
      <ExpandableListItemActions>
        <SwarmButton onClick={onUpload} iconType={Check} disabled={isUploading} loading={isUploading}>
          {uploadLabel}
        </SwarmButton>
        <SwarmButton onClick={onGoBack} iconType={ArrowLeft} disabled={isUploading} cancel>
          Change Postage Stamp
        </SwarmButton>
      </ExpandableListItemActions>
    )
  }

  return <></>
}
