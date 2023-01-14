import { Avatar, Badge, Divider, Menu, MenuItem } from '@mui/material'
import { Notifications, NotificationsActive } from '@mui/icons-material';
import React, { useState } from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';




const BellNotification = ({inbox, allUsers, invitedMeetings}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate()
  //console.log(inbox, inbox?.filter((a) => !a.isRead)?.length );

  return (
    <div>
      <Badge 
        color="primary" 
        badgeContent={inbox?.filter((a) => !a.isRead)?.length + invitedMeetings?.filter((b)=> !moment(b.event.end).isBefore(moment()))?.length}
      >
        <Notifications style={{cursor: "pointer"}}  onClick={handleClick} />
      </Badge>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
         <Divider>Inbox</Divider>
        {
          inbox?.filter((a) => !a.isRead).length ? 
          inbox?.filter((a) => !a.isRead).map((a) => {
            let username
            if (!a.sender_id) {
              username = "Auto Generated"
            } else {
               username = allUsers?.find((b)=> b.id === a.sender_id)?.name
            }
            return <MenuItem onClick={()=>navigate(`/messages/${a.id}`, {state: {isInbox: true, isRead: a.isRead, auto: !a.sender_id ? true : false}})}>
                    <p><b>{a.subject} </b>sent from <b>{username}</b></p><br></br>
                    <p><b>Date:</b> {moment(a.created_at).format("MMMM Do YYYY, h:mm a")}</p>
                  </MenuItem>
          }) :   <p style={{marginLeft: "130px"}}>You have no new messages</p>
         
        }
         <Divider>Meetings</Divider>
        {
          invitedMeetings?.filter((b)=> !moment(b.event.end).isBefore(moment())).length ?
          invitedMeetings?.filter((b)=> !moment(b.event.end).isBefore(moment())).map((a) => (
            <MenuItem>
              <p><b>Name :</b> <b>{a.meetingName}</b></p><br></br>
              <p><b>Date:</b> {moment(a.event.start).format("MMMM Do YYYY, h:mm a")}</p>
            </MenuItem>
          )) : <p style={{marginLeft: "130px"}}>You have no meetings</p>
        }
        
      </Menu>
    </div>
  )
}

export default BellNotification