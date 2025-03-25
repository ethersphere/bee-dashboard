import { Box } from '@material-ui/core'
import { Reference } from '@ethersphere/bee-js'
import { ReactElement } from 'react'
import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'

interface Props {
  isWebsite?: boolean
  reference: string
}

export function AssetSummary({ isWebsite, reference }: Props): ReactElement {
  const isHash = Reference.isValid(reference)

  return (
    <>
      <Box mb={4}>
        {isHash && <ExpandableListItemKey label="Swarm hash" value={reference} />}
        {!isHash && <ExpandableListItemLink label="ENS" value={reference} />}
      </Box>
      <DocumentationText>
        The Swarm Gateway is graciously provided by the Swarm Foundation. This service is under development and provided
        for testing purposes only. Learn more at{' '}
        <a href="https://gateway.ethswarm.org/">https://gateway.ethswarm.org/</a>.
      </DocumentationText>
    </>
  )
}
