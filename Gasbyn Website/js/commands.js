// ===== Databáze příkazů =====

const commands = [

{
    command: "!1v1",
    category: "games",
    description: "Pošle hráči kód na moji 1v1 mapu.",
    
},

{
    command: "!discord",
    category: "social",
    description: "Pošle odkaz na Discord server.",
    
},

{
    command: "!goal",
    category: "stream",
    description: "Zobrazí aktuální cíl streamu.",
    
},

{
    command: "!nick",
    category: "games",
    description: "Pošle můj Fortnite nick.",
    
},

{
    command: "!petice",
    category: "support",
    description: "Pošle odkaz na petici.",
    
},

{
    command: "!pillars",
    category: "games",
    description: "Pošle kód na Pillars mapu.",
    
},

{
    command: "!schedule",
    category: "stream",
    description: "Ukáže přibližný čas streamů.",
    
},

{
    command: "!sub",
    category: "support",
    description: "Pošle odkaz na zakoupení Suba.",
    
},

{
    command: "!tiktok",
    category: "social",
    description: "Pošle odkaz na TikTok.",
    
},

{
    command: "!tip",
    category: "support",
    description: "Pošle odkaz na podporu přes Streamlabs.",
    
},

{
    command: "!youtube",
    category: "social",
    description: "Pošle odkaz na YouTube kanál.",
    
},

{
    command: "!followage",
    category: "stats",
    description: "Ukáže, jak dlouho má člověk follow.",
    
},

{
    command: "!level",
    category: "stats",
    description: "Ukáže level chatu.",
    
},

{
    command: "!granulky",
    category: "stats",
    description: "Ukáže počet bodů/granulek.",
    
},

{
    command: "!shop",
    category: "shop",
    description: "Otevře informace o Kick Shopu.",
    
},

{
    command: "!uptime",
    category: "stream",
    description: "Ukáže délku aktuálního streamu.",
    
},

{
    command: "!watchtime",
    category: "stats",
    description: "Ukáže watchtime uživatele.",
    
},

{
    command: "!xp",
    category: "stats",
    description: "Ukáže XP do dalšího levelu.",
    
},

{
    command: "!ping",
    category: "games",
    description: "Pošle video s návodem na menší ping.",
    
},

{
    command: "!soutěž",
    category: "stream",
    description: "Ukáže informace o soutěži.",
},

{
    command: "********",
    category: "secret",
    description: "🤫 Tento příkaz zůstává tajný.",
}

];

// ===== Elementy stránky =====

const grid = document.getElementById("commandsGrid");

const search = document.getElementById("search");

const commandCount = document.getElementById("commandCount");

const favoriteCount = document.getElementById("favoriteCount");

const toast = document.getElementById("toast");

let favorites = JSON.parse(
    localStorage.getItem("gasbynFavorites")
) || [];

function displayCommands(list){

    const sortedList = [...list].sort((a, b) => {

    const aFavorite = favorites.includes(a.command);
    const bFavorite = favorites.includes(b.command);

    if (aFavorite && !bFavorite) return -1;

    if (!aFavorite && bFavorite) return 1;

    return 0;

});

    grid.innerHTML = "";

    sortedList.forEach(cmd => {


        const card = document.createElement("div");

        card.className = "command-card";

        if (cmd.category === "secret") {
    card.classList.add("secret-card");
}


        card.innerHTML = `


        <h3>${cmd.command}</h3>


        <p>

        ${cmd.description}

        </p>


        <span class="tag">

        ${cmd.category}

        </span>


        <div class="buttons">


<button class="copy"
data-copy="${cmd.command}">

📋 Kopírovat

</button>


        <button class="favorite">

${favorites.includes(cmd.command) ? "❤️Uloženo" : "🤍Uložit"}

</button>

        `;


        grid.appendChild(card);

        const favoriteButton = card.querySelector(".favorite");

favoriteButton.addEventListener("click", () => {

    if (favorites.includes(cmd.command)) {

        favorites = favorites.filter(
            favorite => favorite !== cmd.command
        );

        favoriteButton.textContent = "🤍Uložit";

    } else {

        favorites.push(cmd.command);

        favoriteButton.textContent = "❤️Uloženo";

    }

    localStorage.setItem(
        "gasbynFavorites",
        JSON.stringify(favorites)
    );

    favoriteCount.textContent = favorites.length;

});

        const copyButton = card.querySelector(".copy");

copyButton.addEventListener("click", async () => {

    await navigator.clipboard.writeText(cmd.command);

    copyButton.textContent = "✔ Zkopírováno";

    toast.textContent = `✅ Příkaz ${cmd.command} byl zkopírován.`;

toast.classList.add("show");

setTimeout(() => {

    toast.classList.remove("show");

}, 2000);

    setTimeout(() => {

        copyButton.textContent = "📋 Kopírovat";

    },2000);

});

    });


}

displayCommands(commands);

commandCount.textContent = commands.length;

favoriteCount.textContent = favorites.length;

search.addEventListener("input", filterCommands);

const categoryButtons = document.querySelectorAll(".category");

let currentCategory = "all";

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentCategory = button.dataset.category;

        filterCommands();

    });

});

function filterCommands(){

    const text = search.value.toLowerCase();

    const filtered = commands.filter(cmd => {

        const matchSearch =

            cmd.command.toLowerCase().includes(text) ||

            cmd.description.toLowerCase().includes(text);

        const matchCategory =

            currentCategory === "all" ||

            cmd.category === currentCategory;

        return matchSearch && matchCategory;

    });

    displayCommands(filtered);

    commandCount.textContent = filtered.length;

}

