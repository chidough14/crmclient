import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ContentPasteOff, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import {  Box, Button, Chip, Snackbar, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DeleteDialog from '../userMessages/DeleteDialog';
import instance from '../../services/fetchApi';
import { removeMeeting } from '../../features/MeetingSlice';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});




const MeetingsTable = ({meetings, showModal, user}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [recordId, setRecordId] = React.useState();
  const dispatch = useDispatch()
  const [openAlert, setOpenAlert] = React.useState(false)


  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const renderBadge = (meeting) => {
    if (meeting.status) {
      if (moment().isBetween(meeting.event.start, meeting.event.end, 'milliseconds', null)) {
        return <Link to={`/join/${meeting.meetingId}`} style={{color: 'black'}}><Chip  size="small" label="Join" color="success" style={{cursor: "pointer"}} /></Link>
      } else if (moment(meeting.event.end).isBefore(moment())) {
        return <Chip  size="small" label="Ended" color="secondary" />
      } else {
        return <Chip  size="small" label="Upcoming" color="primary" />
      }
    } else return <Chip  size="small" label="Cancelled" color="error" />
  }

  const deleteMeeting = (value) => {
    setOpenDialog(true)
    setRecordId(value?.id)
  };

  const handleDelete = async () => {
    await instance.delete(`meetings/${recordId}`)
    .then(() => {
      setOpenAlert(true)
      dispatch(removeMeeting({meetingId: recordId}))
      setOpenDialog(false)
    })
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell>Title</TableCell> */}
              <TableCell >Meeting Name</TableCell>
              <TableCell >ID</TableCell>
              <TableCell >Type</TableCell>
              <TableCell >Date</TableCell>
              <TableCell >Status</TableCell>
              <TableCell >Invited users</TableCell>
              <TableCell align='right' >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
            !meetings?.length ? (
              <TableRow   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <div style={{marginTop: "50px", marginLeft: "170%"}}>
                  <ContentPasteOff sx={{fontSize: "64px"}}/>
                  <Typography variant='h7' sx={{display: "flex", width: "150px"}}>No Meetings</Typography>
                </div>
                 

              </TableRow>
            
            ) :
            meetings?.map((row) => (
            
              <TableRow
                key={row.meetingId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.meetingName}
                </TableCell>
                <TableCell >{row.meetingId}</TableCell>
                <TableCell >{row.meetingType}</TableCell>
                <TableCell >{moment(row.event.start).format("MMMM Do YYYY, h:mm a")}</TableCell>

                <TableCell >
                  {renderBadge(row)}

                </TableCell>

                <TableCell >{row.invitedUsers.map((a) => <p>{a}</p>)}</TableCell>

                <TableCell align='right'>
                  <Tooltip title="Edit" placement="top">
                    <Button
                      disabled={!row.status || moment(row.event.end).isBefore(moment()) || row.user_id !== user.id}
                      onClick={() => showModal(row)}
                    >
                      <EditOutlined />
                    </Button>
                    
                  </Tooltip>
                  <Tooltip title="Delete" placement="top" disabled={row.user_id !== user.id}>
                    <Button>
                      <DeleteOutlined
                        style={{cursor: "pointer"}}
                        onClick={() => deleteMeeting(row)}
                      />
                    </Button>
                   
                  </Tooltip>

                  <Tooltip title="Copy link" placement="top">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`${process.env.REACT_APP_HOST}/join/${row.meetingId}`)
                        alert(`Link copied : ${process.env.REACT_APP_HOST}/join/${row.meetingId}`)
                      }}
                    >
                      <ContentCopyIcon
                      />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <DeleteDialog
        open={openDialog}
        setOpen={setOpenDialog}
        handleDelete={handleDelete}
        meeting={true}
      />

    <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
      <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
        Meeting Deleted
      </Alert>
    </Snackbar>
    </>
 
  );
}


export default MeetingsTable