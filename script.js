const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const categoryLabels = {
    top: "Top",
    bottom: "Bottom",
    footwear: "Footwear",
    accessory: "Accessory",
    traditional: "Traditional"
};

let activeVibe = "minimal";
let activeFilter = "all";
let variation = 0;
let wardrobe = [
    { id: "tee", name: "White T-shirt", category: "top", color: "Neutral", photo: "assets/white-tee.jpg" },
    { id: "shirt", name: "Everyday shirts", category: "top", color: "Mixed neutrals", photo: "assets/wardrobe-rack.jpg" },
    { id: "jeans", name: "Blue jeans", category: "bottom", color: "Denim", photo: "assets/jeans.jpg" },
    { id: "trousers", name: "Neutral trousers", category: "bottom", color: "Earth tones", photo: "assets/capsule.jpg" },
    { id: "kurta", name: "Festive palette", category: "traditional", color: "Colour inspiration", photo: "assets/festive-style.jpg" },
    { id: "sneakers", name: "Everyday sneakers", category: "footwear", color: "Casual", photo: "assets/sneakers.jpg" }
];

let savedLooks = [];
let currentLook = null;

try {
    savedLooks = JSON.parse(localStorage.getItem("fitmuse-saved") || "[]");
    if (!Array.isArray(savedLooks)) savedLooks = [];
} catch {
    savedLooks = [];
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
    })[character]);
}

function renderWardrobe() {
    const grid = $("#wardrobeGrid");
    const visibleItems = wardrobe.filter((item) => {
        return activeFilter === "all" || item.category === activeFilter;
    });

    $("#wardrobeCount").textContent = `${wardrobe.length} ${wardrobe.length === 1 ? "piece" : "pieces"}`;

    if (!visibleItems.length) {
        grid.innerHTML = '<p class="empty-wardrobe">No pieces in this category yet. Add a photo of something you own.</p>';
        return;
    }

    grid.innerHTML = visibleItems.map((item) => {
        const image = item.uploadUrl || item.photo;
        return `<article class="wardrobe-card">
            <img class="wardrobe-image" src="${escapeHtml(image)}" alt="${escapeHtml(item.name)}">
            <div class="wardrobe-meta">
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(categoryLabels[item.category] || item.category)} · ${escapeHtml(item.color || "Unlabelled")}</small>
            </div>
            <button class="remove-item" type="button" data-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)}">×</button>
        </article>`;
    }).join("");

    $$("[data-remove]", grid).forEach((button) => {
        button.addEventListener("click", () => {
            const item = wardrobe.find((entry) => entry.id === button.dataset.remove);
            if (item?.uploadUrl) URL.revokeObjectURL(item.uploadUrl);
            wardrobe = wardrobe.filter((entry) => entry.id !== button.dataset.remove);
            renderWardrobe();
            buildLook();
        });
    });
}

function buildLook() {
    const occasion = $("#occasion").value;
    const weather = $("#weather").value;
    const priority = $("#comfort").value;
    const notes = $("#notes").value.trim();
    const noteText = notes.toLowerCase();
    const isFestive = ["festive", "wedding"].includes(occasion) || activeVibe === "traditional";
    const requiredCategories = isFestive
        ? ["traditional", "bottom", "footwear"]
        : ["top", "bottom", "footwear"];

    const chosenItems = requiredCategories.map((category, index) => {
        let options = wardrobe.filter((item) => item.category === category);

        if (category === "traditional" && options.length === 0) {
            options = wardrobe.filter((item) => item.category === "top");
        }

        if (activeVibe === "street") {
            options = [...options].sort((a, b) =>
                Number(/black|denim|hoodie/i.test(b.name)) - Number(/black|denim|hoodie/i.test(a.name))
            );
        } else if (activeVibe === "classic") {
            options = [...options].sort((a, b) =>
                Number(/shirt|trouser|neutral/i.test(b.name)) - Number(/shirt|trouser|neutral/i.test(a.name))
            );
        }

        if (noteText.includes("no bright") || noteText.includes("not bright")) {
            options = options.filter((item) => !/neon|yellow|red/i.test(item.name + item.color));
        }

        return options.length ? options[(variation + index) % options.length] : null;
    }).filter(Boolean);

    const defaultTitles = {
        interview: "The considered edit",
        festive: "Festive, your way",
        wedding: "Celebration-ready",
        date: "The dinner edit",
        casual: "The casual edit",
        college: "The easy-going edit"
    };

    let title = defaultTitles[occasion] || "The easy-going edit";
    if (activeVibe === "street") title = "The relaxed street edit";
    if (activeVibe === "classic") title = "The classic edit";
    if (activeVibe === "traditional") title = "A traditional touch";

    $("#resultTitle").textContent = title;
    $("#resultIntro").textContent = chosenItems.length >= 2
        ? `A ${chosenItems.length}-piece combination from your wardrobe for ${$("#occasion").selectedOptions[0].text.toLowerCase()}.`
        : "Your wardrobe needs a couple more suitable pieces to complete this combination. Add a top, bottom or footwear.";

    $("#lookItems").innerHTML = chosenItems.length
        ? chosenItems.map((item, index) => {
            const image = item.uploadUrl || item.photo;
            return `<article class="result-item">
                <img class="result-image" src="${escapeHtml(image)}" alt="${escapeHtml(item.name)}">
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(categoryLabels[item.category] || item.category)} · ${escapeHtml(item.color || "Your item")}</small>
            </article>`;
        }).join("")
        : '<p class="loading-note">Add clothing pieces to begin styling.</p>';

    let tip = priority === "comfort"
        ? "Choose comfortable fits and footwear you can walk in."
        : priority === "style"
            ? "Use one deliberate colour contrast or an accessory you already own."
            : "Balance comfort with one intentional detail.";

    if (weather === "rainy") tip += " Choose practical shoes with grip.";
    if (weather === "hot") tip += " Prefer breathable fabrics.";
    if (weather === "cool") tip += " Add a light layer if needed.";
    if (noteText.includes("walk")) tip += " Comfort for walking is a priority.";
    if (notes) tip += ` Note considered: ${notes.slice(0, 90)}.`;

    $("#stylistTip").textContent = tip;

    currentLook = {
        title,
        occasion,
        ids: chosenItems.map((item) => item.id),
        names: chosenItems.map((item) => item.name),
        tip
    };

    $("#saveLook").disabled = chosenItems.length < 2;
    $("#saveLook").textContent = "♡ Save this look";
    $("#savedMessage").hidden = true;
    updateShopping(chosenItems);
}

