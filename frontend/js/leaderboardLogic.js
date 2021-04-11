let scores = [];
const api_key = "?apikey=a56d4c63-b6c6-4d4a-b013-3e501f8dba5a";

function questionHTML(score) {
    return `
        <tr>
            <td>${score.name}</td>
            <td>${score.score} %</td>
        </tr>
        `;
}

function appendQuestionToBody(question) {
    div = document.getElementById("leaderboard-table");
    div.insertAdjacentHTML("beforeend", questionHTML(question));
}

function getScoresFromDb() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.jsshin.com/API/v1/score/" + api_key);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let responses = JSON.parse(this.responseText);
            responses.sort(sortBigToSmall);
            console.log(responses);
            responses.forEach((score) => {
                appendQuestionToBody(score);
            });
            scores = responses;
        }
    };
}

function sortBigToSmall( a, b ) {
    if ( a.score < b.score ){
        return 1;
    }
    if ( a.score > b.score ){
        return -1;
    }
    return 0;
}

function loadScores() {
    getScoresFromDb();
}

loadScores()