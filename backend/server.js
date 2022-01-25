const express = require("express");
const path = require("path")
const nodemailer = require("nodemailer")
const  bodyparser = require("body-parser")
const handlebars = require("handlebars")
const {engine} = require("express-handlebars")
const config =  require("./config")

const app = express();

app.engine("handlebars", engine({layoutsDir:path.join(__dirname, "../views"),defaultLayout:"index.handlebars"}))
app.set("view engine", "handlebars");
const PORT = process.env.PORT || 5000;

app.use("/assets", express.static(path.join(__dirname, "../assets")))
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())

app.listen(PORT,()=>{
    console.log(`running on ${PORT}`)
})

app.get("/", (req, res)=>{
    res.render("index")
})

app.post("/contactUs", (req, res)=>{
    console.log(config)
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth:{
            user:config.EMAIL,
            pass:config.PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: config.EMAIL,
        to:"juanchitogomez0208@gmail.com, daliellleonxd@gmail.com",
        subject: req.body.asunto,
        text: `nombre: ${req.body.nombre}, Correo: ${req.body.correo}, mensaje: ${req.body.mensaje}`,
        html:`<h1>WHAT UP desde node y su pagina uwu</h1>
            <h4>Nombre: ${req.body.nombre}</h4>
            <h4>Correo: ${req.body.correo}</h4>
            <br>
            <h5>${req.body.mensaje}</h5>`,
    }
    transporter.sendMail(mailOptions,(err, info)=>{
        if(err){
            res.status('505')
            console.log(err);
            res.send("sad mistake" + err)
        }
        else{
            console.log("message sent: ", info.messageId);
            res.status('200');
            res.render("index",{msg: "Mensaje enviado"})
        }
    })
})