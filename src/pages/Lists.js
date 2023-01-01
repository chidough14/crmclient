import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import instance from '../services/fetchApi';
import { setLists } from '../features/listSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import ListCard from '../components/ListCard';
import ListModal from '../components/ListModal';
import "./list.css"


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


export default function Lists() {

  const dispatch = useDispatch()
  const token = getToken()
  const navigate = useNavigate()
  const {lists} = useSelector((state) => state.list)

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  React.useEffect(() => {

    const getListsResult = async () => {

      await instance.get(`mylists`)
      .then((res)=> {
        console.log(res);
        dispatch(setLists({lists: res.data.lists}))
      })
    }

    getListsResult()
  }, [])

  React.useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])


  return (
    <>
      <Toolbar>
        <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }} >My Lists</Typography>

        <Button variant="contained" onClick={handleOpen} className="addButton" size='small'>Add list</Button>
      </Toolbar>
      <div className="cards">
        {
          lists?.map((list, idx) => (
            <Grid item key={idx} >
              <ListCard list={list} />
            </Grid>
          ))
        }
      </div>
      <ListModal
         open={open}
         setOpen={setOpen}
      />
    </>
  );
}