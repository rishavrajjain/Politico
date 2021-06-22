import React,{Fragment, useEffect, useState} from 'react';
import './profile.css';
import axios from 'axios';

  import Navbar from '../layout/Navbar'
export default function Profile(props) {

    const [loading,setLoading]=useState(true);
    const [user,setUser] = useState({
        name:'',
        email:''
    });
    

    useEffect(()=>{
        var name = localStorage.getItem('name');
        var email = localStorage.getItem('email')
        const temp = {
            name:name,
            email:email
        }
        setUser(temp);
        setLoading(false);
    },[])

    

    const logout = async()=>{
        const token = localStorage.getItem('app-token');
            const config = {
                headers: { 'Authorization': `Bearer ${token}`,
                'Content-type':'application/json'
            }
        };
            localStorage.removeItem('app-token')
            localStorage.removeItem('name')
            localStorage.removeItem('email')
            props.history.push('/')
            
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout`,{},config).then((res)=>{
            localStorage.removeItem('app-token')
            localStorage.removeItem('name')
            localStorage.removeItem('email')
            props.history.push('/')
            
            
        }).catch(err=>{
            
        })
    }

    return loading?(
        <div class="d-flex justify-content-center" style={{ marginTop: '5rem' }}>

      <div class="col-sm-6 text-center"><p>Loading ...</p>
        <div class="loader4"></div>

      </div>

    </div>
    ):(
      <Fragment>
        <Navbar/>
      <div>
        
            
            
      <div className="container" style={{marginTop:'5rem',marginBottom:'10rem',alignContent:'center'}}>
      
          <div class="card" style={{width: '18rem',margin:'auto',alignContent:'center',alignItems:'center'}}>
          
          <img class="card-img-top img-fluid" style={{margin:'auto',marginTop:'2rem'}} src="https://www.gravatar.com/avatar/94d093eda664addd6e450d7e9881bcad?s=32&d=identicon&r=PG" class="rounded-circle" alt="Card image cap" height="100" width="100"/>
          <div class="card-body" style={{margin:'auto',alignContent:'center',alignItems:'center'}}>
          <h5 class="card-title" style={{textAlign:'center'}}>{user.name}</h5>
          <p class="card-text" style={{textAlign:'center'}}>{user.email}</p>
          <button className="btn btn-block" style={{backgroundColor:'#707BFB'}} onClick={logout}>Logout</button>
          
          
          
          </div>
          
          
          </div>
          
      </div>
      
      
      
  </div>
  

        
        </Fragment>
    )
}
