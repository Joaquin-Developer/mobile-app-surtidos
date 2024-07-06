// modulo con funciones utiles a todo el proyecto


/**
 * búsqueda binaria en un array ordenado por inserción
 */
function binarySearch(array, idObjective) {
    let left = 0
    let right = array.length - 1
    let index = null

    while (index == null && left <= right) {
        const mid = Math.floor((left + right) / 2)
        const currentId = array[mid].id

        if (currentId === idObjective)
            index = mid
        else if (currentId < idObjective)
            left = mid + 1
        else
            right = mid - 1
    }
    return index
}


// function getActualDate() {
//     return new Date().toISOString().split(".")[0].replace("T", " ")
// }

function getActualDate() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const seg = String(now.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hh}:${min}:${seg}`
}


function getTokenData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION_TOKEN))
}


function getAccessToken() {
    return getTokenData().access_token
}


// Validate access token
async function validateToken() {
    const token = getAccessToken()

    const resp = await fetch(`${API_URL}/validate_token`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })

    if (resp.status !== 200) {
        alert("El tiempo de la session expiró. Deberá iniciar sesion nuevamente.")
        localStorage.removeItem(STORAGE_KEY_SESSION_TOKEN)
        window.location.href = "login.html"
    }

}
