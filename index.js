const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");

const menu = {
    body: '👋 Welcome to Hitpa! Please select an option below:',
    options: [
      {
        text: '📝 Policy Data',
        value: 'policy-data'
      },
      {
        text: '💳 Ecard',
        value: 'ecard'
      },
      {
        text: '📋 Claim Status',
        value: 'claim-status'
      },
      {
        text: '🏠 Main Menu',
        value: 'main-menu'
      },
      {
        text: '👋 Exit',
        value: 'exit'
      }
    ]
  };
  const msg_body = 'select an option';
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;//Sainath token


app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];


    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }

});

app.post("/sendtexttemplate/:toNumber",(req,res)=>{

    const axios = require('axios');
    
    axios.post('https://graph.facebook.com/v15.0/114396201588531/messages', {
      messaging_product: 'whatsapp',
      to: req.params.toNumber, // get the toNumber parameter from the URL
      type: 'template',
      template: {
        name: '👋 Welcome to Hitpa! Please select an option:\n\n📝 1. Policy Data\n💳 2. Ecard\n📋 3. Claim Status\n🏠 4. Main Menu\n👋 5. Exit',
        language: {
          code: 'en_US',
        },
      },
    }, {
      headers: {
        'Authorization': 'Bearer WZAaPvXtAobU',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    })
    
app.post("/webhook",(req,res)=>{ //i want some 

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body);

               axios({
                   method:"POST",
                   url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
                   data:{
                       messaging_product:"whatsapp",
                       to:from,
                       text:{
                        body: "👋 Welcome to Hitpa! Please select an option:\n\n📝 1. Policy Data\n💳 2. Ecard\n📋 3. Claim Status\n🏠 4. Main Menu\n👋 5. Exit,your message is "+msg_body
                       }
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

               });

               res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }

    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});