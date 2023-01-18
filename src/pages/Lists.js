import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import {  Button, Toolbar, Typography } from '@mui/material';
import ListCard from '../components/lists/ListCard';
import ListModal from '../components/lists/ListModal';
import "./list.css"
import instance from '../services/fetchApi';
import { setLists } from '../features/listSlice';
import Pagination from '@mui/material/Pagination';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


export default function Lists() {
  const token = getToken()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {lists} = useSelector((state) => state.list)
  const [page, setPage] = React.useState(1)

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const getListsResult = async (pageNo = 1) => {

    await instance.get(`mylists?page=${pageNo}`)
    .then((res)=> {
      console.log(res);
      dispatch(setLists({lists: res.data.lists}))
    })
  }

  React.useEffect(() => {
    getListsResult()
  }, [])

  React.useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])


  return (
    <div >
      <Toolbar>
        <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }} >My Lists</Typography>

        <Button variant="contained" onClick={handleOpen} className="addButton" size='small' style={{borderRadius: "30px"}}>Add list</Button>
      </Toolbar>
      <div className="cards">
        {
          lists?.data?.map((list, idx) => (
            <Grid item key={idx} >
              <ListCard list={list} />
            </Grid>
          ))
        }  
      
      </div>

      <div style={{marginTop: "50px", marginLeft: "40%"}}>
        <Pagination
          count={ Math.ceil(lists?.total / lists?.per_page)}
          onChange={(page, idx) => {
            getListsResult(idx)
          }}
          color="secondary"
          showFirstButton
          showLastButton
        />
      </div>
      <ListModal
         open={open}
         setOpen={setOpen}
      />
    </div>
  );
}