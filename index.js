const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
let mydata =null;
const messageBody=null;

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


// app.listen(process.env.PORT,()=>{
//     console.log("webhook is listening");
// });
app.listen(8080,()=>{
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

app.get("/sendtexttemplate",(req,res)=>{

    console.log("sendtexttemplate is triggered");
    const axios = require('axios');
    
    axios.post('https://graph.facebook.com/v15.0/114396201588531/messages', {
      messaging_product: 'whatsapp',
      //to: req.params.toNumber, // get the toNumber parameter from the URL
      to: '916309780970',
      type: 'template',
      template: {
        "name": "hello_world",
        language: {
          code: 'en_US',
        },
      },
    }, {
      headers: {
        'Authorization': 'Bearer EAANmlKuCV0cBAI4DgMrQ9UwtuKYsTQWAZBuduIpBuSaFLm4A2Wyof3V67gXkjaGCqKIMwQY7EBPpqXOT7ljxmCWrd25tYC8sbZCtYTV2bt0SyZAzTe3JDHru5sRZC7bNtZBj4qu4Ezb1xy4K3lJey9xb8eXTLIGOirSWhH27bI7xllhp78DqP5VZCrTHQqHOsDIGFnyid54WZAaPvXtAobU',
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
    
    app.get("/getpolicydetails", (req, res) => {
        const axios = require('axios');
        console.log("inside body getpolicydetails");
        // Set the API endpoint URL and request payload
        const url = 'http://223.30.163.105:91/api/EnrollmentInformation/GetMemberPolicyDetails?UHID=1418000002578701';
        const data = {
          // Your request payload goes here
        };
        // Set the request headers, if needed
        const headers = {
          // Your request headers go here
        };
        // Make the API call using axios
        axios.get(url, data, { headers })
          .then(response => {
            // Handle the API response here
            mydata = response.data;
          })
          .catch(error => {
            // Handle any errors here
            console.error(error);
          });
        // console.log(mydata);
        messageBody = " Dear User Please Find Your Policy Data \n CustomerName:" + mydata.CustomerName + "\n" + "Policy No:" + mydata.PolicyNumber;
        console.log(messageBody);
      });
      
      // Use the route inside the post request handler function
      app.post("/webhook", async (req, res) => {
        let body_param = req.body;
        console.log(JSON.stringify(body_param, null, 2));
        if (body_param.object) {
          console.log("inside body param");
        messageBody="👋 Welcome to Hitpa! Please select an option:\n\n📝 1. Policy Data\n💳 2. Ecard\n📋 3. Claim Status\n🏠 4. Main Menu\n👋 5. Exit";
        console.log(messageBody);
          if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("boady param " + msg_body);
            if (msg_body.trim().toLowerCase() === "policy") {
              // Call the route defined outside the post request handler function
              app.get("/getpolicydetails", (req, res) => {});
            }
            axios({
              method: "POST",
              url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
              data: {
                messaging_product: "whatsapp",
                to: from,
                text: {
                  body: messageBody,
                }
              },
              headers: {
                "Content-Type": "application/json"
              }
            });
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        }
      });

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});


           