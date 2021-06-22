import axios from 'axios';
import React, { useState,useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactWordcloud from 'react-wordcloud';
import { Treemap } from "recharts";
import './style.css';

export default function RecentAnalysis(props) {

    const [tweet,setTweet]=useState(null);
    const [user,setUser]=useState(null);
    const [replies,setReplies]=useState('');
    const [loading,setLoading]=useState(true);
    const [data,setData]=useState([]);
    const [showGraph,setShowGraph]=useState(false);
    const [words,setWords]=useState([])//Wordcloud data
    const [treeMapPos,setTreeMapPos]=useState([]);
    const [treeMapNeg,setTreeMapNeg]=useState([]);
    const [sentences,setSentences]=useState('');

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
        setUser(props.location.state.user)
        const token = localStorage.getItem('app-token');
            var config = {
                headers: { 'Authorization': `Bearer ${token}`,
                'Content-type':'application/json'
            }
        };

        

        const getAnalysis = async()=>{
            try{
                

                const expertAIToken = process.env.REACT_APP_EXPERT_AI_TOKEN;
                config = {
                headers: { 'Authorization': `Bearer ${expertAIToken}`,
                'Content-type':'application/json'
                    }
                };
                const sentiment = await axios.post('https://nlapi.expert.ai/v2/analyze/standard/en/sentiment',{
                document:{
                    text:props.location.state.recentTweets
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
                        text:props.location.state.recentTweets
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

        var sent ='';

        keywords.data.data.mainSentences.map((sen)=>{
            sent=sent+`<p>${sen.value}</p>`+`<br></br>`;
        })

        setSentences(sent);

        
                setWords(temp);
        
                setData(chartData)
                setShowGraph(true);
                setLoading(false);
                
            
            }catch(err){
                console.log(err);
                setLoading(false);
            }
            
        }
        
        getAnalysis();
    },[])


    console.log(props.location.state.recentTweets)
    return loading ? (<div class="d-flex justify-content-center" style={{ marginTop: '5rem' }}>

            <div class="col-sm-6 text-center"><p>Loading ...</p>
                <div class="loader4"></div>

            </div>

        </div>):(
        <div>
        <Navbar/>
            <div className="container" style={{marginTop:'3rem',marginBottom:'3rem'}}>
                 

               

                <div style={{marginTop:'5rem'}}>

                <div className="row">
                    <div className="col">
                    {
                        words.map((word)=>{
                            return(
                                <h4 className="badge badge-primary" style={{marginRight:'0.5rem',backgroundColor:'#5846f9'}}><i className="fa fa-tags"></i>{word.text}</h4>
                            )
                        })
                    }
                        
                    </div>
                
                </div>

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

                <div className="row">
                    <div className="col">
                        <div class="card">
                    <div class="card-body" dangerouslySetInnerHTML={{ __html: sentences }}>
                        
                    </div>
                    </div>
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
