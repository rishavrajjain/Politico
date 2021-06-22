import React,{useState,useEffect} from 'react';
import Navbar from '../layout/Navbar';
import './auth.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';

export default function Signup(props) {
  const token = localStorage.getItem('app-token')

  useEffect(()=>{
      if(token){
          props.history.push('/dashboard');
      }
    },[props.history])

    const [loading,setLoading]=useState(false);

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [name,setName]=useState('');

    const onEmailChange=(e)=>{
        setEmail(e.target.value);
    }

    const onPasswordChange=(e)=>{
        setPassword(e.target.value);
    }

    const onNameChange=(e)=>{
        setName(e.target.value)
    }

    const submit=async (e)=>{
        e.preventDefault();

        
        if(name === '' || password === '' || email === ''){
            
            toast.error('❌ Name,Email or Password cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
                
                return;
        }
        setLoading(true);
        try{
            const res= await axios.post(`${process.env.REACT_APP_API_BASE_URL}/createuser`,{
                name:name,
                email:email,
                password:password
            })

            localStorage.setItem('app-token',res.data.data.token);
            localStorage.setItem('name',res.data.data.name);
            localStorage.setItem('email',res.data.data.email)
            props.history.push('/dashboard');

            toast.success('🦄 Account created. Login Successfull !', {
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
            console.log(err);
            if(err.response.status === 400){
                toast.error('❌ Email/User already exists.Please Login', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                    setLoading(false);
                    return;
            }
            setLoading(false);

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
                    setLoading(false);
                    return;
            }
            setLoading(false);
        }
        setLoading(false);
    }

    return (
        <div>
        <Navbar/>
        <LoadingOverlay
          active={loading}
          spinner
          text='Loading ...'
          >
        
        <div className="container login-page">
        <div className="row" style={{margin:10}}>
        
        <div class="form">
        <div class="form-toggle"></div>
        <div class="form-panel one">
          <div class="form-header">
            <h1>Create Account</h1>
          </div>
          <div class="form-content">
            <form onSubmit={submit}>
              <div class="form-group"><label for="Name">Name</label><input type="text" id="name" name="name" onChange={onNameChange} required="required" /></div>
              <div class="form-group"><label for="email">Email</label><input type="text" id="email" name="email" onChange={onEmailChange} required="required" /></div>
              <div class="form-group"><label for="password">Password</label><input type="password" id="password" name="password" required="required" onChange={onPasswordChange} /></div>
              
              <div class="form-group"><button type="submit">Sign Up</button></div>
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
