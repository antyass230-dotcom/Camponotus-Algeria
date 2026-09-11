// ============================================================
// Camponotus Algeria - Catalogue
// ============================================================


// ============================================================
// FICHIERS JSON
// ============================================================

const SPECIES_FILES = [
    "Camponotus_micans.json",
    "Camponotus_cruentatus.json",
    "Camponotus_seurati.json",
    "Camponotus_sanctus.json",
    "Camponotus_spissinodis.json",
    "Camponotus_lateralis.json",
    "Camponotus_atlantis.json",
    "Camponotus_sylvaticus.json",
    "Camponotus_thoracicus.json",
    "Camponotus_foreli.json"
];

let speciesData = [];


// ============================================================
// NOM DE L'ESPÈCE
// ============================================================

function getSpeciesName(data) {

    // IMPORTANT :
    // scientific_name est toujours prioritaire.
    //
    // Exemple :
    // scientific_name = Camponotus spissinodis
    //
    // même si GBIF donne :
    // canonical_name = Camponotus

    if (
        data &&
        typeof data.scientific_name === "string" &&
        data.scientific_name.trim() !== ""
    ) {
        return data.scientific_name.trim();
    }

    if (
        data?.taxonomy?.species &&
        typeof data.taxonomy.species === "string"
    ) {
        return data.taxonomy.species.trim();
    }

    if (
        data?.taxonomy?.scientific_name &&
        typeof data.taxonomy.scientific_name === "string"
    ) {
        return data.taxonomy.scientific_name.trim();
    }

    return "Camponotus";
}


// ============================================================
// NOM SCIENTIFIQUE COMPLET
// ============================================================

function getFullScientificName(data) {

    if (
        data &&
        typeof data.scientific_name === "string" &&
        data.scientific_name.trim() !== ""
    ) {
        return data.scientific_name.trim();
    }

    if (
        data?.taxonomy?.species &&
        typeof data.taxonomy.species === "string"
    ) {
        return data.taxonomy.species.trim();
    }

    if (
        data?.taxonomy?.scientific_name &&
        typeof data.taxonomy.scientific_name === "string"
    ) {
        return data.taxonomy.scientific_name.trim();
    }

    return getSpeciesName(data);
}


// ============================================================
// INFORMATIONS TAXONOMIQUES
// ============================================================

function getAuthorship(data) {

    return data?.taxonomy?.authorship || "";
}


function getKingdom(data) {

    return data?.taxonomy?.kingdom || "—";
}


function getPhylum(data) {

    return data?.taxonomy?.phylum || "—";
}


function getClass(data) {

    return data?.taxonomy?.class || "—";
}


function getOrder(data) {

    return data?.taxonomy?.order || "—";
}


function getFamily(data) {

    return data?.taxonomy?.family || "—";
}


function getGenus(data) {

    return data?.taxonomy?.genus || "Camponotus";
}


function getSubgenus(data) {

    return data?.taxonomy?.subgenus || "—";
}


function getSpeciesTaxon(data) {

    return (
        data?.taxonomy?.species ||
        data?.scientific_name ||
        data?.taxonomy?.scientific_name ||
        getSpeciesName(data)
    );
}


// ============================================================
// NORMALISATION DES PAYS
// ============================================================

function normalizeCountry(country) {

    if (!country) {
        return "";
    }

    const value =
        String(country).trim();

    const lower =
        value.toLowerCase();


    if (
        lower === "israel" ||
        lower === "state of israel"
    ) {
        return "Palestine";
    }


    if (
        lower === "iran (islamic republic of)"
    ) {
        return "Iran";
    }


    if (
        lower === "syrian arab republic"
    ) {
        return "Syria";
    }


    if (
        lower ===
        "united kingdom of great britain and northern ireland"
    ) {
        return "United Kingdom";
    }


    return value;
}


// ============================================================
// DISTRIBUTION
// ============================================================

function getCountries(data) {

    const countries =
        data?.distribution?.countries;


    if (!Array.isArray(countries)) {
        return [];
    }


    const normalized =
        countries
            .map(country => normalizeCountry(country))
            .filter(country => country !== "");


    return [
        ...new Set(normalized)
    ];
}


// ============================================================
// OCCURRENCES ALGÉRIE
// ============================================================

