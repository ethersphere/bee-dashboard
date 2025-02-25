import { createStyles, makeStyles } from '@material-ui/core'

import { ReactElement, useContext } from 'react'
import FileUpload from './FileUpload/FileUpload'
import VolumeManage from './VolumeManage/VolumeManage'
import { Context as StampContext } from '../providers/Stamps'
import Volume from './VolumeManage/Volume'
import { Bee } from '@upcoming/bee-js'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      height: '65px',
      boxSizing: 'border-box',
      fontSize: '12px',
      display: 'flex',
      gap: '10px',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      marginBottom: '20px',
    },
    flex: {
      display: 'flex',
      height: '100%',
    },
  }),
)

const FilesHandler = (): ReactElement => {
  const classes = useStyles()
  const bee = new Bee('http://localhost:1633')
  // const [usableStamps, setUsableStamps] = useState<PostageBatch[]>([])

  // useEffect(() => {
  //   async function fetchStamps() {
  //     const stamps = await getUsableStamps(bee)
  //     setUsableStamps(stamps)
  //   }

  //   fetchStamps()
  // }, [])
  // const bee = new Bee('http://localhost:1633')
  const { usableStamps } = useContext(StampContext)

  return (
    <div className={classes.container}>
      <div className={classes.flex}>
        {usableStamps?.map((stamp, index) => (
          <div key={index} className={classes.flex}>
            <Volume label={stamp.label} size={stamp.amount} batchTTL={stamp.batchTTL} notificationText="!" />
          </div>
        ))}
        <VolumeManage />
      </div>
      <div className={classes.flex}>
        <FileUpload usableStamps={usableStamps} />
      </div>
    </div>
  )
}

export default FilesHandler
