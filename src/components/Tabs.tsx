import React from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Box, Typography } from '@material-ui/core';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box style={{ marginTop: '20px' }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

export const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: '#3f51b5',
    },
})(Tabs);

interface StyledTabProps {
    label: string;
}
  
export const AntTab = withStyles((theme: Theme) =>
    createStyles({
      root: {
        textTransform: 'none',
        minWidth: 72,
        backgroundColor: 'transparent',
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
          color: '#3f51b5',
          opacity: 1,
        },
        '&$selected': {
          color: '#3f51b5',
          fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
          color: '#3f51b5',
        },
      },
      selected: {},
    }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);