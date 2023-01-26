import { Box, TextField, Button, Alert, Typography, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { getToken } from '../../services/LocalStorageService';
import { useChangeUserPasswordMutation } from '../../services/userAuthApi';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined, SaveOutlined, UploadFileOutlined } from '@mui/icons-material';
import moment from 'moment';
import UploadWidget from './UploadWidget';
import instance from '../../services/fetchApi';
import { setUserInfo } from '../../features/userSlice';
import avatar from '../../assets/avtar9.jpg';

const MyAccount = () => {
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: ""
  });
  const [imageUrl, setImageUrl] = useState("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [changeUserPassword] = useChangeUserPasswordMutation()
  const token = getToken()
  const {id, name, email, created_at, profile_pic} = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (profile_pic !== "") {
      console.log(profile_pic);
      setImageUrl(profile_pic)
    }
  }, [profile_pic])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      password: data.get('password'),
      password_confirmation: data.get('password_confirmation'),
    }
    if (actualData.password && actualData.password_confirmation) {
      if (actualData.password === actualData.password_confirmation) {
        const res = await changeUserPassword({ actualData, token })
        console.log(res)
        if (res.data.status === "success") {
          document.getElementById("password-change-form").reset();
          setError({ status: true, msg: "Password Changed Successful", type: "success" });
        }
      } else {
        setError({ status: true, msg: "Password and Confirm Password Doesn't Match", type: "error" })
      }
    } else {
      setError({ status: true, msg: "All Fields are Required", type: "error" })
    }
  };

  const uploadImage = async (value) => {
    await instance.patch(`users/${id}`, {profile_pic: value})
    .then((res) => {
      console.log(res);
      dispatch(setUserInfo(res.data.user))
      setImageLoaded(false)
    })
  }

  return <>
    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: 600, mx: 4 }}>
     
      <div style={{display: "flex", justifyContent: 'space-between', marginTop: "30px"}}>
        <div>
          {
           ( imageUrl === ""  || imageUrl === null) ? (
              <img width="300px" height="300px" src={avatar}  alt='image' style={{borderRadius: "50%"}}/>
            ) : (
              <img width="300px" height="300px" src={imageUrl}  alt='image' style={{borderRadius: "50%"}}/>
            )
          }
          

            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Tooltip title='Change Picture'>
                <Button 
                  size='small' 
                >
                  <UploadWidget setImageUrl={setImageUrl} imageUrl={imageUrl} setImageLoaded={setImageLoaded} />
                </Button>
                
              </Tooltip>

              <Tooltip title='Save'>
                <Button 
                  variant="contained" 
                  size='small' 
                  onClick={() => {
                    uploadImage(imageUrl)
                  }} 
                  style={{borderRadius: "30px"}}
                  disabled={!imageLoaded}
                >
                  <SaveOutlined />
                </Button>
              </Tooltip>
            </div>
        </div>
        
        <div>
          <Typography variant="h7" display="block"  gutterBottom>
            <b>Name</b> : { name }
          </Typography>

          <Typography variant="h7" display="block"  gutterBottom>
            <b>Email</b> : { email }
          </Typography>

          <Typography variant="h7" display="block"  gutterBottom>
            <b>Date Registered</b> : { moment(created_at).format('MMMM Do YYYY') }
          
          </Typography>
  {/* 
          <Typography variant="h7" display="block"  gutterBottom>
            <b>Profile Picture</b> : <img width="200px" height="200px" src={imageUrl}  alt='image'/>
            <UploadWidget setImageUrl={setImageUrl} imageUrl={imageUrl} />
          
          </Typography> */}
        </div>
      </div>


      <h3>Change Password</h3>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} id="password-change-form">
        <TextField margin="normal" required fullWidth name="password" label="New Password" type="password" id="password" />
        <TextField margin="normal" required fullWidth name="password_confirmation" label="Confirm New Password" type="password" id="password_confirmation" />
        <Box textAlign='center'>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, px: 5 }}> Update </Button>
        </Box>
        {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""}
      </Box>
    </Box>
  </>;
};

export default MyAccount;
