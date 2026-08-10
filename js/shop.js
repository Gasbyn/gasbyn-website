const shopGrid = document.getElementById("shopGrid");


const products = [

    {
        name: "200 V-Bucks Gift",

        description:
            "Dostaneš od Gasbyna 200 V-Bucks.",

        status: "Cena: NEAKTIVNÍ",

        image: "assets/images/200-Vbucks.png",

        code: "!shop buy 200vbucks"
    },

    {
        name: "Připomínka na SAC",

        description:
            "Gasbyn připomene na Streamu na SAC.",

        status: "Cena: 100 Granulek",

        image: "assets/images/SAC.png",

        code: "!shop buy SAC"
    },

    {
        name: "Challenge na 1 Hru",

        description:
            "Vybereš Gasbynovy Challenge na jednu hru. Neplatí pro Cupy a Tournamenty.",

        status: "Cena: 1000 Granulek",

        image: "assets/images/Challenge.png",

        code: "!shop buy challenge"
    },

    {
        name: "10 Dřepů na Streamu",

        description:
            "Gasbyn udělá 10 dřepů na streamu.",

        status: "Cena: 500 Granulek",

        image: "assets/images/10drepu.png",

        code: "!shop buy 10drepu"
    }

];


function displayProducts() {

    shopGrid.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-content">

                <span class="product-status">
                    ${product.status}
                </span>


                <h2>
                    ${product.name}
                </h2>


                <p>
                    ${product.description}
                </p>


                <div class="product-command">
    Příkaz: ${product.code}
</div>

<button class="copy-product"
    data-code="${product.code}">

    📋 Zkopírovat Příkaz

</button>
        `;


        shopGrid.appendChild(card);

    });

}


displayProducts();

document.addEventListener("click", async (event) => {

    const button = event.target.closest(".copy-product");

    if (!button) return;

    const code = button.dataset.code;

    try {

        await navigator.clipboard.writeText(code);

        showShopToast("Příkaz zkopírován! 📋");

    } catch (error) {

        console.error("Nepodařilo se zkopírovat:", error);

    }

});

function showShopToast(message) {

    const toast =
        document.getElementById("shopToast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.shopToastTimer);

    window.shopToastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}