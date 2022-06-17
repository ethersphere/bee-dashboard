import { ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { HistoryHeader } from '../../components/HistoryHeader'
import { ROUTES } from '../../routes'
import { PostageStampCreation } from './PostageStampCreation'

export function CreatePostageStampPage(): ReactElement {
  const navigate = useNavigate()

  function onFinished() {
    navigate(ROUTES.ACCOUNT_STAMPS)
  }

  return (
    <div>
      <HistoryHeader>Buy new postage stamp</HistoryHeader>
      <PostageStampCreation onFinished={onFinished} />
    </div>
  )
}
