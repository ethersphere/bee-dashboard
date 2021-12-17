import { ReactElement } from 'react'
import { useHistory } from 'react-router'
import { HistoryHeader } from '../../components/HistoryHeader'
import { ROUTES } from '../../routes'
import { PostageStampCreation } from './PostageStampCreation'

export function CreatePostageStampPage(): ReactElement {
  const history = useHistory()

  function onFinished() {
    history.push(ROUTES.STAMPS)
  }

  return (
    <div>
      <HistoryHeader>Buy new postage stamp</HistoryHeader>
      <PostageStampCreation onFinished={onFinished} />
    </div>
  )
}
