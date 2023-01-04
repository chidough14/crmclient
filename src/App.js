import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginReg from "./pages/auth/LoginReg";
import ResetPassword from "./pages/auth/ResetPassword";
import SendPasswordResetEmail from "./pages/auth/SendPasswordResetEmail";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import { useDispatch, useSelector } from "react-redux";
import Lists from "./pages/Lists";
import { useEffect, useState } from "react";
import { getToken } from "./services/LocalStorageService";
import ChangePassword from "./pages/auth/ChangePassword";
import { setUserInfo } from "./features/userSlice";
import { useGetLoggedUserQuery } from "./services/userAuthApi";
import Activities from "./pages/Activities";
import SingleList from "./pages/SingleList";
import CalendarEvents from "./pages/CalendarEvents";
import Company from "./pages/Company";
import instance from "./services/fetchApi";
import { setLists } from "./features/listSlice";
import { setActivities } from "./features/ActivitySlice";
import ActivityDetails from "./pages/activities/ActivityDetails";
import { setEvents } from "./features/EventSlice";

function App() {
  const token =  getToken()
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const { data, isSuccess } = useGetLoggedUserQuery(token)

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserInfo({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      }))
    }
  }, [data, isSuccess, dispatch])

  useEffect(() => {

    const getListsResult = async () => {

      await instance.get(`mylists`)
      .then((res)=> {
        dispatch(setLists({lists: res.data.lists}))
      })
    }

    const getActivitiesResult = async () => {

      await instance.get(`activities`)
      .then((res)=> {
        dispatch(setActivities({activities: res.data.activities}))
      })
    }

    const getEventsResult = async () => {

      await instance.get(`events`)
      .then((res)=> {
        dispatch(setEvents({events: res.data.events}))
      })
    }

    getEventsResult()
    getActivitiesResult()
    getListsResult()
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginReg />} />
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path="api/user/reset/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/listsview/:id" element={<SingleList />} />
            <Route path="/companies/:id" element={<Company />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/events" element={<CalendarEvents />} />
          </Route>
          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
