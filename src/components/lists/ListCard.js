import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { MoreVert } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import ListModal from './ListModal';
import { closeAlert, removeList, showAlert } from '../../features/listSlice';
import instance from '../../services/fetchApi';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const ListCard = ({list}) => {

  const dispatch = useDispatch()
  const token = getToken()
  const navigate = useNavigate()

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [openDialog, setOpenDialog] = React.useState(false);
  //const [openAlert, setOpenAlert] = React.useState(false);

  const {openAlert} = useSelector((state) => state.list)

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const showEditModal = (event) => {
    event.stopPropagation()
    handleOpen()
  };

  const handleClickOpen = (event) => {
    event.stopPropagation()
    setOpenDialog(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeAlert())
  };

  const deleteList = async (id, e) => {
    // const res = await instance({
    //   url: `mylists/${id}`,
    //   method: "DELETE",
    // })

    const res = await instance.delete(`mylists/${id}`)

    if (res.data.status === "success"){
      dispatch(showAlert())
      dispatch(removeList({listId: id}))
    }
  };

  return (
    <>
      <Card 
        sx={{ minWidth: 300 }}
      >
        <CardContent>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
              {moment(list.created_at).format("MMMM Do YYYY")}
            </Typography>

            <IconButton 
              aria-label="settings"
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVert />
            </IconButton>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={showEditModal}>Edit</MenuItem>
              <MenuItem onClick={handleClickOpen}>Delete</MenuItem>
            </Menu>
          </div>
          
          <Typography variant="h6" component="div">
            {list.name}
          </Typography>
          <Typography variant="body2">
          {list.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => navigate(`/listsview/${list.id}`)}>Learn More</Button>
        </CardActions>
      </Card>

      <ListModal 
        list={list}
        open={openModal}
        setOpen={setOpenModal}
      />


      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete List
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this list ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button onClick={(e) => deleteList(list.id, e)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          List deleted successfully
        </Alert>
      </Snackbar>
    </>
  );
}

export default ListCard