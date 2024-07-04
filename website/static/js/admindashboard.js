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
    .then(res => res.json)
    .then(res => {
        console.log("RES", res.message)
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'haya', 'heya'],
                datasets: [{
                    label: '# of Votes',
                    data: res.message,
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })