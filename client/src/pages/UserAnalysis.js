import axios from 'axios';
import React, { useState,useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Link} from 'react-router-dom';
import './style.css';


export default function UserAnalysis(props) {
    const [username,setUsername]=useState('');

    const [user,setUser]=useState(null);
    const [tweets,setTweets]=useState([])
    const [showUser,setShowUser]=useState(false);
    const [tweetText,setTweetText]=useState('');

    

    const submit = async ()=>{
        const token = localStorage.getItem('app-token');
            var config = {
                headers: { 'Authorization': `Bearer ${token}`,
                'Content-type':'application/json'
            }
        };

        try{
            const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/search/${username}`,config);
            console.log(result)
            setUser(result.data.userdata)
            console.log(result.data.data.data)
            setTweets(result.data.data.data)
            setTweetText(result.data.text)

        //     const expertAIToken = process.env.REACT_APP_EXPERT_AI_TOKEN;
        // config = {
        //     headers: { 'Authorization': `Bearer ${expertAIToken}`,
        //     'Content-type':'application/json'
        //  }
        // };

        // const sentiment = await axios.post('https://nlapi.expert.ai/v2/analyze/standard/en/sentiment',{
        //     document:{
        //         text:result.data.text
        //     }
        // },config)
        // console.log(sentiment)
        // const chartData=[];
        // chartData.push({
        //     name:'Positive',
        //     polarity:sentiment.data.data.sentiment.positivity
        // })
        // chartData.push({
        //     name:'Negative',
        //     polarity:sentiment.data.data.sentiment.negativity
        // })
        // chartData.push({
        //     name:'Overall',
        //     polarity:sentiment.data.data.sentiment.overall
        // })
        // setData(chartData)
        setShowUser(true);
        }catch(err){
            console.log(err)
        }


        

        
        
    }

    const getDate = (date) => {
        const data = new Date(date);
        return data.toDateString();
    }

    
    return (
        <div>
            <Navbar/>
            <div className="container" style={{marginTop:'3rem',marginBottom:'3rem'}}>
                <label for="exampleFormControlTextarea1" style={{marginTop:'3rem'}}>Enter Username</label>

                <input name="keyword" className="form-control" type="text" onChange={(e)=>{setUsername(e.target.value)}} ></input> 
                

                <button onClick={submit} className="btn btn-block " style={{marginTop:'1.5rem',backgroundColor:'#5846f9',color:'white'}}>Submit</button>

                {
                    showUser ? (
                        <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                    
                            <div class="card" style={{marginTop:'2rem'}}>
                                <div class="card-horizontal" style={{display:'flex',flex: '1 1 auto'}}>
                                    <div class="img-circle-wrapper" style={{padding:'1rem'}}>
                                        <img class="rounded-circle img-fluid" src={user.data.profile_image_url} height="60" width="60" alt="Card image cap"/>
                                    </div>
                                    <div class="card-body">
                                        <a href={user.data.url} class="card-title">{user.data.name}</a>
                                        <p class="card-text">{user.data.description}</p>
                                    </div>
                                </div>
                                 <div class="card-footer">
                                    <small class="text-muted"><i className="fa fa-map-marker"></i> {user.data.location} | Followers : {user.data.public_metrics.followers_count} | Following : {user.data.public_metrics.following_count}</small>
                                </div>
                            </div>
                            
                       
                    
                    <Link 
                    to={{
                        pathname: "/recent/analysis",
                        state: {
                            recentTweets:tweetText,
                            user:user
                        },
                    }}
                    style={{marginTop:'1rem',backgroundColor:'#5846f9',color:'white'}} className="btn  btn-block">Analyse Recent Tweets</Link>
                    </div>

                    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                    {
                        tweets.map((tweet)=>{
                            return(
                                <div class="card" style={{marginTop:'2rem'}}>
                    <div class="card-horizontal" style={{display:'flex',flex: '1 1 auto'}}>
                        <div class="img-circle-wrapper" style={{padding:'1rem'}}>
                            <img class="rounded-circle img-fluid" src={user.data.profile_image_url} height="60" width="60" alt="Card image cap"/>
                        </div>
                        <div class="card-body">
                            <a href={user.data.url} class="card-title">{user.data.name}</a>
                            <p class="card-text">{tweet.text}</p>
                        </div>
                    </div>
                     <div class="card-footer" >
                        <small class="text-muted"><i className="fa fa-calendar"></i> {getDate(tweet.created_at)}</small>
                        <button className="btn " style={{marginLeft:'1rem',backgroundColor:'#5846f9',color:'white'}} onClick={()=>props.history.push(`/tweet/${tweet.id}`)}>Analyse</button>
                    </div>
                </div>
                            )
                        })
                    }
                    
                    </div>
                
                </div>
                    ):(
                        <div></div>
                    )
                }

                

                

                
                
            </div>
        </div>
    )
}


// {
//     showGraph ? (
//         <ResponsiveContainer width="100%" height={400}>
//             <BarChart
//             width={500}
//             height={300}
//             data={data}
//             margin={{
//                 top: 5,
//                 right: 30,
//                 left: 20,
//                 bottom: 5,
//             }}
//             >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="polarity" fill="#8884d8" />
            
//             </BarChart>
//         </ResponsiveContainer>
//     ):(
//         <div>Help</div>
//     )
// }