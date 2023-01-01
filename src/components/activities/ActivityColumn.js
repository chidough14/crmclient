import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import ActivityItem from './ActivityItem'

const ActivityColumn = ({ col: { list, id } }) => {
  return (
    <Droppable droppableId={id}>
      {provided => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{textAlign: "center"}}>{id}</h3>
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