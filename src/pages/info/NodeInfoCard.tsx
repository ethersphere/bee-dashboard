import { ReactElement, useContext } from 'react'
import Search from 'remixicon-react/SearchLineIcon'
import Globe from 'remixicon-react/GlobalLineIcon'
import Settings from 'remixicon-react/Settings2LineIcon'

import { CheckState, Context as BeeContext } from '../../providers/Bee'
import Card from '../../components/Card'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../routes'

export default function NodeInfoCard(): ReactElement {
  const { status } = useContext(BeeContext)
  const navigate = useNavigate()

  if (status.all === CheckState.ERROR) {
    return (
      <Card
        buttonProps={{ iconType: Settings, children: 'Open node setup', onClick: () => navigate(ROUTES.STATUS) }}
        icon={<Globe />}
        title="Your node is not connected…"
        subtitle="You are not connected to Swarm."
        status="error"
      />
    )
  }

  if (status.all === CheckState.WARNING) {
    return (
      <Card
        buttonProps={{ iconType: Settings, children: 'Open node setup', onClick: () => navigate(ROUTES.STATUS) }}
        icon={<Globe />}
        title="Your node is running…"
        subtitle="Connection to Swarm might not be optimal."
        status="error"
      />
    )
  }

  return (
    <Card
      buttonProps={{ iconType: Search, children: 'Access Content', onClick: () => navigate(ROUTES.DOWNLOAD) }}
      icon={<Globe />}
      title="Your node is connected."
      subtitle="You are connected to Swarm."
      status="ok"
    />
  )
}
