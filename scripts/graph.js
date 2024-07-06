
function getUsername() {
    const data = getTokenData()

    if (!data || data.length === 0 || !Object.keys(data).includes("username"))
        throw Error("Username not defined")

    return data["username"]
}


async function getGata() {
    const username = getUsername()
    const token = getAccessToken()
    await validateToken()

    const URL = `${API_URL}/get_surtidos_data/${username}`

    const resp = await fetch(URL, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })

    return await resp.json()
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
    const tokenData = localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)

    if (!tokenData)
        window.location.href = "login.html"

    let data = null
    try {
        const data = JSON.parse(tokenData)
        if (!data.access_token || !data.username)
            window.location.href = "login.html"

        data = await getGata()

        if (!data || data.length === 0)
            throw Error("No data")

        console.log(data)
        showData(data)

    } catch (error) {
        console.error(error)
        alert("No hay data para mostrar")
    }

})
