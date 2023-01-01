import { Box, CircularProgress, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getSingleList, setSingleList } from '../features/listSlice';
import instance from '../services/fetchApi';

const SingleList = () => {
  const {id} = useParams()
  const dispatch = useDispatch()
  const {list} = useSelector((state) => state.list)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getList = async () => {
      await instance.get(`mylists/${id}`)
      .then((res) => {
        dispatch(setSingleList({list: res.data.list}))
        setLoading(false)
      });
    }


    getList()
  }, [])

  return ( 
    <>
      <Grid container justifyContent='center'>
        <Grid item sm={10}>
          {
            loading ? (
               <div style={{marginTop: "30px"}}>
                Loading List <CircularProgress/>
               </div>
            ) : (
              <>
                <h1>{ list?.name }</h1>
                <hr />
                <p>{list?.description}</p>
              </>
            )
          }
         
        </Grid>
       
      </Grid>
    </>
  )
}

export default SingleList