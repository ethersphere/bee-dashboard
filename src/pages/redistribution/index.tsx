import CircularProgress from '@material-ui/core/CircularProgress'
import { ReactElement, useContext } from 'react'
import ExpandableList from '../../components/ExpandableList'
import { Redistribution } from '../../components/Redistribution'
import { Context as SettingsContext } from '../../providers/Settings'

export default function RedistributionPage(): ReactElement {
  const { isLoading } = useContext(SettingsContext)

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <ExpandableList label="Redistribution" defaultOpen>
        <Redistribution />
      </ExpandableList>
    </>
  )
}
