import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';

const showIcon = (type) => {
  if (type === "Call") {
    return <PhoneIcon  fontSize='12'/>
  } else if (type === "Email") {
    return <EmailIcon  fontSize='12'/>
  } else if (type === "Meeting") {
    return <ChatIcon  fontSize='12' />
  }
}

const ActivityCard = (activity) => (
  <Card sx={{  width: "90%", }}>
    <CardContent>
      <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
        {moment(activity.created_at).format("MMMM Do YYYY")}
      </Typography>
      <Typography sx={{ mb: 0.5 }} color="text.primary">
        <b>{activity.label}</b>
      </Typography>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <Typography variant="body2">
          {activity.description}
        </Typography>
        {showIcon(activity.type)}
      </div>
      <Typography sx={{ fontSize: 14, mb: -2, color: "blue" }} >
          ${activity.earningEstimate}
      </Typography>
    </CardContent>
  </Card>
)

const ActivityItem = ({item, index}) => {
  return (
    <Draggable draggableId={item.id.toString()} index={index} key={item.id.toString()}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >

          {ActivityCard(item)}
          <br></br>
        </div>
      )}
    </Draggable>
  )
}

export default ActivityItem