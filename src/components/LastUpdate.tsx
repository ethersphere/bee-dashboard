import { ReactElement, useEffect, useState } from 'react'

interface Props {
  date: number | null
}

export default function LastUpdate({ date }: Props): ReactElement {
  const [duration, setDuration] = useState<string>('never')

  const refresh = () => {
    if (!date) setDuration('never')
    else setDuration(`${((Date.now() - date) / 1000).toFixed()} seconds ago`)
  }

  useEffect(() => {
    refresh()
    const i = setInterval(refresh, 1000)

    return () => clearInterval(i)
  }, [date])

  return <span>Last Update: {duration}</span>
}
