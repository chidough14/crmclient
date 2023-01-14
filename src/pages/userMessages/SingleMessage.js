import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { readInboxMessages, setSingleMessage } from '../../features/MessagesSlice'
import instance from '../../services/fetchApi'
import { getToken } from '../../services/LocalStorageService'
import ComposeMessage from './ComposeMessage'

const SingleMessage = () => {
  const params = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const { singleMessage } = useSelector(state => state.message)
  const {allUsers} = useSelector(state => state.user)
  const [replyMode, setReplyMode] = useState(false)
  const [activityId, setActivityId] = useState()
  const navigate = useNavigate()

  const token = getToken()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  useEffect(() => {

    const getMessage = async () => {
      await instance.get(`messages/${params.id}`)
      .then((res) => {
        dispatch(setSingleMessage({message: res.data.messageDetails}))
      })
    }

    const readMessage = async () => {
      await instance.patch(`messages/${params.id}/read`, {isRead: true})
      .then((res) => {
        dispatch(readInboxMessages({messageId: res.data.messageDetails.id}))
      })
    }

    if (params.id) {
      getMessage()

      if (!location.state?.isRead && location.state?.isInbox) {
        readMessage()
      }
    
    }

  }, [params?.id])

  useEffect(()=> {
    if(location.state?.auto) {
      let mySubString = singleMessage?.message?.substring(
        singleMessage?.message.indexOf("(") + 1, 
        singleMessage?.message.lastIndexOf(")")
      );

      setActivityId(parseInt(mySubString))
    }
   

  
  }, [singleMessage])

  return (
    <>
      {
        replyMode &&
        <Tooltip title="Back" placement="top">
          <Button onClick={() => setReplyMode(false)}>
            <ArrowBack />
          </Button>
        </Tooltip>
      }

      {
        !replyMode &&
        <Tooltip title="Back to Messages" placement="top">
          <Button onClick={() => navigate("/messages")}>
            <ArrowBack />
          </Button>
        </Tooltip>
      }
      
      {
        replyMode ? (
          <ComposeMessage replyMode={replyMode} singleMessage={singleMessage}/>
        ) : (
          <Box
            sx={{  bgcolor: 'background.paper', height: 224, marginTop: "20px" }}
          >
            <Typography variant='h7'>
              <b>Subject</b> : {singleMessage?.subject}
            </Typography>
            <p></p>
            {
              location.state?.isInbox &&
              <>
              {
                location?.state?.auto ? (
                <Typography variant='h7'>
                  <b>Sent By</b> : Auto Generated
                </Typography>
                ) : (
                <Typography variant='h7'>
                  <b>Sent By</b> : {allUsers?.find((a) => a.id === singleMessage?.sender_id)?.name} ({allUsers?.find((a) => a.id === singleMessage?.sender_id)?.email})
                </Typography>
                )
              }
                <p></p>
              </>
            }
           
            <Typography variant='h7'>
              <b>Date</b> : {moment(singleMessage?.created_at).format("MMMM Do YYYY, h:mm a")}
            </Typography>
            <p></p>
            <Typography variant='h7'>
              <b>Message</b> : 
            </Typography>
            <div style={{border: "1px solid black", width: "50%", height: "250px", borderRadius: "10px"}}>
              {!singleMessage?.sender_id ? singleMessage?.message.replace(/ *\([^)]*\) */g, "") : singleMessage?.message}
              {
                activityId ? (
                  <>
                  <p></p>
                  <Button onClick={()=> navigate(`/activities/${activityId}`)}>View Activity</Button>
                  </>
                ) : null
              }
             
            </div>
            <p></p>
             
            {
              location.state?.isInbox && (
                <Button 
                  size='small' 
                  color="error" 
                  variant="contained" 
                  onClick={() => {
                    setReplyMode(true)
                  }}
                  disabled={location?.state?.auto }
                  style={{borderRadius: "30px"}}
                >
                  Reply
                </Button>
              ) 
            } 
           
          </Box>
        )
      }
     

    </>
  )
}

export default SingleMessage