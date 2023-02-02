async function main() {
    await fetch(`http://localhost:3000/api/products`)
    .then(res => res.json())
    .then(product => {       
        generateProductByID(product)
    })
    .catch(error => console.log( error ))
}

function generateProductByID(product) {
    
}