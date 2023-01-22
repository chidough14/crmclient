import { CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import ActivityItem from './ActivityItem'

const ActivityColumn = ({ col: { list, id, total }, loading }) => {

  return (
    <Droppable droppableId={id}>
      {provided => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "10px",
            backgroundColor: id === "Low" ? ' 	#E8E8E8' :
                            id === "Medium" ? "#DCDCDC" :
                            id === "High" ? "#D3D3D3" : "#C0C0C0"
            // backgroundColor: id === "Low" ? ' #FFC8FF' :
            //                  id === "Medium" ? "#FFB4FF" :
            //                  id === "High" ? "#dda0dd" : "#90EE90"
          }}
        >
          <p style={{textAlign: "center", fontSize: "14px", marginBottom: "30px"}}>
            <b>{id}</b> <br></br> ${total}
          </p>

          {
            loading ? (
              <div style={{ marginLeft: "45%", marginTop: "120px" }}>
                {/* <CircularProgress /> */}
                <Typography variant='h7'>
                  <b>Loading...</b>
                </Typography>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '120px',
                }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {list.map((item, index) => (
                    <ActivityItem  activity={item} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )
          }
        
        </div>
      )}
    </Droppable>
  )
}

export default ActivityColumn