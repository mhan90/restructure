const addProduct = (cid) => {
    const url = `http://localhost:8080/api/carts/${cid}/products/${pid}`;
    fetch(url, { method: "POST" });
}