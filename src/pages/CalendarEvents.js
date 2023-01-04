import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
//import events from "../services/events.js"
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Alert, Grid, Snackbar } from '@mui/material';
import instance from '../services/fetchApi.js';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents, updateEvent } from '../features/EventSlice.js';
import EventModal from '../components/events/EventModal.js';
import ViewEventModal from '../components/events/ViewEventModal.js';


const DnDCalendar = withDragAndDrop(Calendar)

// moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const CalendarEvents = () => {
  const {events} = useSelector(state => state.event)
  const [myEvents, setMyEvents] = useState([])
  const [open, setOpen] = useState(false);
  const [openViewEventModal, setOpenViewEventModal] = useState(false);
  const [eventObj, setEventObj] = useState(undefined);
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch()
  const { activities } = useSelector((state) => state.activity) 
  const user = useSelector((state) => state.user)

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {

      setOpen(true)
      setStartTime(start)
      setEndTime(end)
    },
    [setStartTime, setEndTime, setOpen]
  )

  // useEffect(()=> {
  //   const getEventsResult = async () => {

  //     await instance.get(`events`)
  //     .then((res)=> {
  //       dispatch(setEvents({events: res.data.events}))
  //     })
  //   }

  //   getEventsResult()
  // }, [])

  
  useEffect(()=> {
    let eventItems = events.map((a) => {
      return {
        ...a,
        start : moment(a.start).toDate(),
        end : moment(a.end).toDate()
      }
    })

    setMyEvents(eventItems)
  }, [events])

  const handleSelectEvent = useCallback(
    (event) => {
     setOpenViewEventModal(true)
     setEventObj(event)
    }, [setOpenViewEventModal, setEventObj]
  )

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  )

  const updateCalendarEvent = async (e) => {
    const body = {
      start: e.start,
      end: e.end
    }

    dispatch(updateEvent({event: {
      ...e.event,
      start: e.start,
      end: e.end
    }}))

    await instance.patch(`events/${e.event.id}`, body)
    .then(() => {
       setOpenAlert(true)
       setAlertMessage("Event updated successfully")
       setSeverity("success")
    })
    .catch((err)=> {
      setOpenAlert(true)
      setAlertMessage("An error was encountered")
      setSeverity("warning")
    })
  }

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
        onDragStart={(e)=> console.log("drag", e)}
        onEventDrop={(e)=> updateCalendarEvent(e)}
        onEventResize={(e)=> updateCalendarEvent(e)}
      />

      <EventModal
        open={open}
        setOpen={setOpen}
        startTime={startTime}
        endTime={endTime}
        activities={activities.filter((a) => a.user_id === user.id)}
        user={user}
      />

      <ViewEventModal
        open={openViewEventModal}
        setOpen={setOpenViewEventModal}
        event={eventObj}
        relatedActivity={activities.find((a) => a.id === eventObj?.activity_id)}
      />

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
       
  )
}

export default CalendarEvents

CalendarEvents.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}