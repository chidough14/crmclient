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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/LocalStorageService';

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

const UserMessages = () => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch()

  const token = getToken()
  const navigate = useNavigate()
  const {inbox, outbox}  = useSelector(state => state.message)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getInboxMessages = async (page = 1) => {

    await instance.get(`inboxmessages?page=${page}`)
    .then((res)=> {
      dispatch(setInboxMessages({inbox: res.data.inbox}))
    })
  }

  const getOutboxMessages = async (page = 1) => {

    await instance.get(`outboxmessages?page=${page}`)
    .then((res)=> {
      dispatch(setOutboxMessages({outbox: res.data.outbox}))
    })
  }

  useEffect(()=> {
    getInboxMessages()
    getOutboxMessages()
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
          <UserMessagesTable messages={inbox} isInbox={true} getInboxMessages={getInboxMessages} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UserMessagesTable messages={outbox} isInbox={false} getOutboxMessages={getOutboxMessages}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ComposeMessage />
        </TabPanel>
      </Box>
    </>
  );
}

export default UserMessages