import React, { useState, useEffect } from 'react';
import './auth.css';
import LoadingOverlay from 'react-loading-overlay';
import {toast} from 'react-toastify';
import axios from 'axios';


import Navbar from '../layout/Navbar';

export default function Login(props) {

  const token = localStorage.getItem('app-token')

  useEffect(()=>{
      if(token){
          props.history.push('/dashboard');
      }
  },[props.history])

    const [loading,setLoading] = useState(false);

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const onEmailChange=(e)=>{
        setEmail(e.target.value);
    }

    const onPasswordChange=(e)=>{
        setPassword(e.target.value);
    }

    const submit=async(e)=>{
        e.preventDefault();

        if(password === '' || email === ''){
            
            toast.error('❌ Email or Password cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }
        setLoading(true);
        try{
            const res= await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`,{
                email:email,
                password:password
            })

            localStorage.setItem('app-token',res.data.data.token);
            localStorage.setItem('name',res.data.data.name);
            localStorage.setItem('email',res.data.data.email)

            props.history.push('/dashboard');

            toast.success('🦄 Login Successfull !', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            setLoading(false);
        }catch(err){
            

            if(err.response.status === 401){
                toast.error('❌ Unauthorized.Invalid credentials', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }

            if(err.response.status === 500){
                toast.error('❌ Something went wrong.Please try again.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }
            setLoading(false);
        }
        setLoading(false);
        
    }
    return (
      
        <div>
        <LoadingOverlay
          active={loading}
          spinner
          text='Loading ...'
          >
        <Navbar/>
        
        <div className="container login-page">
        <div className="row" style={{margin:10}}>
        
        <div class="form">
        <div class="form-toggle"></div>
        <div class="form-panel one">
          <div class="form-header">
            <h1>Account Login</h1>
          </div>
          <div class="form-content">
            <form onSubmit={submit}>
              <div class="form-group"><label for="username">Email</label><input type="text" id="email" name="email" required="required" onChange={onEmailChange}/></div>
              <div class="form-group"><label for="password">Password</label><input type="password" id="password" name="password" required="required" onChange={onPasswordChange}/></div>
              
              <div class="form-group"><button type="submit">Log In</button></div>
            </form>
          </div>
        </div>
        <div class="form-panel two">
          
        </div>
        </div>
        
      </div>
        
       
        
        </div>
        </LoadingOverlay>
        </div>
        
    )
}
