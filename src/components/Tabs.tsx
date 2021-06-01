import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'

export default withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#3f51b5',
  },
})(Tabs)
