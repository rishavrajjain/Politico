import axios from 'axios';
import React, { useState,useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactWordcloud from 'react-wordcloud';
import { Treemap } from "recharts";
import './style.css';


export default function Dashboard(props) {

    const [keyword,setKeyWord]=useState('');

    const [data,setData]=useState([]);
    const [showGraph,setShowGraph]=useState(false);
    const [countries,setCountries]=useState([]);
    const [loading,setLoading]=useState(true);
    const [country,setCountry]=useState({
        name:'India',
        woeid:'23424848'
    })

    const [words,setWords]=useState([])//Wordcloud data
    const [sentences,setSentences]=useState('');

    const [trends,setTrends]=useState([]);

    const [treeMapPos,setTreeMapPos]=useState([]);
    const [treeMapNeg,setTreeMapNeg]=useState([]);
    

    const getTrends = async(woeid)=>{
        try{
            const res=  await axios.get(`${process.env.REACT_APP_API_BASE_URL}/trends/country/${woeid}`)
            setTrends(res.data.data[0].trends);
        }catch(err){
            console.log(err);
        }
        
    }

    useEffect(()=>{
        const token = localStorage.getItem('app-token');
            var config = {
                headers: { 'Authorization': `Bearer ${token}`,
                'Content-type':'application/json'
            }
        };

        const getCountryData = async()=>{
            try{
                const countryList = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/trends/metadata`,config);
                setCountries(countryList.data.data);
                setLoading(false);
            }catch(err){
                console.log(err);
                setLoading(false);
            }
            
        }
        getTrends(country.woeid);
        getCountryData();
        
    },[country.woeid])

    
    const searchTrend = (trendName)=>{
        setKeyWord(trendName);
    }

    const countryChange = async(e)=>{
        const countryData = e.target.value.split("|");
        const temp = {
            name:countryData[1],
            woeid:countryData[0]

        }

        setCountry(temp);
        getTrends(countryData[0])
    }

    const options = {
  rotations: 2,
  rotationAngles: [-90, 0],
};
const size = [600, 400];

    

    

    const submit = async ()=>{
        const token = localStorage.getItem('app-token');
            var config = {
                headers: { 'Authorization': `Bearer ${token}`,
                'Content-type':'application/json'
            }
        };

        try{
            const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/search/${keyword}`,config);
            console.log(result)
            

            const expertAIToken = process.env.REACT_APP_EXPERT_AI_TOKEN;
            config = {
            headers: { 'Authorization': `Bearer ${expertAIToken}`,
            'Content-type':'application/json'
         }
        };

        const sentiment = await axios.post('https://nlapi.expert.ai/v2/analyze/standard/en/sentiment',{
            document:{
                text:result.data.text
            }
        },config)
        const keywords = await axios.post('https://nlapi.expert.ai/v2/analyze/standard/en/relevants',{
            document:{
                text:result.data.text
            }
        },config);

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
        console.log(keywords);
        console.log(sentiment)
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
        setData(chartData)
        setShowGraph(true);
        }catch(err){
            console.log(err)
        }


        

        
        
    }

    
    return loading ? (<div class="d-flex justify-content-center" style={{ marginTop: '5rem' }}>

            <div class="col-sm-6 text-center"><p>Loading ...</p>
                <div class="loader4"></div>

            </div>

        </div>):(
        <div>
            <Navbar/>
            <div className="container" style={{marginTop:'3rem',marginBottom:'3rem'}}>
            <div className="row">


            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            
                <div className="row" style={{marginTop:'5rem'}}>
                    <select class="form-select form-control" aria-label="Default select example" onChange={countryChange}>
                    {
                        countries.map((country_ind)=>{
                            return(
                                <option value={country_ind.woeid+"|"+country_ind.name}>{country_ind.name}</option>
                            )
                        })
                    }
                        
                    </select>
                </div>

                <h1 style={{color:'#5846f9',marginTop:'2rem'}} ><i className="fa fa-line-chart"></i>{'  '+country.name}</h1>
                <div className="row" >
                    
                    {
                        trends.map((trend)=>{
                            return(
                                <h4 onClick={()=>searchTrend(trend.name[0]=='#'?trend.name.slice(1):trend.name)} className="badge badge-primary" style={{backgroundColor:'#5846f9',marginLeft:'8px'}}><i className="fa fa-tags"></i>{trend.name}</h4>
                            )
                        })
                    }
                    
                </div>
            </div>

            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
            <label for="exampleFormControlTextarea1" style={{marginTop:'3rem'}}>Enter Keyword</label>

                <input name="keyword" className="form-control" type="text" value={keyword} onChange={(e)=>{setKeyWord(e.target.value)}} ></input> 
                

                <button onClick={submit} className="btn btn-block " style={{marginTop:'1.5rem',backgroundColor:'#5846f9',color:'white'}}>Submit</button>

                <div style={{marginTop:'2rem'}} className="row">

                <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12">
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
                <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12">
                
                    <ReactWordcloud words={words} options={options}
                size={size} />
                </div>
                </div>

                {
                    showGraph ? (
                        <div>
                        <div className="row">
                    <div className="col" >

                    <div class="card">
                    <div class="card-body" dangerouslySetInnerHTML={{ __html: sentences }}>
                        
                    </div>
                    </div>

                       
                    </div>
                
                </div>
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
</div>
                    ):(
                        <div></div>
                    )
                }

                
            
            </div>
            
            
            </div>

            



            
                
                

                
                
                
                
                
                
                

               

                
                
            </div>
        </div>
    )
}


