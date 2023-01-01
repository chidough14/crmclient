import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setSingleCompany } from '../features/companySlice'
import instance from '../services/fetchApi'

const Company = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const {company} = useSelector(state => state.company)
  
  useEffect(() => {
    const fetchCompany = async () => {
      await instance.get(`companies/${params.id}`)
      .then((res)=> {
        console.log(res);
        dispatch(setSingleCompany({company: res.data.company}))
      })
    }

    fetchCompany()
  }, [params.id])

  return (
    <div>{company?.name}</div>
  )
}

export default Company