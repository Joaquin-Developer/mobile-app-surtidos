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