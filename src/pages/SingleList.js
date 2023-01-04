import { Box, CircularProgress, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom'
import { emptyCompanyObject } from '../features/companySlice';
import { getSingleList, setSelectedCompanyId, setSingleList } from '../features/listSlice';
import instance from '../services/fetchApi';
import Company from './Company';

const SingleList = () => {
  const {id} = useParams()
  const dispatch = useDispatch()
  const {list} = useSelector((state) => state.list)
  const [loading, setLoading] = useState(true)
  const {pathname} = useLocation()
  const [comp, setComp] = useState(list?.companies[0])
  const {company} = useSelector((state) => state.company)

  useEffect(() => {
    const getList = async () => {
      await instance.get(`mylists/${id}`)
      .then((res) => {
        if (res.data.list.companies.length) {
          dispatch(setSelectedCompanyId({id: res.data.list.companies[0].id}))
        } else {
          dispatch(emptyCompanyObject())
        }
        dispatch(setSingleList({list: res.data.list}))
        setLoading(false)
      });
    }


    getList()
  }, [])

  return ( 
    <>
      <Company />
    </>

    // <>
    //   <Grid container justifyContent='center'>
    //     <Grid item sm={10}>
    //       {
    //         loading ? (
    //            <div style={{marginTop: "30px"}}>
    //             Loading List <CircularProgress/>
    //            </div>
    //         ) : (
    //           <>
    //             <h1>{ list?.name }</h1>
    //             <hr />
    //             <p>{list?.description}</p>
    //           </>
    //         )
    //       }
         
    //     </Grid>
       
    //   </Grid>
    // </>
  )
}

export default SingleList