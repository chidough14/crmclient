import { Button, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {DragDropContext} from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import ActivityColumn from '../components/activities/ActivityColumn'
import ActivityModal from '../components/activities/ActivityModal'
import { setActivities, updateActivityProbability } from '../features/ActivitySlice'
import instance from '../services/fetchApi'

const Activities = () => {
  const [columns, setColumns] = useState([])
  const [activityId, setActivityId] = useState()
  const dispatch = useDispatch()
  const { activities } = useSelector((state) => state.activity) 
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // useEffect(() => {
  //   const fetchActivities = async () => {
  //     await instance.get(`/activities`)
  //     .then((res) => {
  //       dispatch(setActivities({activities: res.data.activities}))
  //     })
  //   }

  //   fetchActivities()
  // }, [])

  useEffect(() => {
    let cols  = {
      Low: {
        id: 'Low',
        list: activities.filter((a) => a.probability === "Low")
      },
      Medium: {
        id: 'Medium',
        list: activities.filter((a) => a.probability === "Medium")
      },
      High: {
        id: 'High',
        list: activities.filter((a) => a.probability === "High")
      },
      Closed: {
        id: 'Closed',
        list: activities.filter((a) => a.probability === "Closed")
      },
    
    }


    setColumns(cols)
   
  }, [activities])

  const onDragStart  = (e, f) => {
    console.log(e, f);
    setActivityId(parseInt(e.draggableId))
  }

  const updateActivity  = async (value) => {
    let body = {
      probability: value
    }

    await instance.patch(`activities/${activityId}`, body)
    .then((res) => {
      console.log(res);
      dispatch(updateActivityProbability({activity: res.data.activity}))
    })
  }

  const onDragEnd = ({ source, destination }) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null

    // If the source and destination columns are the same
    // AND if the index is the same, the item isn't moving
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null


    // Set start and end variables
    const start = columns[source.droppableId]
    const end = columns[destination.droppableId]

    // If start is the same as end, we're in the same column
    if (start === end) {
      console.log("1111");
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_, idx) => idx !== source.index
      )

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index])

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList
      }

      // Update the state
      setColumns(state => ({ ...state, [newCol.id]: newCol }))
      return null
    } else {
      console.log("222", source, destination);
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (_, idx) => idx !== source.index
      )

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList
      }

      // Make a new end list array
      const newEndList = end.list

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index])

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList
      }

      // Update the state
      setColumns(state => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }))

      updateActivity(destination.droppableId)

      return null
    }
  }

  return (
    <div>
      <Toolbar>
        <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }} >My Activities</Typography>

        <Button variant="contained" size='small' className="addButton" onClick={handleOpen}>Add Activity</Button>
      </Toolbar>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            margin: '24px auto',
            width: '100%',
            gap: '8px'
          }}
        >
          {Object.values(columns).map((col, i) => (
            <ActivityColumn col={col} key={i} />
          ))}
        </div>
      </DragDropContext>

      <ActivityModal
        open={open}
        setOpen={setOpen}
      />
    </div>
   
  )
}

export default Activities