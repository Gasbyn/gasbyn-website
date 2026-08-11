const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.08 });

hiddenElements.forEach((el) => observer.observe(el));

// ===== LIVE HOME DATA =====
// data.json is updated automatically by GitHub Actions approximately every 6 hours.
// The browser also re-checks it periodically, so an already-open page can pick up
// the newest video without needing a manual refresh.

function formatRoundedCount(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return "—";

    if (number >= 1000000) {
        return `${Math.floor(number / 1000000)} mil.+`;
    }

    if (number >= 1000) {
        return `${Math.floor(number / 1000)} 000+`;
    }

    if (number >= 100) {
        return `${Math.floor(number / 100) * 100}+`;
    }

    return `${number}+`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function loadHomeData() {
    const youtubeSubscribers = document.getElementById("youtubeSubscribers");
    const kickFollowers = document.getElementById("kickFollowers");
    const latestVideoCard = document.getElementById("latestVideoCard");

    if (!youtubeSubscribers && !kickFollowers && !latestVideoCard) return;

    try {
        // Cache-busting makes sure visitors receive the latest committed data.json.
        const response = await fetch(`data.json?cache=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Data unavailable");

        const data = await response.json();

        if (youtubeSubscribers && data.youtube?.subscribers != null) {
            youtubeSubscribers.textContent = formatRoundedCount(data.youtube.subscribers);
        }

        if (kickFollowers && data.kick?.followers != null) {
            kickFollowers.textContent = formatRoundedCount(data.kick.followers);
        }

        if (latestVideoCard && data.youtube?.latestVideo?.id) {
            const video = data.youtube.latestVideo;
            const safeTitle = escapeHtml(video.title);
            const safeThumbnail = escapeHtml(video.thumbnail);
            const videoUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;

            latestVideoCard.innerHTML = `
                <a class="latest-video-link" href="${videoUrl}" target="_blank" rel="noopener noreferrer">
                    <div class="latest-video-thumb-wrap">
                        <img class="latest-video-thumb" src="${safeThumbnail}" alt="Miniatura videa: ${safeTitle}" loading="lazy">
                        <span class="latest-video-play">▶</span>
                    </div>
                    <div class="latest-video-info">
                        <span class="latest-video-label">NEJNOVĚJŠÍ VIDEO</span>
                        <h3>${safeTitle}</h3>
                        <span class="latest-video-open">▶ Otevřít na YouTube</span>
                    </div>
                </a>
            `;
        }
    } catch (error) {
        if (latestVideoCard) {
            latestVideoCard.innerHTML = `
                <h3>Nejnovější video</h3>
                <p>Nejnovější video se momentálně nepodařilo načíst.</p>
                <a href="https://www.youtube.com/@Gasbyn" target="_blank" rel="noopener noreferrer">Přejít na YouTube</a>
            `;
        }
    }
}

loadHomeData();

// If the page stays open, check again after 6 hours as well.
setInterval(loadHomeData, 6 * 60 * 60 * 1000);
