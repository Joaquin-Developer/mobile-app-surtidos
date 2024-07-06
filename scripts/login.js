// buttons
const btnLogin = document.getElementById("btnLogin")
const btnTogglePassword = document.getElementById("togglePassword")
const btnRememberMe = document.getElementById("rememberMe")

// inputs
const usernameInput = document.getElementById("username")
const passwordInput = document.getElementById("password")


// events

document.addEventListener("DOMContentLoaded", () => {
    const tokenData = localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)

    if (!tokenData)
        return

    try {
        const data = JSON.parse(tokenData)
        if (data.access_token && data.username)
            window.location.href = "index.html"

    } catch (error) {
        console.error(error)
    }

})


btnTogglePassword.addEventListener("click", (e) => {
    const icon = document.querySelector("i")

    if (passwordInput.type === "password") {
        passwordInput.type = "text"
        icon.classList.remove("bi-eye")
        icon.classList.add("bi-eye-slash")
    } else {
        passwordInput.type = "password"
        icon.classList.remove("bi-eye-slash")
        icon.classList.add("bi-eye")
    }
})


btnLogin.addEventListener("click", async (event) => {
    // event.preventDefault()

    const username = usernameInput.value
    const password = passwordInput.value

    if (!username || !password) {
        alert("Faltan ingresar datos")
        return
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })

        if (response.status === 401)
            throw new Error("Credenciales incorrectas")

        if (!response.ok)
            throw new Error("Error interno del servidor: " + response.statusText)

        const token = await response.json()
        localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, JSON.stringify(token))
        window.location.href = "index.html"

    } catch (error) {
        console.error(error)
        alert(error)
    }

})
