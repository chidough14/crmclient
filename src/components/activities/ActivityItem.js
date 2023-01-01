import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import {styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  width: "80%",
  lineHeight: '60px',
}));

const ActivityItem = ({item, index}) => {
  return (
    <Draggable draggableId={item.id.toString()} index={index} key={item.id.toString()}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
         
          <Item>
            {item.label}
          </Item>
          <br></br>
        </div>
      )}
    </Draggable>
  )
}

export default ActivityItem