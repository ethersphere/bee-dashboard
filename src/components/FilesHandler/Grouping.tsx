import { createStyles, makeStyles } from '@material-ui/core'
import { useContext } from 'react'
import type { ReactElement } from 'react'
import SwarmCheckedIcon from '../icons/SwarmCheckedIcon'
import GroupingIcon from '../icons/GroupingIcon'
import { Context as FileManagerContext } from '../../providers/FileManager'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      display: 'flex',
      width: '65px',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontFamily: '"iAWriterMonoV", monospace',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    },
    flex: {
      display: 'flex',
    },
    absolute: {
      position: 'absolute',
      left: '15px',
    },
  }),
)

const Grouping = (): ReactElement => {
  const classes = useStyles()
  const { isGroupingOn, setIsGroupingOn } = useContext(FileManagerContext)

  return (
    <div className={classes.container} onClick={() => setIsGroupingOn(!isGroupingOn)}>
      <div className={classes.flex}>
        <div className={classes.absolute}>
          <SwarmCheckedIcon color={isGroupingOn ? '#DE7700' : '#33333333'} />
        </div>
        <GroupingIcon color={isGroupingOn ? '#333333' : '#33333333'} />
      </div>
      <div>Grouping</div>
    </div>
  )
}

export default Grouping
