import * as swarmCid from '@ethersphere/swarm-cid'
import { Box } from '@material-ui/core'
import { ReactElement } from 'react'
import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'
import { detectIndexHtml } from '../../utils/file'

interface Props {
  files: SwarmFile[]
  hash: string
}

export function AssetSummary({ files, hash }: Props): ReactElement {
  return (
    <>
      <Box mb={4}>
        <ExpandableListItemKey label="Swarm hash" value={hash} />
        <ExpandableListItemLink label="Share on Swarm Gateway" value={`https://gateway.ethswarm.org/access/${hash}`} />
        {detectIndexHtml(files) && (
          <ExpandableListItemLink
            label="BZZ Link"
            value={`https://${swarmCid.encodeManifestReference(hash).toString()}.bzz.link`}
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
