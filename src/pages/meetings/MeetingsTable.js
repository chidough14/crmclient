import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Box, Button, Chip, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';




const MeetingsTable = ({meetings, showModal, user}) => {
  const renderBadge = (meeting) => {
    if (meeting.status) {
      if (meeting.meetingDate === moment().format("L")) {
        return <Link to={`/join/${meeting.meetingId}`} style={{color: 'black'}}><Chip  size="small" label="Join" color="success" style={{cursor: "pointer"}} /></Link>
      } else if (moment(meeting.meetingDate).isBefore(moment().format('L'))) {
        return <Chip  size="small" label="Ended" color="secondary" />
      } else {
        return <Chip  size="small" label="Upcoming" color="primary" />
      }
    } else return <Chip  size="small" label="Cancelled" color="error" />
  }

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
            {meetings.map((row) => (
            
              <TableRow
                key={row.meetingId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.meetingName}
                </TableCell>
                <TableCell >{row.meetingId}</TableCell>
                <TableCell >{row.meetingType}</TableCell>
                <TableCell >{moment(row.meetingDate).format("DD-MMM-YYYY")}</TableCell>

                <TableCell >
                  {renderBadge(row)}

                </TableCell>

                <TableCell >{row.invitedUsers.map((a) => <p>{a}</p>)}</TableCell>

                <TableCell align='right'>
                  <Tooltip title="Edit" placement="top">
                    <Button
                      disabled={!row.status || moment(row.meetingDate).isBefore(moment().format("L")) || row.user_id !== user.id}
                      onClick={() => showModal(row)}
                    >
                      <EditOutlined />
                    </Button>
                    
                  </Tooltip>
                  <Tooltip title="Delete" placement="top">
                    <Button>
                      <DeleteOutlined
                        style={{cursor: "pointer"}}
                        onClick={() => {}}
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
    </>
 
  );
}


export default MeetingsTable