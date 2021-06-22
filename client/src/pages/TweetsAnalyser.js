import axios from 'axios';
import React, { useState,useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactWordcloud from 'react-wordcloud';
import { Treemap } from "recharts";
import './style.css';

export default function TweetsAnalyser(props) {

    const [tweet,setTweet]=useState(null);
    const [user,setUser]=useState(null);
    const [replies,setReplies]=useState('');
    const [loading,setLoading]=useState(true);
    const [data,setData]=useState([]);
    const [showGraph,setShowGraph]=useState(false);
    const [words,setWords]=useState([])//Wordcloud data
    const [treeMapPos,setTreeMapPos]=useState([]);
    const [treeMapNeg,setTreeMapNeg]=useState([]);

    const getDate = (date) => {
        const data = new Date(date);
        return data.toDateString();
    }

    const options = {
        rotations: 2,
        rotationAngles: [-90, 0],
    };
    const size = [600, 400];

    useEffect(()=>{
        const token = localStorage.getItem('app-token');
            var config = {
                headers: { 'Authorization': `Bearer ${token}`,
                'Content-type':'application/json'
            }
        };

        const id = props.match.params.id;

        const getTweet = async()=>{
            try{
                const tweetRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tweet/${id}`,config);
                setTweet(tweetRes.data.data);
                setReplies(tweetRes.data.replies)

                const userRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/${tweetRes.data.data.data.author_id}`,config);
                setUser(userRes.data.data);

                const expertAIToken = process.env.REACT_APP_EXPERT_AI_TOKEN;
                config = {
                headers: { 'Authorization': `Bearer ${expertAIToken}`,
                'Content-type':'application/json'
                    }
                };
                const sentiment = await axios.post('https://nlapi.expert.ai/v2/analyze/standard/en/sentiment',{
                document:{
                    text:tweetRes.data.replies
                }
               
                },config)
                const chartData=[];
                chartData.push({
                    name:'Positive',
                    polarity:sentiment.data.data.sentiment.positivity
                })
                chartData.push({
                    name:'Negative',
                    polarity:sentiment.data.data.sentiment.negativity
                })
                chartData.push({
                    name:'Overall',
                    polarity:sentiment.data.data.sentiment.overall
                })
                const keywords = await axios.post('https://nlapi.expert.ai/v2/analyze/standard/en/relevants',{
                    document:{
                        text:tweetRes.data.replies
                    }
                },config);

                const posSentiment=[];
        const negSentiment = [];

        sentiment.data.data.sentiment.items.map((item)=>{

            if(item.sentiment >0){
                posSentiment.push({
                    name:item.lemma,
                    size:item.sentiment
                })
            }else{
                negSentiment.push({
                    name:item.lemma,
                    size:item.sentiment
                })
            }   
           
        })

        setTreeMapPos([{
            name:'Positive',
            children:posSentiment
        }])

        setTreeMapNeg([
            {
                name:'Negative',
                children:negSentiment
            }
        ])

        const temp=[];
        keywords.data.data.mainSyncons.map((syncon)=>{
            temp.push({
                text:syncon.lemma,
                value: Math.ceil(syncon.score)
            })
        })

        keywords.data.data.mainPhrases.map((phrase)=>{
            temp.push({
                text:phrase.value,
                value: Math.ceil(phrase.score)
            })
        })

        keywords.data.data.mainLemmas.map((lemma)=>{
            temp.push({
                text:lemma.value,
                value: Math.ceil(lemma.score)
            })
        })

        
                setWords(temp);
        
                setData(chartData)
                setShowGraph(true);
                setLoading(false);
                
            
            }catch(err){
                console.log(err);
                setLoading(false);
            }
            
        }
        
        getTweet();
    },[])

    
    


    

    return loading ? (<div class="d-flex justify-content-center" style={{ marginTop: '5rem' }}>

            <div class="col-sm-6 text-center"><p>Loading ...</p>
                <div class="loader4"></div>

            </div>

        </div>):(
        <div>
        <Navbar/>
            <div className="container" style={{marginTop:'3rem',marginBottom:'3rem'}}>
                 <div class="card" style={{marginTop:'5rem'}}>
                    <div class="card-horizontal" style={{display:'flex',flex: '1 1 auto'}}>
                        <div class="img-circle-wrapper" style={{padding:'1rem'}}>
                            <img class="rounded-circle img-fluid" src={user.data.profile_image_url} height="60" width="60" alt="Card image cap"/>
                        </div>
                        <div class="card-body">
                            <a href={user.data.url} class="card-title">{user.data.name}</a>
                            <p class="card-text">{tweet.data.text}</p>
                        </div>
                    </div>
                     <div class="card-footer" >
                        <small class="text-muted"><i className="fa fa-calendar"></i> {getDate(tweet.data.created_at)}</small>
                        
                    </div>
                </div>

               

                <div style={{marginTop:'2rem'}}>

                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    {
                    showGraph ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="polarity" fill="#8884d8" />
                            
                            </BarChart>
                        </ResponsiveContainer>
                    ):(
                        <div></div>
                    )
                }
                    
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <ReactWordcloud words={words} options={options}
                        size={size} />

                    
                    </div>
                
                </div>

                {
                    showGraph ? (
                        <div className="row" style={{marginTop:'2rem'}}>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <Treemap
                        width={600}
                        height={400}
                        data={treeMapPos}
                        dataKey="size"
                        ratio={4 / 3}
                        stroke="#fff"
                        fill="green"
                        isAnimationActiveBoolean={false}
                    >
                        <Tooltip />
                    </Treemap>
                
                </div>

                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <Treemap
                        width={600}
                        height={400}
                        data={treeMapNeg}
                        dataKey="size"
                        ratio={4 / 3}
                        stroke="#fff"
                        fill="red"
                        isAnimationActiveBoolean={false}
                    >
                        <Tooltip />
                    </Treemap>
                
                </div>
            
            
            </div>
                    ):(
                        <div></div>
                    )
                }

                
                

                
               
                </div>
                
                
                

               

                
                
            </div>
            
            

        </div>
    )
}

