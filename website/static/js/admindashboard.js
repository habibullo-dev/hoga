const logoutButtonElem = document.querySelector("#logout");

logoutButtonElem.addEventListener("click", (evt) => {
    console.log(document.querySelector("#admin-email").textContent)
    fetch("/adminlogout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email": document.querySelector("#admin-email").textContent })
    })
    window.location.href = "http://127.0.0.1:5000/admin"
})

const ctx = document.getElementById('myChart');


fetch("/createlinegraph")
    .then(res => res.json())
    .then(res => {
        Chart.defaults.font.size = "20";
        Chart.defaults.borderColor = 'gray';
        Chart.defaults.color = 'black';
        console.log("RES", res.message)
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: res.time,
                datasets: [{
                    label: 'Growth of Verified Accounts in a week',
                    data: res.message,
                    borderWidth: 2,
                    backgroundColor: '#4F200D'
                }]
            },
            options: {
                responsive: true,
                tension: 0.4,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })

const another_ctx = document.getElementById('myBarGraph');

fetch("/createbargraph")
    .then(res => res.json())
    .then(res => {
        console.log("RES", res.message)
        new Chart(another_ctx, {
            type: 'bar',
            data: {
                labels: res.time,
                datasets: [{
                    label: 'Growth of Total Revenue in a week',
                    data: res.message,
                    borderWidth: 2,
                    backgroundColor: '#062C30',
                }]
            },
            options: {
                response: true,
                display: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })

const emailForm = document.querySelector("#sendUserEmail").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent reloading

    var formData = new FormData(document.getElementById("sendUserEmail"));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/sendemailtouser", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.message) {
            // Handle the response from the server
            console.log(xhr.responseText);
        }
    };
    xhr.send(formData);

    alert("Your email was sent!")
    document.getElementById("userEmail").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("body").value = "";
})