import { BZZ } from '@ethersphere/bee-js'
import { useContext } from 'react'
import { useNavigate } from 'react-router'
import ExchangeFunds from 'remixicon-react/ExchangeFundsLineIcon'
import Card from '../../components/Card'
import { Context as BeeContext } from '../../providers/Bee'
import { ROUTES } from '../../routes'

export function ChequebookInfoCard() {
  const { chequebookBalance } = useContext(BeeContext)
  const navigate = useNavigate()

  if (chequebookBalance?.availableBalance !== undefined && chequebookBalance?.availableBalance.gt(BZZ.fromPLUR('0'))) {
    return (
      <Card
        buttonProps={{
          iconType: ExchangeFunds,
          children: 'Manage chequebook',
          onClick: () => navigate(ROUTES.ACCOUNT_CHEQUEBOOK),
        }}
        icon={<ExchangeFunds />}
        title={`${chequebookBalance?.availableBalance.toSignificantDigits(4)} xBZZ`}
        subtitle="Network transfer balance."
        status="ok"
      />
    )
  }

  return (
    <Card
      buttonProps={{
        iconType: ExchangeFunds,
        children: 'Manage chequebook',
        onClick: () => navigate(ROUTES.ACCOUNT_CHEQUEBOOK),
      }}
      icon={<ExchangeFunds />}
      title={
        chequebookBalance?.availableBalance
          ? `${chequebookBalance.availableBalance.toSignificantDigits(4)} xBZZ`
          : 'No available balance.'
      }
      subtitle="Chequebook not setup."
      status="error"
    />
  )
}
