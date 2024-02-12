import express, { Request,Response} from "express";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import path from "path";
import pg from "pg";



dotenv.config({path: '.env.local'})
const app = express();
const port = process.env.PORT;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

let quiz = [
    {country: "France", capital: "Paris"},
    {country: "United Kingdom", capital: "London"},
    {country: "United States", capital: "Washington"}
];

db.query("SELECT * FROM capitals", (err,res) => {
    if(err){
        console.error("Error executing query" + err.stack)
    }
    else{
        quiz = res.rows;
    }
    db.end();
})

let question = [
    {country: "USA",
    capital: "washington"}
]

let totalCorrect = 0;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

let currentQuestion = {};

app.get("/", async (req, res) => {
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index", {question: currentQuestion})
});

app.post("/submit", (req,res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()){
        totalCorrect ++;
        console.log(totalCorrect);
        isCorrect = true;
    }
    nextQuestion();
    res.render("index.ejs", {
        question: currentQuestion,
        wasCorrect: isCorrect,
        totalScore: totalCorrect,
    });
});

async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

    currentQuestion = randomCountry;
};


app.listen(port, () => {{
    console.log(`Server is listening on port ${port}`)
}})