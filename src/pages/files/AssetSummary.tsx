import * as swarmCid from '@ethersphere/swarm-cid'
import { Box } from '@material-ui/core'
import { ReactElement } from 'react'
import { Utils } from '@ethersphere/bee-js'
import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'

interface Props {
  isWebsite?: boolean
  reference: string
}

export function AssetSummary({ isWebsite, reference }: Props): ReactElement {
  const isHash = Utils.isHexString(reference) && reference.length === 64

  return (
    <>
      <Box mb={4}>
        {isHash && <ExpandableListItemKey label="Swarm hash" value={reference} />}
        {!isHash && <ExpandableListItemLink label="ENS" value={reference} />}
        <ExpandableListItemLink
          label="Share on Swarm Gateway"
          value={`https://gateway.ethswarm.org/access/${reference}`}
        />
        {isWebsite && isHash && (
          <ExpandableListItemLink
            label="BZZ Link"
            value={`https://${swarmCid.encodeManifestReference(reference).toString()}.bzz.link`}
          />
        )}
      </Box>
      <DocumentationText>
        The Swarm Gateway is graciously provided by the Swarm Foundation. This service is under development and provided
        for testing purposes only. Learn more at{' '}
        <a href="https://gateway.ethswarm.org/">https://gateway.ethswarm.org/</a>.
      </DocumentationText>
    </>
  )
}
