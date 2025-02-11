import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
    },
  }),
)

interface Props {
  color?: string
}

const FolderIcon = ({ color }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3762_7526)">
          <path
            d="M4 18.5C3.45 18.5 2.97933 18.3043 2.588 17.913C2.19667 17.5217 2.00067 17.0507 2 16.5V4.5C2 3.95 2.196 3.47933 2.588 3.088C2.98 2.69667 3.45067 2.50067 4 2.5H10L12 4.5H20C20.55 4.5 21.021 4.696 21.413 5.088C21.805 5.48 22.0007 5.95067 22 6.5V16.5C22 17.05 21.8043 17.521 21.413 17.913C21.0217 18.305 20.5507 18.5007 20 18.5H4Z"
            fill={color ? color : '#FCFCFC'}
          />
        </g>
        <defs>
          <clipPath id="clip0_3762_7526">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

export default FolderIcon
