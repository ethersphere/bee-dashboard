import { ReactElement, useState, useContext } from 'react'
import { Context as SettingsContext } from '../../providers/Settings'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Utils } from '@ethersphere/bee-js'

export default function Files(): ReactElement {
  const { apiUrl } = useContext(SettingsContext)

  const [referenceError, setReferenceError] = useState<string | undefined>(undefined)

  const validateChange = (value: string) => {
    if (Utils.isHexString(value, 64) || Utils.isHexString(value, 128)) setReferenceError(undefined)
    else setReferenceError('Incorrect format of swarm hash. Expected 64 or 128 hexstring characters.')
  }

  return (
    <ExpandableListItemInput
      label="Swarm Hash"
      onConfirm={value => window.open(`${apiUrl}/bzz/${value}`, '_blank')}
      onChange={validateChange}
      helperText={referenceError}
      confirmLabel={'Download'}
      confirmLabelDisabled={Boolean(referenceError)}
      expandedOnly
    />
  )
}
