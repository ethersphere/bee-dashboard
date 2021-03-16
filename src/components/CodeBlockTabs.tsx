import React, { useEffect } from 'react';
import CodeBlock from './CodeBlock';
import { AntTab, AntTabs, TabPanel } from './Tabs';

interface IProps {
    linux: string;
    mac: string;
    showLineNumbers?: boolean
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function getOS() {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  if (macosPlatforms.includes(platform)) return 'macOS'
  
  if (iosPlatforms.includes(platform)) return 'iOS'
  
  if (windowsPlatforms.includes(platform)) return 'windows'
  
  if (/Android/.test(userAgent)) return 'android'
  
  if (/Linux/.test(platform)) return 'linux'
  
  return null;
}

export default function CodeBlockTabs(props: IProps) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
      let os = getOS()
      if(os === 'windows') {
        setValue(0)
      } else if (os === 'linux') {
        setValue(0)
      } else if (os === 'macOS') {
        setValue(1)
      } 

    }, [])

    return (
        <div>
            <AntTabs style={{ marginTop: '12px' }} value={value} onChange={handleChange} aria-label="ant example">
                <AntTab label="Linux" {...a11yProps(0)} />
                <AntTab label="MacOS" {...a11yProps(1)} />
            </AntTabs>
            <TabPanel value={value} index={0}>
                <CodeBlock
                showLineNumbers={props.showLineNumbers}
                language='bash'
                code={props.linux}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <CodeBlock
                showLineNumbers={props.showLineNumbers}
                language='bash'
                code={props.mac}
                />
            </TabPanel>
        </div>
    )
}