function getAlgeriaOccurrences(data) {

    const distribution =
        data?.distribution || {};


    const value =
        distribution.algeria_occurrences ??
        distribution.algeria?.GBIF ??
        0;


    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// OCCURRENCES GBIF
// ============================================================

function getGBIFOccurrences(data) {

    const distribution =
        data?.distribution || {};


    const value =
        distribution.gbif_occurrences ??
        distribution.occurrences?.GBIF ??
        0;


    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// OCCURRENCES INATURALIST
// ============================================================

function getINaturalistOccurrences(data) {

    const distribution =
        data?.distribution || {};


    const value =
        distribution
            .occurrences
            ?.iNaturalist
            ?.total ??
        0;


    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// IMAGES PERSONNELLES
// ============================================================

function getImages(data) {

    if (
        !Array.isArray(data?.images)
    ) {
        return [];
    }


    return data.images

        .filter(image => {

            if (!image) {
                return false;
            }


            if (
                typeof image.url !== "string"
            ) {
                return false;
            }


            if (
                image.url.trim() === ""
            ) {
                return false;
            }


            if (
                typeof image.source !== "string"
            ) {
                return false;
            }


            return (
                image.source
                    .trim()
                    .toLowerCase() ===
                "personal"
            );

        })

        .map(
            image => image.url.trim()
        )

        .filter(
            url => url !== ""
        );

}


// ============================================================
// IMAGE PRINCIPALE
// ============================================================

function getImages(data) {

    if (!Array.isArray(data?.images)) {
        return [];
    }

    return data.images
        .filter(image => {

            if (!image) return false;

            if (typeof image.url !== "string") {
                return false;
            }

            if (image.url.trim() === "") {
                return false;
            }

            if (typeof image.source !== "string") {
                return false;
            }

            const source =
                image.source.trim().toLowerCase();

            return (
                source === "personal" ||
                source === "collection personnelle"
            );

        });
}


// ============================================================
// LOCALITÉS ALGÉRIENNES
// ============================================================

function getAlgerianLocalities(data) {

    const records =
        data?.distribution?.algeria_records;


    if (!Array.isArray(records)) {
        return [];
    }


    const localities =
        records

            .map(
                record => record?.locality
            )

            .filter(
                locality =>
                    locality &&
                    String(locality).trim() !== ""
            )

            .map(
                locality =>
                    String(locality).trim()
            );


    return [
        ...new Set(localities)
    ];
}


// ============================================================
// PROTECTION HTML
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ============================================================
// PAYS
// ============================================================

function createCountriesHTML(data) {

    const countries =
        getCountries(data);


    if (
        countries.length === 0
    ) {

        return `
            <span class="no-data">
                Données de distribution indisponibles
            </span>
        `;

    }


    return countries

        .map(country => `

            <span class="country-tag">
                ${escapeHTML(country)}
            </span>

        `)

        .join("");
}


// ============================================================
// CARTE ESPÈCE
// ============================================================

function createSpeciesCard(data) {

    const name =
        getSpeciesName(data);


    const card =
        document.createElement("a");


    card.className =
        "species-card";


    card.dataset.name =
        name.toLowerCase();


    // --------------------------------------------------------
    // LIEN DIRECT VERS LA FICHE
    // --------------------------------------------------------

    card.href =
        `species-detail.html?species=${encodeURIComponent(name)}`;


    // --------------------------------------------------------
    // CONTENU DE LA CARTE
    // --------------------------------------------------------

    card.innerHTML = `

        <div class="species-card-content">

            <h3>
                <em>
                    ${escapeHTML(name)}
                </em>
            </h3>

        </div>

    `;


    return card;
}


// ============================================================
// AFFICHAGE CATALOGUE
// ============================================================

function displaySpecies() {

    const grid =
        document.getElementById(
            "species-grid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (
        speciesData.length === 0
    ) {

        grid.innerHTML = `

            <div class="no-results">

                <h3>
                    Aucune espèce disponible
                </h3>

                <p>
                    Les données des espèces
                    n'ont pas pu être chargées.
                </p>

            </div>

        `;

        return;
    }


    speciesData.forEach(data => {

        const card =
            createSpeciesCard(data);


        grid.appendChild(card);

    });
}


// ============================================================
// ESPÈCES EN VEDETTE
// ============================================================

function displayFeaturedSpecies() {

    const container =
        document.getElementById(
            "featured-species"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    speciesData

        .slice(0, 6)

        .forEach(data => {

            const card =
                createSpeciesCard(data);


            container.appendChild(card);

        });
}


// ============================================================
// RECHERCHE
// ============================================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "search"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const grid =
                document.getElementById(
                    "species-grid"
                );


            if (!grid) {
                return;
            }


            // ------------------------------------------------
            // RECHERCHE VIDE
            // ------------------------------------------------

            if (
                query === ""
            ) {

                displaySpecies();

                return;
            }


            // ------------------------------------------------
            // FILTRAGE
            // ------------------------------------------------

            const filtered =
                speciesData.filter(data => {

                    const name =
                        getSpeciesName(data)
                            .toLowerCase();


                    const fullName =
                        getFullScientificName(data)
                            .toLowerCase();


                    return (
                        name.includes(query) ||
                        fullName.includes(query)
                    );

                });


            grid.innerHTML = "";


            // ------------------------------------------------
            // AUCUN RÉSULTAT
            // ------------------------------------------------

            if (
                filtered.length === 0
            ) {

                grid.innerHTML = `

                    <div class="no-results">

                        <h3>
                            Aucune espèce trouvée
                        </h3>

                        <p>
                            Aucune espèce ne correspond
                            à votre recherche.
                        </p>

                    </div>

                `;

                return;
            }


            // ------------------------------------------------
            // RÉSULTATS
            // ------------------------------------------------

            filtered.forEach(data => {

                const card =
                    createSpeciesCard(data);


                grid.appendChild(card);

            });

        }
    );
}


// ============================================================
// OUVRIR UNE FICHE
// ============================================================

function openSpecies(name) {

    if (!name) {
        return;
    }


    const cleanName =
        String(name).trim();


    const encodedName =
        encodeURIComponent(cleanName);


    const url =
        `species-detail.html?species=${encodedName}`;


    console.log(
        "Ouverture de la fiche :",
        cleanName
    );


    console.log(
        "URL :",
        url
    );


    window.location.href =
        url;
}


// ============================================================
// STATISTIQUES ACCUEIL
// ============================================================

function updateHomeStats() {

    // --------------------------------------------------------
    // TOTAL ESPÈCES
    // --------------------------------------------------------

    const speciesCount =
        document.getElementById(
            "species-count"
        );


    if (speciesCount) {

        speciesCount.textContent =
            speciesData.length;

    }


    // --------------------------------------------------------
    // ESPÈCES D'ALGÉRIE
    // --------------------------------------------------------

    const algerianSpecies =
        speciesData.filter(
            data =>
                getAlgeriaOccurrences(data) > 0
        );


    const algerianCount =
        document.getElementById(
            "algerian-species-count"
        );


    if (algerianCount) {

        algerianCount.textContent =
            algerianSpecies.length;

    }


    // --------------------------------------------------------
    // NOMBRE DE PAYS
    // --------------------------------------------------------

    const countriesSet =
        new Set();


    speciesData.forEach(data => {

        getCountries(data)
            .forEach(country => {

                countriesSet.add(country);

            });

    });


    const countryCount =
        document.getElementById(
            "country-count"
        );


    if (countryCount) {

        countryCount.textContent =
            countriesSet.size;

    }
}


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Camponotus Algeria - démarrage"
        );


        await loadSpecies();


        setupSearch();

    }
);


