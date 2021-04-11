let questions = [];
let scores = [];
let initialNames = new Set();
const api_key = "?apikey=a56d4c63-b6c6-4d4a-b013-3e501f8dba5a";

function questionHTML(question) {
    return `
        <div class="questionDiv">
            <label>Question ${question.id}</label>
            <textarea class="form-control question" aria-label="With textarea" disabled>${question.question}</textarea>
            <div class="radio-item">
                <input type="radio" name="radio-${question.id}" value="0">
                <input placeholder="Answer 1" type="text" class="form-control a1" value="${question.answer1}" disabled>
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.id}" value="1">
                <input placeholder="Answer 2" type="text" class="form-control a2" value="${question.answer2}" disabled>
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.id}" value="2">
                <input placeholder="Answer 3" type="text" class="form-control a3" value="${question.answer3}" disabled>
            </div>
            <div class="radio-item">
                <input type="radio" name="radio-${question.id}" value="3">
                <input placeholder="Answer 4" type="text" class="form-control a4" value="${question.answer4}" disabled>
            </div>
        </div>
        `;
}

function appendQuestionToBody(question) {
    div = document.getElementById("user-label");
    div.insertAdjacentHTML("beforeend", questionHTML(question));
}

function getQuestionsFromDB() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.jsshin.com/API/v1/quiz/"  + api_key);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let responses = JSON.parse(this.responseText);
            console.log(responses);
            responses.forEach((question) => {
                appendQuestionToBody(question);
            });
            questions = responses;
        }
    };
}

function loadQuestions() {
    //   const questions = JSON.parse(localStorage.getItem("questions"));
    //   questions.forEach((question) => {
    //     appendQuestionToBody(question);
    //   });
    //   return questions;
    getQuestionsFromDB();
}


// Stuff related to getting and posting score to leaderboard

function getScoresFromDB() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.jsshin.com/API/v1/score/"  + api_key);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let responses = JSON.parse(this.responseText);
            console.log(responses);
            responses.forEach((score) => {
                scores.push(score);
                initialNames.add(score.name);
            });
        }
    };

}

function postScoreToDB(score) {
    const xhttp = new XMLHttpRequest();
    const url = "https://www.jsshin.com/API/v1/score/"  + api_key;
    let body = {};
    if (initialNames.has(score.name)) {
        body = JSON.stringify(
            {"name": score.name,
                "score": score.score});
        xhttp.open("PUT", url);
    } else {
        body = JSON.stringify(
            {"name": score.name,
                "score": score.score});
        xhttp.open("POST", url);
    }

    xhttp.send(body);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
}

const submitBtn = () => {
    let wrongCount = 0;
    let message = "";
    for (let i = 0; i < questions.length; i++) {
        if (
            document.querySelector(
                `input[name="radio-${questions[i].id}"]:checked`
            )?.value != questions[i].answerIndex
        ) {
            message += `Question ${questions[i].id} is wrong.\n`;
            wrongCount++;
        }
    }
    message =
        `Score: ${questions.length - wrongCount}/${questions.length}\n` +
        message;
    let score = {"name": document.getElementById("name").value, "score": ((questions.length - wrongCount) / questions.length) * 100};
    postScoreToDB(score);
    document.getElementById("quiz-result").innerText = message;
    window.alert(message);
};

loadQuestions();
document.getElementById("submitBtn").onclick = submitBtn;
getScoresFromDB();