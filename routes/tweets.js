const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');


const auth = require('../middleware/auth');

dotenv.config();


const router = express.Router();



const bearer_token = process.env.TWITTER_BEARER_TOKEN;


router.get('/search/:keyword',async(req,res)=>{

    const keyword = req.params.keyword;
    try{
        var config = {
            method: 'get',
            url: `https://api.twitter.com/2/tweets/search/recent?query=${keyword}&max_results=10`,
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

        

        const result = await axios(config);
        var allText='';
        result.data.data.map((tweet)=>{
            allText=allText+tweet.text+"."
        })
        res.status(200).json({
            text:allText,
            data:result.data
            
        })

        
    }catch(error){
        console.log(error)
        res.send(error)
    }

})

router.get('/user/search/:username',async(req,res)=>{

    const username = req.params.username;
    try{
        var config = {
            method: 'get',
            url: `https://api.twitter.com/2/users/by/username/${username}?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld`,
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

        

        const result = await axios(config);

        config = {
            method: 'get',
            url: `https://api.twitter.com/2/users/${result.data.data.id}/tweets?tweet.fields=author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,referenced_tweets,reply_settings,source,text`,
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

        const recenttweets = await axios(config);
        var allText='';
        recenttweets.data.data.map((tweet)=>{
            allText=allText+tweet.text+"."
        })
        
        res.status(200).json({
            data:recenttweets.data,
            userdata:result.data,
            text:allText
        })

        
    }catch(error){
        console.log(error)
        res.send(error)
    }

})


router.get('/trends/metadata',auth,async(req,res)=>{
    
    try{
        var config = {
            method: 'get',
            url: `https://api.twitter.com/1.1/trends/available.json`,
            
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

       

        const result = await axios(config);
        const countryList =[];

        result.data.map((country)=>{
            if(country.placeType.name == "Country"){
                countryList.push(country)
            }
        })
        res.status(200).json({
            data:countryList
            
        })

        
    }catch(error){
        console.log(error)
        res.send(error)
    }
})

router.get('/trends/country/:countryId',async(req,res)=>{

    try{
        var config = {
            method: 'get',
            url: `https://api.twitter.com/1.1/trends/place.json?id=${req.params.countryId}`,
            
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

       

        const result = await axios(config);
        // var allText='';
        // result.data.data.map((tweet)=>{
        //     allText=allText+tweet.text+"."
        // })
        res.status(200).json({
            data:result.data
            
        })

        
    }catch(error){
        console.log(error)
        res.send(error)
    }


})


router.get('/tweet/:id',async(req,res)=>{
    const id = req.params.id;

    try{
        var config = {
            method: 'get',
            url: `https://api.twitter.com/2/tweets/${id}?tweet.fields=author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,referenced_tweets,reply_settings,source,text,withheld`,
            
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

        const result = await axios(config);

        

        config = {
            method: 'get',
            url: `https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${id}&tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id`,
            
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

       

        const replies = await axios(config);
        var repliesText = '';
        repliesText=repliesText+result.data.data.text
        replies.data.data.map((reply)=>{
            repliesText=repliesText+reply.text+"."
        })
        
        res.status(200).json({
            data:result.data,
            replies:repliesText
            
        })

        
    }catch(error){
        console.log(error)
        res.send(error)
    }

    
})

router.get('/user/:id',async(req,res)=>{
    
    try{
        var config = {
            method: 'get',
            url: `https://api.twitter.com/2/users/${req.params.id}?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld`,
            
            headers: { 
                'User-Agent':'Axios 0.21.1',
                'Authorization':`Bearer ${bearer_token}`
             }
        };

       

        const result = await axios(config);
        res.status(200).json({
            data:result.data
            
        })

        
    }catch(error){
        console.log(error)
        res.send(error)
    }
})

// https://api.twitter.com/2/tweets/search/recent?query=conversation_id:1279940000004973111&tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id' 




module.exports =  router;