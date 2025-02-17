import { createStyles, makeStyles } from '@material-ui/core'

import { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import FileUpload from './FileUpload/FileUpload'
import { getUsableStamps, secondsToTimeString } from '../utils'
import { Bee, PostageBatch } from '@ethersphere/bee-js'
import Volume from './Volume'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      // paddingTop: '10px',
      // paddingBottom: '10px',
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
  const [usableStamps, setUsableStamps] = useState<PostageBatch[]>([])

  useEffect(() => {
    async function fetchStamps() {
      const stamps = await getUsableStamps(bee)
      setUsableStamps(stamps)
    }

    fetchStamps()
  }, [])

  return (
    <div className={classes.container}>
      <div className={classes.flex}>
        {usableStamps.map((stamp, index) => (
          <div key={index} className={classes.flex}>
            <Volume
              label={stamp.label}
              expire={secondsToTimeString(stamp.batchTTL)}
              size={stamp.amount}
              notificationText="!"
            />
          </div>
        ))}
      </div>
      <div className={classes.flex}>
        <FileUpload usableStamps={usableStamps} />
      </div>
    </div>
  )
}

export default FilesHandler