// ============================================================
// CHARGEMENT DES ESPÈCES
// ============================================================

async function loadSpecies() {

    try {

        console.log(
            "Chargement des fichiers JSON..."
        );


        const results =
            await Promise.all(

                SPECIES_FILES.map(
                    async file => {

                        try {

                            const response =
                                await fetch(
                                    `data/${file}`
                                );


                            if (!response.ok) {

                                console.error(
                                    `Erreur HTTP ${response.status} : ${file}`
                                );

                                return null;
                            }


                            const data =
                                await response.json();


                            // ------------------------------------------------
                            // IMPORTANT
                            // On garde le nom du fichier pour debug.
                            // ------------------------------------------------

                            data.__source_file =
                                file;


                            console.log(
                                "Espèce chargée :",
                                file,
                                "→",
                                getSpeciesName(data)
                            );


                            return data;

                        } catch (error) {

                            console.error(
                                `Erreur lecture JSON : ${file}`,
                                error
                            );


                            return null;
                        }

                    }
                )

            );


        speciesData =
            results.filter(
                data => data !== null
            );


        console.log(
            `TOTAL : ${speciesData.length} espèces chargées`
        );


        console.table(
            speciesData.map(data => ({
                fichier:
                    data.__source_file,

                espece:
                    getSpeciesName(data),

                scientific_name:
                    data.scientific_name,

                taxonomy_species:
                    data?.taxonomy?.species,

                canonical_name:
                    data?.taxonomy?.canonical_name
            }))
        );


        displaySpecies();

        displayFeaturedSpecies();

        updateHomeStats();


    } catch (error) {

        console.error(
            "Erreur générale :",
            error
        );

    }

}