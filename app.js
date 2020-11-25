const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")

const app = express();
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(`${__dirname}/signup.html`);
})

app.post('/', function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName}

            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/c1d199bbaa";
    const options = {
        method: "POST",
        auth: "seandoughty:afb354b454fb8282ad090fd4484c1975-us7"
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`)
        } else {
            res.sendFile(`${__dirname}/failure.html`)
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

        request.write(jsonData);
        request.end();
        console.log(request.errors)

});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(3000,function (){
    console.log("Server is running on port 3000.")
 });