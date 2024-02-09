import express, { Request,Response} from "express";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import path from "path";

dotenv.config({path: '.env.local'})
const app = express();
const port = process.env.PORT;

let quiz = [
    {country: "France", capital: "Paris"},
    {country: "United Kingdom", capital: "London"},
    {country: "United States", capital: "Washington"}
]

let question = [
    {country: "USA"}
]

let totalCorrect = 0;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

let currentQuestion = {};

app.get("/", (req, res) => {
    res.render("index", {question})
})

app.listen(port, () => {{
    console.log(`Server is listening on port ${port}`)
}})