import { Button, Typography } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { ReactElement } from 'react'
import { ArrowDownLeft, Check, Layers, PlusSquare } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'

interface Props {
  canSelectStamp: boolean
  hasSelectedStamp: boolean
  onUpload: () => void
  onBuy: () => void
  onSelect: () => void
  onCancel: () => void
  onClearStamp: () => void
}

export function UploadActionBar({
  canSelectStamp,
  hasSelectedStamp,
  onUpload,
  onBuy,
  onSelect,
  onCancel,
  onClearStamp,
}: Props): ReactElement {
  const showBuy = !hasSelectedStamp
  const showSelect = canSelectStamp && !hasSelectedStamp
  const showUpload = hasSelectedStamp
  const showChange = canSelectStamp && hasSelectedStamp

  return (
    <>
      <ExpandableListItemActions>
        {showBuy ? (
          <Button onClick={() => onBuy()} variant="contained" startIcon={<PlusSquare size="1.25rem" color="#dd7700" />}>
            Buy New Postage Stamp
          </Button>
        ) : null}
        {showSelect ? (
          <Button onClick={() => onSelect()} variant="contained" startIcon={<Layers size="1.25rem" color="#dd7700" />}>
            Use Existing Postage Stamp
          </Button>
        ) : null}
        {showUpload ? (
          <Button onClick={() => onUpload()} variant="contained" startIcon={<Check size="1.25rem" color="#dd7700" />}>
            Upload To Your Node
          </Button>
        ) : null}
        {showChange ? (
          <Button
            onClick={() => onClearStamp()}
            variant="contained"
            startIcon={<ArrowDownLeft size="1.25rem" color="#dd7700" />}
          >
            Change Postage Stamp
          </Button>
        ) : null}
        <Button onClick={() => onCancel()} variant="contained" startIcon={<Clear />}>
          Cancel
        </Button>
      </ExpandableListItemActions>
      <Typography variant="body2">
        You need a postage stamp to upload. Please refer to the official Bee documentation to understand how postage
        stamps work.
      </Typography>
    </>
  )
}
