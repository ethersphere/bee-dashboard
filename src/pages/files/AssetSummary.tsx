import { Reference } from '@ethersphere/bee-js'
import { Box } from '@mui/material'
import { ReactElement } from 'react'

import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'

interface Props {
  isWebsite?: boolean
  reference?: string
}

export function AssetSummary({ reference }: Props): ReactElement {
  const isHash = reference ? Reference.isValid(reference) : false

  return (
    <>
      <Box mb={4}>
        {isHash && <ExpandableListItemKey label="Swarm hash" value={reference || ''} />}
        {!isHash && <ExpandableListItemLink label="ENS" value={reference || ''} />}
      </Box>
      <DocumentationText>Files are accessed through your configured Bee API endpoint.</DocumentationText>
    </>
  )
}
