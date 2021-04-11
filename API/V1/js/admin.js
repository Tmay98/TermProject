const api_key = "?apikey=a56d4c63-b6c6-4d4a-b013-3e501f8dba5a";

function updateCounterUI(counterResponse) {
    document.getElementById("quizGet").innerHTML = counterResponse["/API/v1/quiz/"].GET;
    document.getElementById("quizPost").innerHTML = counterResponse["/API/v1/quiz/"].POST;
    document.getElementById("quizPut").innerHTML = counterResponse["/API/v1/quiz/"].PUT;
    document.getElementById("quizDelete").innerHTML = counterResponse["/API/v1/quiz/"].DELETE;
    document.getElementById("scoreGet").innerHTML = counterResponse["/API/v1/score/"].GET;
    document.getElementById("scorePost").innerHTML = counterResponse["/API/v1/score/"].POST;
    document.getElementById("scorePut").innerHTML = counterResponse["/API/v1/score/"].PUT;
    document.getElementById("scoreDelete").innerHTML = counterResponse["/API/v1/score/"].DELETE;
    document.getElementById("register").innerHTML = counterResponse["/API/v1/register/"].POST;
    document.getElementById("login").innerHTML = counterResponse["/API/v1/login/"].POST;
}

function getCounterFromDB() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.jsshin.com/API/v1/counter/" + api_key);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.log(response);
            updateCounterUI(response)
        }
    };
}

function showCounter() {
    getCounterFromDB();
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("counterTable").style.display = "block";
}

const onLoginClick = () => {
    let id = document.getElementById("id").value;
    let ps = document.getElementById("ps").value;
    let requestBody = {
        username: id,
        password: ps
    };
    
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://www.jsshin.com/API/v1/login/" + api_key);
    xhttp.send(JSON.stringify(requestBody));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                showCounter();
            } else {
                window.alert(`${this.responseText}\nHint: id/pass = admin/admin123`);
            }
        }
    };
};

document.getElementById("loginButton").onclick = onLoginClick;
