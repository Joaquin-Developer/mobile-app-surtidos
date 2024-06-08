
function getUsername() {
    const data = SurtidoProduct.getAllProducts()

    if (!data || data.length === 0 || !Object.keys(data).includes("username"))
        throw Error("Username not defined")

    return data["username"]
}


async function getGata() {
    const username = getUsername()
    const URL = `${API_URL}/get_surtidos_data/${username}`
    const json = await (await fetch(URL)).json()
    return json
}


function dateToString(stringDate) {
    const date = new Date(stringDate).toLocaleString('es-UY', {
        month: 'long', year: 'numeric'
    })

    return date.charAt(0).toUpperCase() + date.slice(1)
}


function showData(data) {
    const graphJsonData = { labels: [], data: [] }

    data.forEach(elem => {
        graphJsonData.labels.push(dateToString(elem.audit_date))
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
}


addEventListener("load", async () => {
    let data = null
    try {
        data = await getGata()

        if (!data || data.length === 0)
            throw Error("No data")

        console.log(data)
        showData(data)

    } catch (error) {
        alert("No hay data para mostrar")
    }

})
