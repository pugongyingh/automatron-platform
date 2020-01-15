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
     const dataa = await response.arrayBuffer();
     var html =iconv.decode(Buffer.from(dataa), "gb2312");
     const $resultsPage = cheerio.load(html, { decodeEntities: false });
     let qqqqq = $resultsPage.html();
     let hhh = '<html><head><style>*{ margin:0;padding:0;} *html body{overflow:visible;} *html iframe, *html frame{overflow:auto;} *html frameset{overflow:hidden;} body{ font-size:100%; font-family:Arial,Calibri,Helvetica,sans-serif,宋体,黑体; background:#E7E1D1; } body,html { margin:0 auto; max-width: 640px; } body,ul,ol,li,p,h1,h2,h3,h4,h5,h6,form,fieldset,table,td,img,div,tr{ font-weight:normal; font-size:100%; margin:0; padding:0; } input,select,button{ font-size:100%; vertical-align:middle; } textarea,input{ word-wrap:break-word; word-break:break-all; padding:0px; } li{ list-style-type:none; } img{ border:0 none; } a:visited {text-decoration:none;color:#000000;} a:active{text-decoration:none;color:#000000;} a:hover { text-decoration:none;color:#FF0000;} a:link { text-decoration:none;color:#000000;} .clear{ clear:both; height:0px; width:100%; font-size:1px; line-height:0px; visibility:hidden; overflow:hidden;} .hidden{ display:none;} .block{ display:block;} .font_grey{ color:#666666; } .set_input{ font-size:110%; padding:4px 5px; } .set_submit{ padding:5px 15px; font-size:120%; } .set_select{ font-size:120%; } .app{ float:left; width:100%; } .app .app_header{ float:left; width:100%; margin-bottom:5px; } .app .app_header .header_a{ float:left; width:100%; height:60px; background:#E7E1D1 url("../images/139sbg.jpg") no-repeat right top; } .app .app_header .header_a ul{ float:left; width:100%; line-height:60px; } .app .app_header .header_a ul li{ float:left; width:25%; text-align:center; } .app .app_header .header_a ul li.now_li a{ padding:3px 5px; color:#FDE9B9; background:#A7191C; } .app .app_header .header_b{ float:left; width:100%; padding:8px 0; color:#FDE9B9; background:#A7191C; font-weight:bold; text-align:center; } .app .app_header .header_b h1{ margin:0 6px; font-size:120%; line-height:140%; display:block; } .app .subs_1{ float:left; width:100%; overflow:hidden; } .app .subs_1 .subs_1_title{ padding:8px 10px; color:#EDEDED; background:#666666; } .app .subs_1 .subs_1_list{ } .app .subs_1 .subs_1_list ul{ font-size:100%; line-height:130%; } .app .subs_1 .subs_1_list ul li{ padding:0 5px; background:url("../images/n.png") no-repeat right center; overflow:hidden; } .app .subs_1 .subs_1_list ul li.li_b{ background:#F6F0E4 url("../images/n.png") no-repeat right center; } .app .subs_1 .subs_1_list ul li a{ display:block; padding:10px 0 10px 10px; color:#333333; } .app .subs_2{ float:left; width:100%; overflow:hidden; } .app .subs_2 .c_1_title{ padding:8px; color:#EDEDED; background:#666666; } .app .subs_2 .c_1_title a{ color:#EDEDED; } .app .subs_2 .c_1_text{ font-size:115%; line-height:135%; padding:10px; } .app .subs_2 .c_1_text p{ padding:4px 0; } .app .subs_2 .c_1_text a{ color:blue; } .app .subs_2 .c_1_text img{ width:auto; height:auto; max-width:100%; max-height:100%; } .app .subs_2 .c_1_text td{ border-width:1px 0 1px 0; border-color:#BDA485; border-style:solid; padding:1px; font-size:80%; background:#DDD3C1; } .app .subs_push{ float:left; width:100%; padding:20px 0; text-align:center; border-top:1px solid #666666; background:#FFFFFF; } .app .subs_push img{ width:auto; height:auto; max-width:100%; max-height:100%; } .app .app_footer{ float:left; width:100%; line-height:150%; padding:20px 0; text-align:center; color:#666666; border-top:1px solid #666666; background:#DDD4C2; margin-bottom:50px; } .app .app_footer a:visited,.app .app_footer a:active,.app .app_footer a:hover,.app .app_footer a:link { text-decoration:none; color:#666666; }</style></head><body><div class="app"><div class="subs_2"><div class="c_1_title"><strong>&#x751F;&#x8FB0;&#x516B;&#x5B57;&#x8BE6;&#x6279;</strong></div><div class="c_1_text">';
     let www = '</div></div></body></html>'; 
     //let   qqqqq = cheerio.load($resultsPage.html());
	
	  let qqqq = qqqqq('div[class="suanming_s"]').children('div[class="suanming_c_1"]'); 
	  let quuu = qqqq.slice(0).children('.c_1_text').html();
	  const $r88 = cheerio.load(qqqq.slice(1).html());
	  $r88('table').empty();
	  let questionss = quuu + '</div><div class="c_1_title">' + $r88('div[class="c_1_title"]').html()  + '</div><div class="c_1_text">'  + $r88('div[class="c_1_text"]').html()  + "</div>" ;
	
	  questionss = questionss + qqqq.slice(2).html();
	  questionss = questionss + qqqq.slice(3).html();
	  questionss = questionss + qqqq.slice(4).html();
	  questionss = questionss + qqqq.slice(5).html();
	  questionss = questionss + qqqq.slice(6).html();
	  questionss = questionss + qqqq.slice(7).html();
	  questionss = questionss + qqqq.slice(8).html();
	  questionss = questionss + qqqq.slice(9).html();
	  questionss = questionss + qqqq.slice(10).html();
	  questionss = questionss + qqqq.slice(11).html();
	  questionss = questionss + qqqq.slice(12).html();
	  questionss = questionss + qqqq.slice(13).html();
	  questionss = questionss + qqqq.slice(14).html();
	  questionss = questionss + qqqq.slice(15).html();
	  questionss = questionss + qqqq.slice(16).html();
	
 let kkkk = hhh + questionss + www;      
      
     return {
       statusCode: 200,
       body: kkkk 
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
