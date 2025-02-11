import { ChangeEvent, ReactElement, useState } from 'react'

interface Props {
  defaultChecked?: boolean
  backgroundColor?: string
  color?: string
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export function SwarmCheckbox({ onChange, defaultChecked, backgroundColor, color, disabled }: Props): ReactElement {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div onClick={() => setChecked(!checked)} style={{ display: 'flex' }}>
      {checked ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 0 16 0ZM16 2V16H2V2H16ZM7 14L3 10L4.41 8.58L7 11.17L13.59 4.58L15 6"
            fill={backgroundColor ? backgroundColor : '#333333'}
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 0 16 0ZM16 2V16H2V2H16Z"
            fill={backgroundColor ? backgroundColor : '#333333'}
          />
        </svg>
      )}
    </div>
  )
}
