import { Reference } from '@ethersphere/bee-js'
import { Box } from '@mui/material'
import { ReactElement, useContext } from 'react'

import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'
import { Context as SettingsContext } from '../../providers/Settings'

interface Props {
  isWebsite?: boolean
  reference?: string
}

export function AssetSummary({ reference }: Props): ReactElement {
  const { apiUrl } = useContext(SettingsContext)
  const isHash = reference ? Reference.isValid(reference) : false

  return (
    <>
      <Box mb={4}>
        {isHash && <ExpandableListItemKey label="Swarm hash" value={reference || ''} />}
        {!isHash && (
          // ENS names must be opened through the Bee node's /bzz endpoint (which resolves
          // them); without an explicit link the icon would navigate to the bare ENS string.
          <ExpandableListItemLink label="ENS" value={reference || ''} link={`${apiUrl}/bzz/${reference}/`} />
        )}
      </Box>
      <DocumentationText>Files are accessed through your configured Bee API endpoint.</DocumentationText>
    </>
  )
}
