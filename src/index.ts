import express, { Request,Response} from "express";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import path from "path";
import pg from "pg";

dotenv.config({path: '.env.local'})
const app = express();
const port = process.env.PORT || 3000;

//Set up DB connection
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

interface Question {
    country: string,
    capital: string,
}

interface FlagQuestion {
    name: string,
    flag: string,
}



db.connect()

let quiz: Question[] = [];
let flagQuiz: FlagQuestion[] = [];
db.query("SELECT country, capital FROM capitals", (err,res) => {
    if(err){
        console.error("Error executing query" + err.stack)
    }
    else{
        quiz = res.rows;

    }
})

db.query("SELECT name, flag FROM flags", (err,res) => {
    if(err){
        console.error("Error executing query" + err.stack)
    }
    else{
        flagQuiz = res.rows;
    }
    db.end();
})


//Middleware
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

let totalCorrect = 0;
let flagTotalCorrect = 0;
let currentQuestion: Question = {
    country: '',
    capital: ''
};

let currentFlagQuestion: FlagQuestion = {
    name: '',
    flag: ''
}

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

app.get("/flags", async (req, res) => {
    totalCorrect = 0;
    await nextFlagQuestion();
    console.log(currentFlagQuestion);
    res.render("flagsQuiz", {flagQuestion: currentFlagQuestion})
});

app.post("/submitFlags", (req,res) => {
    let answer = req.body.answer.trim();
    let isFlagCorrect = false;
    if (currentFlagQuestion.name.toLowerCase() === answer.toLowerCase()){
        flagTotalCorrect ++;
        console.log(flagTotalCorrect);
        isFlagCorrect = true;
    }
    nextFlagQuestion();
    console.log(currentFlagQuestion);
    res.render("flagsQuiz.ejs", {
        flagQuestion: currentFlagQuestion,
        flagWasCorrect: isFlagCorrect,
        flagTotalScore: flagTotalCorrect,
    });
});

async function nextQuestion() {

        const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
        currentQuestion = randomCountry;
};

async function nextFlagQuestion(){
    const randomFlag = flagQuiz[Math.floor(Math.random() * quiz.length)];
    currentFlagQuestion = randomFlag;
}



app.listen(port, () => {{
    console.log(`Server is listening on port ${port}`)
}})