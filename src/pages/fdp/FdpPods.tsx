import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { Pod } from '@fairdatasociety/fdp-storage/dist/pod/types'
import { CircularProgress, Typography } from '@material-ui/core'
import { FdpPod } from './FdpPod'
import { Vertical } from './Vertical'

interface Props {
  fdp: FdpStorage
  pods: Pod[]
  loadingPods: boolean
}

export function FdpPods({ fdp, pods, loadingPods }: Props) {
  if (loadingPods) {
    return (
      <Vertical gap={32} full>
        <CircularProgress />
        <Typography>Loading your pods...</Typography>
      </Vertical>
    )
  }

  return (
    <Vertical gap={16} full left>
      {pods.map(pod => (
        <FdpPod key={pod.index} fdp={fdp} name={pod.name} />
      ))}
    </Vertical>
  )
}
