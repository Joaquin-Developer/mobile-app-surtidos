
async function getGata() {
    const username = "Joaquin"
    const URL = `${API_URL}/get_surtidos_data/${username}`
    const json = await (await fetch(URL)).json()
    return json
}


addEventListener("load", async () => {

    const data = await getGata()
    console.log(data)

    if (!data || data.length === 0) {
        alert("No hay data para mostrar")
        return
    }

    const graphJsonData = { labels: [], data: [] }

    data.forEach(elem => {
        graphJsonData.labels.push(elem.audit_date)
        graphJsonData.data.push(elem.total_price)
    })

    const ctx = document.getElementById("myChart").getContext("2d")

    new Chart(ctx, {
        type: "line",
        data: {
            labels: graphJsonData.labels,
            datasets: [{
                label: "Gastos al mes en Surtidos",
                data: graphJsonData.data,
                fill: false,
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0, // linea recta
                    cubicInterpolationMode: "monotone" // linea de tipo polinomial
                }
            }
        }
    })
})