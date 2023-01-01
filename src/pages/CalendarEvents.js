import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
//import events from "../services/events.js"
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Grid } from '@mui/material';
import instance from '../services/fetchApi.js';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents } from '../features/EventSlice.js';


const DnDCalendar = withDragAndDrop(Calendar)

// moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const CalendarEvents = () => {
  const {events} = useSelector(state => state.event)
  const [myEvents, setMyEvents] = useState([])
  const dispatch = useDispatch()

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt('New Event name')
      if (title) {
        setMyEvents((prev) => [...prev, { start, end, title }])
      }
    },
    [setEvents]
  )

  useEffect(()=> {
    const getEventsResult = async () => {

      await instance.get(`events`)
      .then((res)=> {
        console.log(res);
        dispatch(setEvents({events: res.data.events}))
      })
    }

    getEventsResult()
  }, [])

  
  useEffect(()=> {
    let xx = events.map((a) => {
      return {
        ...a,
        start : moment(a.start).toDate(),
        end : moment(a.end).toDate()
      }
    })

    console.log(xx);

    setMyEvents(xx)
  }, [events])

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  )

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  )

  return (
    <div style={{width: "100%", height: "100%"}}>
      <DnDCalendar
        defaultDate={defaultDate}
        defaultView={Views.WEEK}
        events={myEvents}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        scrollToTime={scrollToTime}
        eventPropGetter={
          (event, start, end, isSelected) => {
            let newStyle = {
              backgroundColor: "#DDA0DD",
              color: 'black',
              borderRadius: "0px",
              border: "none"
            };
      
            if (event.isMine){
              newStyle.backgroundColor = "lightgreen"
            }
      
            return {
              className: "",
              style: newStyle
            };
          }
        }
        draggableAccessor={(event) => true}
        onDragStart={()=> console.log("drag")}
        onEventDrop={()=> console.log("drop")}
        onEventResize={()=> console.log("resize")}
      />
    </div>
       
  )
}

export default CalendarEvents

CalendarEvents.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}