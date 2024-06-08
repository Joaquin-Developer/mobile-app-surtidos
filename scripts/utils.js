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
