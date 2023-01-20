import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import {  Button, CircularProgress, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import ListCard from '../components/lists/ListCard';
import ListModal from '../components/lists/ListModal';
import "./list.css"
import instance from '../services/fetchApi';
import { setLists, setSortOptionValue } from '../features/listSlice';
import Pagination from '@mui/material/Pagination';
import SortButton from './orders/SortButton';
import { Box } from '@mui/system';
import { AddOutlined, SearchOutlined } from '@mui/icons-material';


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
  const {lists, sortOption} = useSelector((state) => state.list)
  const [page, setPage] = React.useState(1)

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const handleOpen = () => setOpen(true);

  const getListsResult = async (pageNo = 1) => {
    setLoading(true)
    await instance.get(`mylists?page=${pageNo}`)
    .then((res)=> {
      dispatch(setLists({lists: res.data.lists}))
      setLoading(false)
    })
  }

  const getSortedLists = async (option, page = 1) => {
    setLoading(true)
    await instance.get(`filter-lists/${option}?page=${page}`)
    .then((res) => {
      dispatch(setLists({lists: res.data.lists}))
      setLoading(false)
    })
  }

  const getSearchResult = async (page = 1) => {
    setLoading(true)
    await instance({
      url: `search-lists?query=${searchQuery}&page=${page}`,
      method: "GET",
    }).then((res) => {
      dispatch(setSortOptionValue({option: ""}))
      dispatch(dispatch(setLists({lists: res.data.lists})))
      setLoading(false)
    });
  }

  React.useEffect(() => {
    setPage(lists?.current_page)
  }, [lists?.current_page])

  React.useEffect(() => {
      if (sortOption === "all") {
        getListsResult()
      } else {
        getSortedLists(sortOption)
      }
  }, [sortOption])

  React.useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

 

  React.useEffect(()=> {
    if (searchQuery.length === 3){
      getSearchResult()
    }
  }, [searchQuery])

  const setSortOption =  (value) => {
    dispatch(setSortOptionValue({option: value}))
  }

  const closeSearch =  () => {
    setSearchQuery("")
    setShowSearch(false)
  }

  return (
    <div >
      <Toolbar>
        <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }} >My Lists</Typography>
        
        {
          showSearch && (
            <TextField
              className='text'
              size="small"
              label="Search lists"
              InputProps={{
                type: 'search',
              }}
              onChange={(e)=> setSearchQuery(e.target.value)}
            />
          )
        }
      
        <Tooltip title="Search lists">
          <SearchOutlined
            style={{cursor: "pointer"}}
            onClick={() => {
              setShowSearch(prev => !prev)
              setSearchQuery("")
            }}
          />
        </Tooltip>
       

        <SortButton setSortOption={setSortOption} sortOption={sortOption} listpage={true}  closeSearch={closeSearch} />

        <Tooltip title="Add List">
          <Button variant="contained" onClick={handleOpen} className="addButton" size='small' style={{borderRadius: "30px", marginLeft: "30px"}}>
            <AddOutlined />
          </Button>
        </Tooltip>
      </Toolbar>
      <div className="cards">
        {
          loading ? (
            <div style={{ width: "300%", marginLeft: "190%" }}>
              <CircularProgress />
            </div>
          ) :
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
          page={page}
          onChange={(page, idx) => {
           
            if (searchQuery.length) {
               getSearchResult(idx)
            } else {
              if (sortOption === "all") {
                getListsResult(idx)
              } else {
                getSortedLists(sortOption, idx)
              }
            }
            
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