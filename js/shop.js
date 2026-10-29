const shopGrid = document.getElementById("shopGrid");


const products = [

    {
        name: "200 V-Bucks Gift",
        description: "Dostaneš od Gasbyna 200 V-Bucks Gift",
        status: "Cena: NEAKTIVNÍ",
        image: "assets/images/200-Vbucks.png",
        code: "!buy 200vbucks"
    },
    
    {
        name: "Připomínka na SAC",
        description: "Gasbyn připomene na Streamu na SAC: Gasbyn59",
        status: "Cena: 100 Granulek",
        image: "assets/images/SAC.png",
        code: "!buy SAC"
    },

    {
        name: "Jedna rarita zbraní",
        description: "Gasbyn hraje jen s jednou raritou zbraní",
        status: "Cena: 250 Granulek",
        image: "assets/images/Challenge.png",
        code: "!buy rarita [Sem dej tvoji Raritu]"
    },

    {
        name: "10 Dřepů na Streamu",
        description: "Gasbyn udělá 10 dřepů na Streamu",
        status: "Cena: 500 Granulek",
        image: "assets/images/10drepu.png",
        code: "!buy 10drepu"
    },

    {
        name: "Pouze jedna kategorie zbraní",
        description: "Gasbyn hraje jen s jednou kategorií zbraní",
        status: "Cena: 500 Granulek",
        image: "assets/images/Challenge.png",
        code: "!buy kategorie [Sem dej tvoji Kategorii]"
    },

    {
        name: "TTS na Streamu",
        description: "AI řekne tvoji zprávu na Streamu (Sprostý/Nevhodný Slova = BAN)",
        status: "Cena: 750 Granulek",
        image: "assets/images/TTS.png",
        code: "!tts [Sem dej tvoji Zprávu]"
    },

    {
        name: "Pouze krumpáč",
        description: "Gasbyn hraje jen s krumpáčem",
        status: "Cena: 1 000 Granulek",
        image: "assets/images/Challenge.png",
        code: "!buy pickaxe"
    },

    {
        name: "Klávesnice a myš místo ovladače",
        description: "Gasbyn hraje na klávesnici a myši místo ovladače",
        status: "Cena: 1 500 Granulek",
        image: "assets/images/Challenge.png",
        code: "!buy kbm"
    },

    {
        name: "Vlastní Příkaz",
        description: "Gasbyn vytvoří tvůj vlastní příkaz do Chatu",
        status: "Cena: 5 000 Granulek",
        image: "assets/images/prikaz.png",
        code: "!prikaz ![Tvůj příkaz], [Zpráva příkazu]"
    }

];

function displayProducts() {
    shopGrid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-content">
                <span class="product-status">${product.status}</span>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="product-command">Příkaz: ${product.code}</div>
                <button class="copy-product" data-code="${product.code}">
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
    const toast = document.getElementById("shopToast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.shopToastTimer);
    window.shopToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
