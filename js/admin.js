// const requestCounter = {
//     "/API/v1/quiz": {
//         POST: 0,
//         PUT: 0,
//         GET: 0,
//         DELETE: 0
//     },
// };

function updateCounterUI(counterResponse) {
    document.getElementById("quizGet").innerHTML = counterResponse["/API/v1/quiz"].GET;
    document.getElementById("quizPost").innerHTML = counterResponse["/API/v1/quiz"].POST;
    document.getElementById("quizPut").innerHTML = counterResponse["/API/v1/quiz"].PUT;
    document.getElementById("quizDelete").innerHTML = counterResponse["/API/v1/quiz"].DELETE;

}

function getCounterFromDB() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.jsshin.com/COMP4537/labs/quiz/counter");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let response = JSON.parse(this.responseText);
          console.log(response);
          updateCounterUI(response)
        }
    };
}

getCounterFromDB();
