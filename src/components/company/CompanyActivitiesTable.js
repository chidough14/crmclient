import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import avatar from '../../assets/avtar9.jpg';


const activityItems = [
  {
    id: 1,
    name: "Office Chairs",
    price: 2000,
    quantity: 10
  },
  {
    id: 2,
    name: "44 inch Monitors",
    price: 10000,
    quantity: 20
  },
  {
    id: 3,
    name: "WiFi Routers",
    price: 12000,
    quantity: 15
  }
]

const getInitials = (string) => {
  let names = string?.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();
  
  if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate()
  const {allUsers} = useSelector(state => state.user)

  let image_src = allUsers?.find((a)=> a.id === row.user_id)?.profile_pic

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.label}
        </TableCell>
        <TableCell >{row.description}</TableCell>
        <TableCell >{row.assignedTo}</TableCell>
        <TableCell >{row.probability}</TableCell>
        <TableCell >
        
          
          <Tooltip title={allUsers?.find((a)=> a.id === row.user_id)?.name}>
            {
              ( image_src === ""  || image_src === null) ? (
                <div 
                  style={{
                    display: "inline-block",
                    backgroundColor: "gray" ,
                    borderRadius: "50%",
                    cursor: "pointer",
                    // width: "30px",
                    // height: "30px",
                    //margin: "10px",
                  }}
                  onClick={() => navigate(`/profile/${allUsers?.find((a)=> a.id === row.user_id)?.id}`)}
                >
                  <p 
                    style={{
                      color: "white",
                      display: "table-cell",
                      verticalAlign: "middle",
                      textAlign: "center",
                      textDecoration: "none",
                      height: "30px",
                      width: "30px",
                      fontSize: "15px"
                    }}
                  >
                    {getInitials(allUsers?.find((a)=> a.id === row.user_id)?.name)}
                  </p>
                </div>
              ) : (
                <img 
                  width="30px" 
                  height="30px" 
                  src={image_src}  
                  alt='profile_pic' 
                  style={{borderRadius: "50%", cursor: "pointer"}} 
                  onClick={() => navigate(`/profile/${allUsers?.find((a)=> a.id === row.user_id)?.id}`)}
                />
              )
            }
          
          </Tooltip>
          
        </TableCell>
        <TableCell >{row.type}</TableCell>
        <TableCell >
          <Button style={{borderRadius: "30px"}} onClick={() => navigate(`/activities/${row.id}`)}>
          View Activity
          </Button>
        </TableCell>
      </TableRow>
      {/* Collapsible */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h7" gutterBottom component="div">
                <b>Activity Items</b>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {Math.round(item.quantity * item.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    assignedTo: PropTypes.string.isRequired,
    probability: PropTypes.string.isRequired,
    earningEsimate: PropTypes.number,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

const ComanyActivitiesTable = ({rows}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Label</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Probablity</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Type</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ComanyActivitiesTable