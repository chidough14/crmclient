import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import ActivityItem from './ActivityItem'

const ActivityColumn = ({ col: { list, id, total } }) => {

  return (
    <Droppable droppableId={id}>
      {provided => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <p style={{textAlign: "center", fontSize: "14px"}}>
            <b>{id}</b> <br></br> ${total}
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '120px'
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {list.map((item, index) => (
                <ActivityItem  item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default ActivityColumn