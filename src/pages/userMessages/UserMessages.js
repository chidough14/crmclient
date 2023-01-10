import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UserMessagesTable from './UserMessagesTable';
import ComposeMessage from './ComposeMessage';
import { useEffect } from 'react';
import instance from '../../services/fetchApi';
import { setInboxMessages, setOutboxMessages } from '../../features/MessagesSlice';
import { useDispatch } from 'react-redux';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const UserMessages = ({inbox, outbox}) => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=> {
    const getUserMessages = async () => {

      await instance.get(`messages`)
      .then((res)=> {
        dispatch(setInboxMessages({inbox: res.data.inbox}))
        dispatch(setOutboxMessages({outbox: res.data.outbox}))
      })
    }

    getUserMessages()
  }, [])

  return (
    <>
    <Typography variant='h6'>Messages</Typography>
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224, marginTop: "20px" }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Inbox" {...a11yProps(0)} />
          <Tab label="Outbox" {...a11yProps(1)} />
          <Tab label="Compose" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <UserMessagesTable messages={inbox} isInbox={true} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UserMessagesTable messages={outbox} isInbox={false}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ComposeMessage />
        </TabPanel>
      </Box>
    </>
  );
}

export default UserMessages