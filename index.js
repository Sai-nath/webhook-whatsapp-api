const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
let mydata =null;
let messageBody=null;


require('dotenv').config();

const app=express().use(body_parser.json());
const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

// app.listen(process.env.PORT,()=>{
//     console.log("webhook is listening");
// });
app.listen(8080,()=>{
    console.log("webhook is listening");
});

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

const getpolicydetails = async (req, res) => {
    const axios = require('axios');
    let body_param = req.body;
    let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
    let from = body_param.entry[0].changes[0].value.messages[0].from;
    let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
    console.log("inside body getpolicydetails");
    console.log(msg_body);
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
        messageBody = " Dear User Please Find Your Policy Data \n CustomerName:" + mydata.CustomerName + "\n" + "Policy No:" + mydata.PolicyNumber;
        messageBody = "Dear " + mydata.CustomerName + ",\n\nPlease find below your policy details:\n\n" +
        "Member ID: " + mydata.MemberID + "\n" +
        "Age: " + mydata.MemberAge + "\n" +
        "Gender: " + mydata.Gender + "\n" +
        "Address: " + (mydata.Address ?? "N/A") + "\n" +
        "Email ID: " + mydata.EmailID + "\n" +
        "Mobile Number: " + mydata.ContactNumber_Mob + "\n" +
        "Date of Birth: " + mydata.DateOfBirth + "\n" +
        "Caller Type: " + mydata.CallerType + "\n" +
        "Employee Number: " + mydata.EmployeeNumber + "\n" +
        "Company Name: " + mydata.CompanyName + "\n" +
        "Landline Number: " + (mydata.contactNumber_Land ?? "N/A") + "\n" +
        "UHID: " + mydata.UHID + "\n" +
        "Policy Number: " + mydata.PolicyNumber + "\n" +
        "Insurer Name: " + (mydata.InsurerName ?? "N/A") + "\n" +
        "Policy Effective Date: " + mydata.PolicyEffectiveDate + "\n" +
        "Policy End Date: " + mydata.PolicyEndDate + "\n" +
        "Policy Type: " + mydata.PolicyType + "\n" +
        "Product Name: " + mydata.ProductName + "\n" +
        "Policy Status: " + mydata.PolicyStatus + "\n" +
        "Service Tax: " + mydata.ServiceTax + "\n" +
        "Relationship: " + mydata.Relationship + "\n" +
        "Corporate Company Name: " + mydata.CorporateCompanyName + "\n" +
        "Sum Insured: " + mydata.SI + "\n" +
        "Benefit Sum Insured: " + mydata.BSI + "\n\n" +
        "If you have any questions or concerns about your policy, please don't hesitate to contact us.\n\n" +
        "If you want to access the previous menu, please type 'MENU'.\n\n" +
        "Thank you for choosing " + mydata.CompanyName + " as your insurance provider.\n\n" +
        "Best regards,\n" +
        "HiTPA Team";
        console.log(messageBody);
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
       // res.send(messageBody);
      })
      .catch(error => {
        // Handle any errors here
        console.error(error);
      });
  }
  
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
        'Authorization': 'Bearer EAANmlKuCV0cBAF9avtTJTVIovOZBbP0iUeQ4h7hjIh2whSSRu4gPvahUQnZBpBGKurewGsteGraxHeKrW127bj7184kgqZA2lZAURuPQhBqlbwd6PSHayHXkJsLOJkfgAOfq3K8Ub468gDSKfw0zXuXvH9NvXiesJTOyPOTE2Phi5AEyGXAqhcmRdcJlQDZAmDH5ebT1NSBtvSDqHRPBZC',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    });
    


app.post("/webhook", async (req, res) => {
        let body_param = req.body;
        console.log(JSON.stringify(body_param, null, 2));
        if (body_param.object) {
          console.log("inside body param");
        messageBody="👋 Welcome to Hitpa! Please select an option:\n\n📝 1. Policy Data\n💳 2. Ecard\n📋 3. Claim Status\n🏠 4. Main Menu\n👋 5. Exit";
        console.log("inside body param");
       let replytype =body_param.entry[0].changes[0].value.messages[0].type;
       let msg_body =null;
       if(replytype==="button")
       {
        msg_body =  body_param.entry[0].changes[0].value.messages[0].button.text;
       }
       else
       {
         msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
       }
          if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
          
           

            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("boady param " + msg_body);
            console.log("messageBody " + messageBody);
            console.log("token " + token);
            if (msg_body.trim().toLowerCase() === "1") {
                await getpolicydetails(req, res);
              } 
              else 
              {
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
          } }else {
            res.sendStatus(404);
          }
        }
      });

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});


           