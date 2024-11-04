import { Bee } from '@ethersphere/bee-js'
import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { Pod } from '@fairdatasociety/fdp-storage/dist/pod/types'
import { CircularProgress, Typography } from '@material-ui/core'
import { Strings } from 'cafe-utility'
import { useSnackbar } from 'notistack'
import { ReactElement, useEffect, useState } from 'react'
import ImportIcon from 'remixicon-react/AddBoxLineIcon'
import PlusCircle from 'remixicon-react/AddCircleLineIcon'
import { SwarmButton } from '../../components/SwarmButton'
import { ManifestJs } from '../../utils/manifest'
import { FdpLogin } from './FdpLogin'
import { FdpPods } from './FdpPods'
import { Horizontal } from './Horizontal'
import { Vertical } from './Vertical'

async function makeFdp(): Promise<FdpStorage | null> {
  const bee = new Bee('http://localhost:1633')
  const sepolia = localStorage.getItem('sepolia') ?? 'https://sepolia.drpc.org'
  const postageBatches = await bee.getAllPostageBatch()
  const usableBatches = postageBatches.filter(batch => batch.usable)
  const highestCapacityBatch = usableBatches.length ? usableBatches.reduce((a, b) => (a.depth > b.depth ? a : b)) : null

  if (!highestCapacityBatch) {
    return null
  }

  return new FdpStorage('http://localhost:1633', highestCapacityBatch.batchID, {
    ensOptions: {
      rpcUrl: sepolia,
      contractAddresses: {
        ensRegistry: '0x42a96D45d787685ac4b36292d218B106Fb39be7F',
        fdsRegistrar: '0xFBF00389140C00384d88d458239833E3231a7414',
        nameResolver: '0xE20ECe6Ea93c4edE41e4d3B973f6679F1E89986A',
        publicResolver: '0xC904989B579c2B216A75723688C784038AA99B56',
        reverseResolver: '0xbDC8D98d3cbFd68EA9c165E1f15Df6e77A2ae0C5',
      },
      gasEstimation: 1,
      performChecks: true,
    },
    providerOptions: {
      url: sepolia,
    },
    ensDomain: 'fds',
  })
}

export default function FDP(): ReactElement {
  const [fdp, setFdp] = useState<FdpStorage | null>(null)
  const [pods, setPods] = useState<Pod[]>([])
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loadingPods, setLoadingPods] = useState<boolean>(false)
  const [creatingPod, setCreatingPod] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    makeFdp().then(fdp => {
      if (!fdp) {
        enqueueSnackbar('FDP could not be initialized. Do you have a postage batch?', { variant: 'error' })
      }
      setFdp(fdp)
    })
  }, [enqueueSnackbar])

  useEffect(() => {
    if (fdp && loggedIn) {
      setLoadingPods(true)
      fdp.personalStorage.list().then(pods => {
        setPods(pods.pods)
        setLoadingPods(false)
      })
    }
  }, [fdp, loggedIn])

  function onSuccessfulLogin() {
    setLoggedIn(true)
  }

  function onCreatePod() {
    if (!fdp) {
      return
    }

    if (loadingPods || creatingPod) {
      enqueueSnackbar('Please wait until the pods are loaded', { variant: 'info' })

      return
    }
    // eslint-disable-next-line no-alert
    const name = prompt('Enter a name for the new pod')

    if (name) {
      setCreatingPod(true)
      fdp.personalStorage.create(name).then(() => {
        fdp.personalStorage.list().then(pods => {
          setPods(pods.pods)
          setCreatingPod(false)
        })
      })
    }
  }

  async function onImportPod() {
    if (!fdp) {
      return
    }

    if (loadingPods || creatingPod) {
      enqueueSnackbar('Please wait until the pods are loaded', { variant: 'info' })

      return
    }
    // eslint-disable-next-line no-alert
    const name = prompt('Enter a name for the new pod')
    // eslint-disable-next-line no-alert
    const importHash = prompt('Enter the Swarm reference')

    if (!name || !importHash) {
      return
    }
    setCreatingPod(true)
    const bee = new Bee('http://localhost:1633')
    const manifestJs = new ManifestJs(bee)
    const entries = await manifestJs.getHashes(importHash)
    await fdp.personalStorage.create(name)
    for (const [path, hash] of Object.entries(entries)) {
      await fdp.file.uploadData(name, Strings.joinUrl('/', path), await bee.downloadData(hash))
    }
    const pods = await fdp.personalStorage.list()
    setPods(pods.pods)
    setCreatingPod(false)
  }

  if (!fdp) {
    return <CircularProgress />
  }

  return (
    <Vertical gap={32} full left>
      <Horizontal between>
        <Typography variant="h1">Files</Typography>
        {loggedIn && (
          <Horizontal gap={4}>
            <SwarmButton onClick={onCreatePod} iconType={PlusCircle}>
              Create
            </SwarmButton>
            <SwarmButton onClick={onImportPod} iconType={ImportIcon}>
              Import
            </SwarmButton>
          </Horizontal>
        )}
      </Horizontal>
      {!loggedIn && <FdpLogin fdp={fdp} onSuccessfulLogin={onSuccessfulLogin} />}
      {loggedIn && <FdpPods fdp={fdp} pods={pods} loadingPods={loadingPods || creatingPod} />}
      {loggedIn && !loadingPods && !creatingPod && pods.length === 0 && (
        <Typography>
          <strong>You do not have any pods yet.</strong> Get started by clicking the Create or Import button on the top
          right.
        </Typography>
      )}
    </Vertical>
  )
}
