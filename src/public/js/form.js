const form = document.getElementById("login_form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
            //   'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
    });
    const respJson = await response.json();
    if (respJson.error) {
        return alert("log in error");
    }
    window.location.href = "/products";
});