/* eslint-disable */
const cheerio = require("cheerio");
const iconv = require('iconv-lite');

const fetch = require("node-fetch");
exports.handler = async function(event, context) {
   try {
     const response = await fetch("https://x.shahaizi.com/invite/order_review_2.php", {
        method: "POST",
        body: "sex=0&y=1970&m=11&d=12&h=11&i=11&cY=106&cM=863&cD=25892&cH=310590&term1=20%2F%A3%A8+11+%D4%C2+8+%C8%D5+4+%A3%BA5+%A3%A9&term2=21%2F%A3%A8+11+%D4%C2+23+%C8%D5+1+%A3%BA28+%A3%A9&start_term=371132&end_term=2194648&start_term1=20%2F%A3%A8+11+%D4%C2+8+%C8%D5+4+%A3%BA5+%A3%A9&end_term1=22%2F%A3%A8+12+%D4%C2+7+%C8%D5+20+%A3%BA48+%A3%A9&lDate=1970%C4%EA%CA%AE%D4%C214%C8%D5&order_type=1",
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    });
     if (!response.ok) {
       // NOT res.status >= 200 && res.status < 300
       return { statusCode: response.status, body: response.statusText };
     }
     const data = await response.text();

     return {
       statusCode: 200,
       body: data 
     };
   } catch (err) {
     console.log(err); // output to netlify function log
     return {
       statusCode: 500,
       body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
     };
   }
//  fetch("/.netlify/functions/node-fetch", { headers: { accept: "Accept: application/json" } })
 //   .then((x) => x.json())
 //   .then(({ msg }) => setMsg(msg))
};
