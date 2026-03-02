import { useRef, useState } from 'react'
import ArrowDropdown from 'remixicon-react/ArrowDropDownLineIcon'

import { useClickOutside } from '../../hooks/useClickOutside'
import { Tooltip } from '../Tooltip/Tooltip'

import './CustomDropdown.scss'

interface Option {
  value: number
  label: string
}

interface CustomDropdownProps {
  options: Option[]
  value: number
  onChange: (value: number, index: number) => void
  placeholder?: string
  id?: string
  label?: string
  icon?: React.ReactNode
  infoText?: string
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  id,
  label,
  icon,
  infoText,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutside(ref, () => setOpen(false), open)

  const selectedLabel = options.find(opt => opt.value === value)?.label || ''

  return (
    <div className="fm-custom-dropdown" ref={ref}>
      {label && (
        <label htmlFor={id} className="fm-input-label">
          {icon} {label} {infoText && <Tooltip label={infoText ? infoText : ''} iconSize="14px" />}
        </label>
      )}
      <div
        className={`fm-custom-dropdown-selected${open ? ' open' : ''}`}
        id={id}
        onClick={() => setOpen(prev => !prev)}
      >
        {selectedLabel || <span className="placeholder">{placeholder} </span>}

        <ArrowDropdown className="arrow" />
      </div>
      {open && (
        <ul className="fm-custom-dropdown-list">
          {options.map((opt, index) => (
            <li
              key={opt.value}
              className={opt.value === value ? 'selected' : ''}
              onClick={() => {
                onChange(opt.value, index)
                setOpen(false)
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