function updateShopping(chosenItems) {
    const included = new Set(chosenItems.map((item) => item.category));
    const gaps = ["top", "bottom", "footwear"].filter((category) => !included.has(category));

    if (!gaps.length) {
        $("#productGrid").innerHTML = `<span class="gap-icon" aria-hidden="true">✓</span>
            <div><b>Your outfit basics are covered.</b><p>No need to shop for the basics of this look. Try an accessory you already own instead.</p></div>`;
        return;
    }

    $("#productGrid").innerHTML = `<span class="gap-icon" aria-hidden="true">＋</span>
        <div><b>Optional gap-filler: ${gaps.map((category) => categoryLabels[category]).join(", ")}</b>
        <p>These categories could complete your combination. This is a suggestion, not a live product listing.</p></div>`;
}

function persistSavedLooks() {
    try {
        localStorage.setItem("fitmuse-saved", JSON.stringify(savedLooks));
    } catch {
        $("#savedMessage").textContent = "Browser storage is unavailable, so this save may not persist.";
    }
}

function renderSavedLooks() {
    const host = $("#savedLooks");
    host.innerHTML = savedLooks.length
        ? `<h4>Saved looks on this device</h4>${savedLooks.map((look, index) => `
            <div class="saved-look-row">
                <span><strong>${escapeHtml(look.title)}</strong><small>${escapeHtml((look.names || []).join(", "))}</small></span>
                <button class="remove-saved" data-saved-remove="${index}" type="button">Remove</button>
            </div>`).join("")}`
        : "";

    $$("[data-saved-remove]", host).forEach((button) => {
        button.addEventListener("click", () => {
            savedLooks.splice(Number(button.dataset.savedRemove), 1);
            persistSavedLooks();
            renderSavedLooks();
        });
    });
}

$("#stylingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    variation = 0;
    buildLook();
});

$("#shuffleLook").addEventListener("click", () => {
    variation += 1;
    buildLook();
});

$("#saveLook").addEventListener("click", () => {
    if (!currentLook || currentLook.ids.length < 2) return;

    const signature = `${currentLook.ids.join("|")}|${currentLook.occasion}`;
    if (savedLooks.some((look) => look.signature === signature)) {
        $("#savedMessage").textContent = "This look is already saved.";
    } else {
        savedLooks.unshift({ ...currentLook, signature });
        savedLooks = savedLooks.slice(0, 20);
        persistSavedLooks();
        renderSavedLooks();
        $("#savedMessage").textContent = "Saved in this browser on this device.";
    }

    $("#savedMessage").hidden = false;
});

$$("[data-vibe]").forEach((button) => {
    button.addEventListener("click", () => {
        $$("[data-vibe]").forEach((chip) => {
            chip.classList.remove("is-active");
            chip.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
        activeVibe = button.dataset.vibe;
        buildLook();
    });
});

$$("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
        $$("[data-filter]").forEach((chip) => {
            chip.classList.remove("is-active");
            chip.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
        activeFilter = button.dataset.filter;
        renderWardrobe();
    });
});

$("#itemUpload").addEventListener("change", (event) => {
    const category = $("#uploadCategory").value;

    [...event.target.files]
        .filter((file) => file.type.startsWith("image/"))
        .forEach((file) => {
            const cleanName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
            wardrobe.push({
                id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: cleanName || "My clothing item",
                category,
                color: "Unlabelled",
                uploadUrl: URL.createObjectURL(file),
                photo: ""
            });
        });

    renderWardrobe();
    buildLook();
    event.target.value = "";
});

$("#menuToggle").addEventListener("click", () => {
    const isOpen = $("#menuToggle").getAttribute("aria-expanded") === "true";
    $("#menuToggle").setAttribute("aria-expanded", String(!isOpen));
    $("#mainNav").classList.toggle("is-open", !isOpen);
    $("#menuToggle").textContent = isOpen ? "Menu" : "Close";
});

$$("#mainNav a").forEach((link) => {
    link.addEventListener("click", () => {
        $("#mainNav").classList.remove("is-open");
        $("#menuToggle").setAttribute("aria-expanded", "false");
        $("#menuToggle").textContent = "Menu";
    });
});

["occasion", "weather", "comfort", "notes"].forEach((id) => {
    $("#" + id).addEventListener(id === "notes" ? "input" : "change", buildLook);
});

renderWardrobe();
renderSavedLooks();
buildLook();