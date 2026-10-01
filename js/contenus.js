/* =========================================================
   REMPLISSAGE AUTOMATIQUE DU SITE
   ---------------------------------------------------------
   Organisation du dossier data/ :

     data/structure/   structure du site (rarement modifiée)
       navigation.json   navigation supérieure, menu principal,
                         sous-menus et réseaux sociaux. Le footer
                         est généré à partir des mêmes données.
       accueil.json      réglages de la page d'accueil
                         (éléments affichés dans le carrousel)

     data/contenus/    contenus ajoutés au fil de l'eau
       actualites.json, publications.json, projets.json,
       personnes.json, evenements.json, partenaires.json

   ---------------------------------------------------------
   CONTENUS : tout conteneur portant  data-source="xxx"  est
   rempli depuis  data/contenus/xxx.json.
     data-source  (obligatoire) nom du fichier, sans extension
     data-limit   (optionnel)   nombre maximum d'éléments
   Tri du plus récent au plus ancien (champ "date" AAAA-MM-JJ).
   Pour un nouveau type : créer le JSON, ajouter un gabarit
   dans RENDUS, placer <div data-source="nouveau-type"></div>.

   NAVIGATION (depuis data/structure/navigation.json) :
     data-nav="superieure"  liens de la navigation supérieure
     data-nav="principale"  menu principal + méga-menus
     data-nav="footer"      colonnes du footer (une par
                            catégorie ayant un sous-menu, puis
                            la colonne des réseaux sociaux)
   Une fois le menu construit, l'évènement "navigation:prete"
   est émis sur document (le script du menu s'y branche).

   CATÉGORIES : le champ "categorie" des contenus contient l'id
   d'une entrée de navigation.json (catégorie du menu ou élément
   de sous-menu, ex. "seminaires-et-conferences"). Le titre
   affiché est celui de navigation.json.

   CARROUSEL (depuis data/structure/accueil.json) :
     data-carrousel  sur la section .hero : les diapositives sont
                     les actualités, publications ou projets dont
                     les ids sont listés dans "carrousel.elements"
                     (dans cet ordre).
   Une fois construit, l'évènement "carrousel:pret" est émis
   sur document (le script du carrousel s'y branche).

   AGENDA (depuis data/contenus/evenements.json) :
     data-agenda  conteneur de la section Agenda : onglets
                  « À venir » / « Passés », calculés d'après la
                  date du jour du visiteur.
       data-limit-avenir  (optionnel) nb d'évènements à venir
                          affichés avant « Afficher plus » (déf. 6)
       data-limit-passes  (optionnel) idem pour les passés (déf. 4)

   PROJET (fiche détaillée d'un projet) :
     data-projet="id-du-projet"  conteneur de la section Projet.
       Affiche : pays, titre, image, description du projet ;
       un volet de navigation à droite (voir VOLET ci-dessous,
       menu "projets" par défaut, projet courant mis en évidence) ;
       les publications dont "projets" contient cet id ;
       les personnes dont "projets" contient cet id (avec photo ;
       carte cliquable si la personne a un "lien") ;
       les partenaires listés dans le champ "partenaires" du
       projet (ids de data/contenus/partenaires.json) ;
       les dernières actualités dont "projets" contient cet id.
       data-limit-actualites  (optionnel) nb d'actualités affichées,
                          puis « Afficher plus » par lots de ce nombre (déf. 4)
       data-limit-equipe  (optionnel) nb de personnes affichées
                          avant « Afficher plus » sur grand écran (déf. 5)
       data-limit-equipe-mobile  (optionnel) idem sur petit écran,
                          ≤ 600 px, grille de 2 colonnes (déf. 6)
       data-volet         (optionnel) autre menu pour le volet
       data-volet-titre   (optionnel) titre du volet
                          (déf. « Tous les projets »)

   PERSONNE (portrait détaillé, même principe que PROJET) :
     data-personne="id-de-la-personne"  conteneur d'une section.
       Plusieurs ids possibles, séparés par des virgules
       (ex. "rania-hedeya, aida-robbana") : portraits à la suite.
       Affiche : nom, photo, biographie ; puis ses publications,
       projets et dernières actualités (voir GROUPES_PERSONNE) ;
       un volet de navigation à droite (menu "a-propos" par défaut).
       data-volet         (optionnel) autre menu pour le volet,
                          ou "aucun" pour ne pas en afficher
       data-volet-actif   (optionnel) élément du menu mis en évidence
       data-volet-titre   (optionnel) titre du volet

   MEMBRES ET PARTENAIRES :
     data-partenaires  conteneur de la section. Affiche d'abord les
                       membres (pastilles rondes avec photo, comme
                       l'équipe d'un projet, depuis personnes.json),
                       puis les partenaires groupés par catégorie
                       (ordre de "categories" dans partenaires.json).
       data-partenaires="id1, id2"  (optionnel) n'afficher que ces
                       catégories de partenaires
       data-membres    (optionnel) ids de personnes séparés par des
                       virgules, dans l'ordre voulu (déf. toutes les
                       personnes de personnes.json) ; "aucun" pour
                       masquer le bloc Membres
       data-titre-membres (optionnel) titre du bloc (déf. « Membres »)
       data-limit-membres, data-limit-membres-mobile (optionnel)
                       pastilles visibles avant « Afficher plus »
                       (déf. toutes)
       data-titre      (optionnel) titre (déf. « Nos membres et partenaires »)
       data-volet      (optionnel) menu du volet (déf. "membres-partenaires",
                       donc menu « À propos » avec cet élément en
                       évidence) ; "aucun" pour ne pas en afficher
       data-volet-actif, data-volet-titre : comme pour VOLET.

   CATÉGORIE (liste des contenus d'une catégorie + volet) :
     data-categorie="id"  id d'une entrée de navigation.json :
       - élément de sous-menu (ex. "ouvrages-et-articles-scientifiques")
         -> contenus dont "categorie" vaut cet id ; volet = menu de
            sa catégorie parente ("Publications"), élément en évidence ;
       - catégorie du menu (ex. "publications")
         -> contenus de la catégorie ET de tous ses sous-menus.
       Les 4 plus récents, puis « Afficher plus » par lots de 4.
       data-limit    (optionnel) taille des lots (déf. 4)
       data-sources  (optionnel) fichiers parcourus, séparés par des
                     virgules (déf. "actualites, publications")
       data-titre    (optionnel) titre affiché (déf. titre de navigation.json)
       data-volet, data-volet-actif, data-volet-titre : comme ci-dessous,
                     data-volet="aucun" pour ne pas afficher de volet.

   VOLET (menu latéral de navigation, à droite du contenu) :
     data-volet="id"  sur n'importe quel conteneur : son contenu
                      passe dans une colonne principale et un volet
                      est ajouté à droite (dessous sur mobile).
       "id" = id d'une catégorie de navigation.json (ex. "a-propos")
              -> le volet liste son sous-menu (ou son sous-menu
                 automatique, ex. "projets" groupés par pays) ;
              ou id d'un élément de sous-menu (ex. "la-chaire")
              -> volet de sa catégorie, cet élément mis en évidence.
       data-volet-actif  (optionnel) id de l'élément à mettre en
                         évidence. Sans lui, c'est le lien qui pointe
                         vers la page courante.
       data-volet-titre  (optionnel) titre (déf. titre de la catégorie)
     Le volet est généré par la même fonction que le méga-menu
     (colonnesCategorie) : un seul système, aucune liste à recopier.
     Projets, personnes, catégories et volets génériques partagent ce code ; chaque volet
     reçoit un identifiant unique (plusieurs volets par page possibles).

   NOUVEL ONGLET : dans n'importe quel JSON, un élément qui a un
   "lien" peut ajouter  "nouvelOnglet": true  pour que ce lien
   s'ouvre dans un nouvel onglet (target="_blank").
     - "inscriptionNouvelOnglet": true  fait de même pour le
       lien "inscription" des évènements.
     - réseaux sociaux : nouvel onglet par défaut ; mettre
       "nouvelOnglet": false pour l'empêcher.

   Liens personnes <-> contenus :
     - projets : la PERSONNE porte la liste des projets
                 ("projets": ["id-projet", ...] dans personnes.json)
     - articles et actualités : le CONTENU porte la liste des
                 personnes ("personnes": ["id-personne", ...])
   ========================================================= */

(function () {
  "use strict";

  const DOSSIER_DATA = "data/";
  const DOSSIER_CONTENUS = "contenus/";   // défaut quand aucun sous-dossier n'est précisé

  /* ---------------------------------------------------------
     Utilitaires
     --------------------------------------------------------- */

  // Échappe le texte pour éviter toute injection HTML
  function esc(valeur) {
    return String(valeur ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // "2026-09-04" -> "4 septembre 2026"
  function formaterDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return esc(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Nom affiché des pays (les JSON utilisent des identifiants
  // en minuscules sans accent). Pays absent de la liste :
  // première lettre mise en majuscule.
  const NOMS_PAYS = {
    tunisie: "Tunisie",
    maroc: "Maroc",
    algerie: "Algérie",
    egypte: "Égypte",
    liban: "Liban",
    jordanie: "Jordanie",
    france: "France",
  };

  function nomPays(id) {
    const cle = String(id || "").toLowerCase();
    return NOMS_PAYS[cle] || cle.charAt(0).toUpperCase() + cle.slice(1);
  }

  // Tri du plus récent au plus ancien ; sans date : ordre d'origine conservé
  function trierParDate(liste) {
    return liste
      .map((item, ordre) => ({ item, ordre }))
      .sort((a, b) =>
        String(b.item.date || "").localeCompare(String(a.item.date || "")) || a.ordre - b.ordre
      )
      .map(({ item }) => item);
  }

  const publie = (item) => item && item.publie !== false;

  /* ---------------------------------------------------------
     Catégories : id (champ "categorie") -> titre de navigation.json
     Toutes les entrées portant un "id" sont prises en compte :
     navigation supérieure, catégories du menu, sous-menus.
     --------------------------------------------------------- */

  const TITRES_CATEGORIES = new Map();
  const categoriesInconnues = new Set();
  let chargementCategories = null;

  function chargerCategories() {
    if (!chargementCategories) {
      chargementCategories = charger("structure/navigation")
        .then((nav) => {
          const ajouter = (el) => {
            if (el && el.id && el.titre) TITRES_CATEGORIES.set(el.id, el.titre);
          };
          (nav.navigationSuperieure || []).forEach(ajouter);
          (nav.menu || []).forEach((cat) => {
            ajouter(cat);
            (cat.sousMenu || []).forEach(ajouter);
          });
        })
        .catch((err) => console.error("[contenus] Catégories : navigation.json illisible :", err));
    }
    return chargementCategories;
  }

  // Titre affiché d'une catégorie ("" si l'id est inconnu, avec avertissement)
  function titreCategorie(id) {
    if (!id) return "";
    if (TITRES_CATEGORIES.has(id)) return TITRES_CATEGORIES.get(id);
    if (!categoriesInconnues.has(id)) {
      categoriesInconnues.add(id);
      console.warn(`[contenus] Catégorie "${id}" introuvable dans data/structure/navigation.json`);
    }
    return "";
  }

  // Attributs à ajouter à un <a> si l'élément demande un nouvel onglet :
  //   cible(item)                          -> lit item.nouvelOnglet
  //   cible(item, "inscriptionNouvelOnglet") -> lit un autre champ
  //   cible(item, "nouvelOnglet", true)      -> nouvel onglet par défaut
  function cible(item, champ = "nouvelOnglet", parDefaut = false) {
    const valeur = item && typeof item[champ] === "boolean" ? item[champ] : parDefaut;
    return valeur ? ' target="_blank" rel="noopener noreferrer"' : "";
  }

  // Encode les espaces / accents des chemins d'images locaux
  function url(chemin) {
    return esc(encodeURI(chemin || ""));
  }

  /* ---------------------------------------------------------
     Gabarits de rendu (un par type de données)
     Signature : (item, index) => chaîne HTML
     --------------------------------------------------------- */

  const RENDUS = {

    // --- Dernières actualités (grille news-card) ---
    // Les 2 premières en grand format, les suivantes en petit.
    actualites(item, index) {
      const taille = index < 2 ? "news-card--large" : "news-card--small";
      return `
        <article class="news-card ${taille}">
          <img class="news-card__image" src="${url(item.image)}" alt="${esc(item.imageAlt || item.titre)}" loading="lazy">
          <div class="news-card__content">
            <div class="news-card__meta">
              <span>${esc(titreCategorie(item.categorie))}</span><span>${formaterDate(item.date)}</span>
            </div>
            <h3 class="news-card__title">${esc(item.titre)}</h3>
            <!--<p class="news-card__description">${esc(item.description)}</p>-->
          </div>
          <a class="news-card__link" href="${esc(item.lien || "#")}"${cible(item)} aria-label="Lire : ${esc(item.titre)}"></a>
        </article>`;
    },

    // --- Ouvrages et publications scientifiques (publication-card) ---
    // La 5e carte est masquée sur mobile (comportement d'origine).
    publications(item, index) {
      const classes = index >= 4 ? "publication-card no-mobile" : "publication-card";
      const auteurs = item.auteurs
        ? `<p class="publication-authors">${esc(item.auteurs)}</p>`
        : "";
      return `
        <article class="${classes}">
          <a href="${esc(item.lien || "#")}"${cible(item)}>
            <div class="publication-image">
              <img src="${url(item.image)}" alt="${esc(item.imageAlt || item.titre)}" loading="lazy">
            </div>
            <span class="publication-category">${esc(item.type)}</span>
            <h3>${esc(item.titre)}</h3>
            <!--${auteurs}
            <p class="publication-description">${esc(item.description)}</p>-->
          </a>
        </article>`;
    },
  };

  /* ---------------------------------------------------------
     Articles, projets et actualités d'une personne
     ---------------------------------------------------------
     Chaque groupe correspond à un fichier JSON.
       - "champPersonne" renseigné : la personne liste elle-même
         les ids (ex. "projets": [...] dans personnes.json).
       - sinon : l'élément liste les personnes dans "personnes".
     Tri du plus récent au plus ancien (sans date : ordre conservé).
     "limite" (optionnel) plafonne le nombre de cartes affichées.
     "initial" + "lot" (optionnel) : "initial" cartes visibles, puis
     « Afficher plus » en révèle "lot" de plus à chaque clic.
     Un groupe vide n'est pas affiché.
     --------------------------------------------------------- */

  const GROUPES_PERSONNE = [
    { source: "publications", titre: "Publications",             carte: carteArticle },
    { source: "projets",      titre: "Projets",              carte: carteProjet, champPersonne: "projets" },
    { source: "actualites",   titre: "Dernières actualités", carte: carteActualite, initial: 4, lot: 6 },
  ];


  // Projet : image à gauche, pays, titre, extrait de description
  function carteProjet(item) {
    const pays = (item.pays || []).map((p) => `<span class="pt-tag">${esc(nomPays(p))}</span>`).join("");
    const desc = Array.isArray(item.description) ? item.description[0] : item.description;
    return `
      <article class="pt-projet">
        <a class="pt-projet__lien" href="${esc(item.lien || "#")}"${cible(item)}>
          <div class="pt-projet__image">
            <img src="${url(item.image)}" alt="${esc(item.imageAlt || item.titre)}" loading="lazy">
          </div>
          <div class="pt-projet__corps">
            ${pays ? `<div class="pt-projet__tags">${pays}</div>` : ""}
            <h4 class="pt-projet__titre">${esc(item.titre)}</h4>
            ${desc ? `<p class="pt-projet__desc">${esc(desc)}</p>` : ""}
            <span class="pt-projet__plus">Découvrir le projet</span>
          </div>
        </a>
      </article>`;
  }



  // Article : couverture verticale, catégorie · date, titre
  function carteArticle(item) {
    const meta = [item.type, formaterDate(item.date)].filter(Boolean).join(" · ");
    return `
      <article class="pt-article">
        <a class="pt-article__lien" href="${esc(item.lien || "#")}"${cible(item)}>
          <div class="pt-article__image">
            <img src="${url(item.image)}" alt="${esc(item.imageAlt || item.titre)}" loading="lazy">
          </div>
          <span class="pt-meta">${meta}</span>
          <h4 class="pt-article__titre">${esc(item.titre)}</h4>
        </a>
      </article>`;
  }


  // Actualité : image plein cadre, dégradé, catégorie · date, titre
  function carteActualite(item) {
    const meta = [titreCategorie(item.categorie), formaterDate(item.date)].filter(Boolean).join(" · ");
    return `
      <article class="pt-actu">
        <img class="pt-actu__image" src="${url(item.image)}" alt="${esc(item.imageAlt || item.titre)}" loading="lazy">
        <div class="pt-actu__contenu">
          <span class="pt-meta pt-meta--clair">${meta}</span>
          <h4 class="pt-actu__titre">${esc(item.titre)}</h4>
        </div>
        <a class="pt-actu__lien" href="${esc(item.lien || "#")}"${cible(item)} aria-label="Lire : ${esc(item.titre)}"></a>
      </article>`;
  }

  function grilleTravaux(parSource) {
    if (!parSource) return "";
    const blocs = GROUPES_PERSONNE
      .map((g) => {
        const items = (parSource[g.source] || []).slice(0, g.limite || Infinity);
        if (!items.length) return "";
        return `
          <section class="pt-groupe pt-groupe--${esc(g.source)}">
            <header class="pt-groupe__entete">
              <h3 class="pt-groupe__titre">${esc(g.titre)}</h3>
              <span class="pt-groupe__trait"></span>
            </header>
            <div class="pt-grille pt-grille--${esc(g.source)}"${g.lot ? ` data-pagine-pas="${g.lot}" data-pagine-initial="${g.initial || g.lot}"` : ""}>
              ${items.map(g.carte).join("")}
            </div>
          </section>`;
      })
      .join("");
    return blocs ? `<div class="personne__travaux">${blocs}</div>` : "";
  }

  // --- Portrait d'une personne (bloc text-media) ---
  // Titre = nom, image flottante à gauche, "bio" = liste de paragraphes.
  // Sous la bio : articles, projets et dernières actualités liés à la
  // personne, chacun dans sa propre grille (voir GROUPES_PERSONNE).
  function htmlPortrait(item, liens = {}) {
    const idTitre = `personne-${esc(item.id)}-titre`;
    const paragraphes = (Array.isArray(item.bio) ? item.bio : [item.bio])
      .filter(Boolean)
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");
    const image = item.image
      ? `<img class="text-media__image" src="${url(item.image)}" alt="${esc(item.imageAlt || item.nom)}" loading="lazy">`
      : "";
    return `
      <article class="personne" aria-labelledby="${idTitre}">
        <header class="site-section__header">
          <h2 id="${idTitre}" class="site-section__title">${esc(item.nom)}</h2>
          <span class="site-section__line"></span>
        </header>
        <div class="text-media">
          ${image}
          ${paragraphes}
        </div>
        ${grilleTravaux(liens[item.id])}
      </article>`;
  }

  // Construit { idPersonne: { source: [éléments triés] } }
  async function chargerLiensPersonnes(personnes) {
    const listes = await Promise.all(
      GROUPES_PERSONNE.map((g) => charger(g.source).catch((err) => {
        console.warn(`[contenus] data/contenus/${g.source}.json ignoré pour les portraits :`, err);
        return [];
      }))
    );

    const liens = {};
    GROUPES_PERSONNE.forEach((g, i) => {
      const elements = listes[i].filter(publie);

      if (g.champPersonne) {
        // La personne porte les ids : "projets": ["medina-de-tunis", ...]
        const parId = new Map(elements.map((el) => [el.id, el]));
        personnes.forEach((pers) => {
          const ids = Array.isArray(pers[g.champPersonne]) ? pers[g.champPersonne] : [];
          const trouves = ids.map((id) => {
            if (!parId.has(id)) console.warn(`[contenus] ${pers.id} : "${id}" introuvable dans ${g.source}.json`);
            return parId.get(id);
          }).filter(Boolean);
          if (trouves.length) (liens[pers.id] ||= {})[g.source] = trierParDate(trouves);
        });
      } else {
        // L'élément porte les ids : "personnes": ["gael-maignan", ...]
        trierParDate(elements.filter((el) => Array.isArray(el.personnes)))
          .forEach((el) => {
            el.personnes.forEach((id) => {
              ((liens[id] ||= {})[g.source] ||= []).push(el);
            });
          });
      }
    });
    return liens;
  }

  /* ---------------------------------------------------------
     Navigation (header + footer) depuis structure/navigation.json
     ---------------------------------------------------------
     Chaque catégorie de "menu" peut avoir :
       titre, lien          libellé et page de la catégorie
       sousMenu             [{ titre, lien }, ...]  (une colonne)
       sousMenuAuto         { source, grouperPar: "pays" }
                            sous-menu généré depuis un fichier de
                            contenus (une colonne par pays)
       bouton: true         affichée comme bouton (ex. Agenda)
       mobile: false        masquée sur mobile
       footer: false        exclue du footer
     --------------------------------------------------------- */

  // Sur ordinateur, au-delà de MAX_COLONNES_MENU pays, les colonnes
  // passent sur plusieurs lignes équilibrées (ex. 5 pays -> 3 + 2,
  // 7 pays -> 4 + 3) plutôt que de laisser un pays seul en bas.
  const MAX_COLONNES_MENU = 4;

  const lienHTML = (l, classe = "") =>
    `<a${classe ? ` class="${classe}"` : ""} href="${esc(l.lien || "#")}"${cible(l)}>${esc(l.titre)}</a>`;

  // Regroupe des éléments par pays (un élément multi-pays va dans
  // chaque colonne concernée ; pays dans l'ordre d'apparition).
  function grouperParPays(elements) {
    const parPays = new Map();
    elements.forEach((el) => {
      (el.pays && el.pays.length ? el.pays : ["autres"]).forEach((p) => {
        const cle = String(p).toLowerCase();
        if (!parPays.has(cle)) parPays.set(cle, []);
        parPays.get(cle).push(el);
      });
    });
    return [...parPays].map(([pays, liens]) => ({ titre: nomPays(pays), liens }));
  }

  // Résout le sous-menu d'une catégorie en colonnes : [{ titre?, liens }]
  async function colonnesCategorie(cat) {
    if (cat.sousMenuAuto) {
      const { source, grouperPar } = cat.sousMenuAuto;
      const elements = (await charger(source)).filter(publie);
      return grouperPar === "pays" ? grouperParPays(elements) : [{ liens: elements }];
    }
    if (Array.isArray(cat.sousMenu) && cat.sousMenu.length) {
      return [{ liens: cat.sousMenu }];
    }
    return [];
  }

  function htmlMegaMenu(cat, colonnes) {
    const parPays = !!(cat.sousMenuAuto && cat.sousMenuAuto.grouperPar === "pays");
    const nbLignes = Math.max(1, Math.ceil(colonnes.length / MAX_COLONNES_MENU));
    const parLigne = Math.max(1, Math.ceil(colonnes.length / nbLignes));

    // Lien vers la page de la catégorie, visible sur mobile uniquement
    // (sur mobile, toucher le titre ouvre/ferme le sous-menu).
    const rubrique = cat.lien && cat.lien !== "#"
      ? `<a class="mega-rubrique" href="${esc(cat.lien)}"${cible(cat)}>Tout voir : ${esc(cat.titre)}</a>`
      : "";

    const cols = colonnes.map((col, i) => `
          <div class="mega-column${parPays && i % parLigne === 0 ? " mega-column--debut" : ""}">
            ${col.titre ? `<h3 class="mega-title">${esc(col.titre)}</h3>` : ""}
            ${col.liens.map((l) => lienHTML(l)).join("")}
          </div>`).join("");

    return `
        <div class="mega-menu${parPays ? " mega-menu--pays" : ""}" aria-label="Sous-menu ${esc(cat.titre)}"${parPays ? ` style="--nb-colonnes:${parLigne}"` : ""}>
          ${rubrique}${cols}
        </div>`;
  }

  function htmlCategorieMenu(cat, colonnes) {
    if (cat.bouton) {
      return `<a href="${esc(cat.lien || "#")}"${cible(cat)} class="donate${cat.mobile === false ? " no-mobile" : ""}">${esc(cat.titre)}</a>`;
    }
    return `
      <div class="nav-item${cat.mobile === false ? " no-mobile" : ""}">
        <a href="${esc(cat.lien || "#")}"${cible(cat)} class="nav-link">${esc(cat.titre)}</a>
        ${colonnes.length ? htmlMegaMenu(cat, colonnes) : ""}
      </div>`;
  }

  // Colonne de footer : titre de catégorie + tous ses liens (dédoublonnés)
  function htmlColonneFooter(cat, colonnes) {
    const vus = new Set();
    const liens = colonnes.flatMap((c) => c.liens).filter((l) => {
      const cle = l.id || `${l.titre}|${l.lien}`;
      if (vus.has(cle)) return false;
      vus.add(cle);
      return true;
    });
    const titre = cat.lien && cat.lien !== "#" ? lienHTML(cat) : esc(cat.titre);
    return `
            <div class="footer-column">
                <h3>${titre}</h3>
                <ul>${liens.map((l) => `<li>${lienHTML(l)}</li>`).join("")}</ul>
            </div>`;
  }

  // Colonne "réseaux sociaux" du footer
  function htmlColonneReseaux(reseaux) {
    const liens = (reseaux && Array.isArray(reseaux.liens) ? reseaux.liens : []).filter(publie);
    if (!liens.length) return "";
    return `
            <div class="footer-column media-column">
                ${reseaux.titre ? `<h3>${esc(reseaux.titre)}</h3>` : ""}
                <div class="social-links">
                  ${liens.map((r) => `
                  <a href="${esc(r.lien || "#")}" aria-label="${esc(r.nom)}"${cible(r, "nouvelOnglet", true)}>
                    <img src="${url(r.icone)}" alt="${esc(r.nom)}">
                  </a>`).join("")}
                </div>
            </div>`;
  }

  async function construireNavigation() {
    const zSup = document.querySelector('[data-nav="superieure"]');
    const zMenu = document.querySelector('[data-nav="principale"]');
    const zFooter = document.querySelector('[data-nav="footer"]');
    if (!zSup && !zMenu && !zFooter) return;

    try {
      const nav = await charger("structure/navigation");
      const menu = (nav.menu || []).filter(publie);

      const colonnes = await Promise.all(menu.map((cat) =>
        colonnesCategorie(cat).catch((err) => {
          console.error(`[contenus] Sous-menu "${cat.titre}" :`, err);
          return [];
        })
      ));

      if (zSup) {
        zSup.innerHTML = (nav.navigationSuperieure || []).filter(publie).map((l) => lienHTML(l)).join("");
      }

      if (zMenu) {
        zMenu.innerHTML = menu.map((cat, i) => htmlCategorieMenu(cat, colonnes[i])).join("");
      }

      if (zFooter) {
        const cols = menu
          .map((cat, i) => ({ cat, cols: colonnes[i] }))
          .filter(({ cat, cols }) => !cat.bouton && cat.footer !== false && cols.length);
        const reseaux = htmlColonneReseaux(nav.reseauxSociaux);
        zFooter.innerHTML = cols.map(({ cat, cols }) => htmlColonneFooter(cat, cols)).join("") + reseaux;
        zFooter.style.setProperty("--nb-colonnes-footer", cols.length + (reseaux ? 1 : 0));
      }

      document.dispatchEvent(new CustomEvent("navigation:prete"));
    } catch (err) {
      console.error("[contenus] Impossible de charger data/structure/navigation.json :", err);
    }
  }

  /* ---------------------------------------------------------
     Carrousel de la page d'accueil (structure/accueil.json)
     ---------------------------------------------------------
     "carrousel": {
       "elements": ["id", ...],       ordre d'affichage ; chaque id
                                      est cherché dans actualites,
                                      publications puis projets
       "delai": 6000,                 ms entre 2 diapositives
       "texteBouton": "En savoir plus"
     }
     En cas d'id identique dans deux fichiers, préciser la source :
       { "source": "projets", "id": "jdid" }
     Liste vide ou absente : les 3 actualités les plus récentes.

     Contenu d'une diapositive selon le type :
       actualité / publication : surtitre = titre de la catégorie
       projet                  : surtitre = "Projet · <pays>"
       texte = description (1er paragraphe si c'est une liste)
     --------------------------------------------------------- */

  const SOURCES_CARROUSEL = ["actualites", "publications", "projets"];

  function surtitreCarrousel(el, source) {
    if (source === "projets") {
      const pays = (el.pays || []).map(nomPays).join(", ");
      return pays ? `Projet · ${pays}` : "Projet";
    }
    return titreCategorie(el.categorie);
  }

  async function construireCarrousel() {
    const hero = document.querySelector("[data-carrousel]");
    if (!hero) return;

    try {
      const [accueil, ...listes] = await Promise.all([
        charger("structure/accueil"),
        ...SOURCES_CARROUSEL.map((src) => charger(src).catch((err) => {
          console.warn(`[contenus] Carrousel : data/contenus/${src}.json ignoré :`, err);
          return [];
        })),
        chargerCategories(),
      ]);
      const reglages = accueil.carrousel || {};

      // index : source -> Map(id -> élément)
      const index = {};
      SOURCES_CARROUSEL.forEach((src, i) => {
        index[src] = new Map(listes[i].filter(publie).map((el) => [el.id, el]));
      });

      function trouver(ref) {
        const id = typeof ref === "string" ? ref : ref && ref.id;
        const sources = ref && ref.source ? [ref.source] : SOURCES_CARROUSEL;
        for (const src of sources) {
          if (index[src] && index[src].has(id)) return { el: index[src].get(id), source: src };
        }
        console.warn(`[contenus] Carrousel : "${id}" introuvable dans ${sources.join(", ")}`);
        return null;
      }

      // "elements" (ou l'ancien nom "actualites")
      const refs = reglages.elements || reglages.actualites;
      let slides;
      if (Array.isArray(refs) && refs.length) {
        slides = refs.map(trouver).filter(Boolean);
      } else {
        slides = trierParDate([...index.actualites.values()]).slice(0, 3)
          .map((el) => ({ el, source: "actualites" }));
      }
      if (!slides.length) return;

      const texteBouton = reglages.texteBouton || "En savoir plus";
      const points = hero.querySelector(".hero-dots");

      slides.forEach(({ el: a, source }, i) => {
        const surtitre = surtitreCarrousel(a, source);
        const description = Array.isArray(a.description) ? a.description.find(Boolean) : a.description;

        const el = document.createElement("div");
        el.className = `hero-slide hero-slide--${source}`;
        if (a.image) el.style.setProperty("--slide-image", `url("${encodeURI(a.image)}")`);
        el.setAttribute("role", "group");
        el.setAttribute("aria-roledescription", "slide");
        el.setAttribute("aria-label", `${i + 1} sur ${slides.length}`);
        el.innerHTML = `
          <div class="hero-slide-content">
            ${surtitre ? `<span class="hero-eyebrow">${esc(surtitre)}</span>` : ""}
            <h2 class="hero-title">${esc(a.titre)}</h2>
            ${description ? `<p class="hero-description">${esc(description)}</p>` : ""}
            <a class="hero-link" href="${esc(a.lien || "#")}"${cible(a)}>${esc(texteBouton)}</a>
          </div>`;
        hero.insertBefore(el, points);

        const point = document.createElement("button");
        point.type = "button";
        point.className = "hero-dot";
        point.setAttribute("role", "tab");
        point.setAttribute("aria-label", `Aller à la diapositive ${i + 1}`);
        points.appendChild(point);
      });

      document.dispatchEvent(new CustomEvent("carrousel:pret", {
        detail: { delai: Number(reglages.delai) || 6000 },
      }));
    } catch (err) {
      console.error("[contenus] Carrousel : impossible de charger les données :", err);
    }
  }

  /* ---------------------------------------------------------
     Agenda (contenus/evenements.json)
     ---------------------------------------------------------
     Un évènement :
       id, titre                    obligatoires
       dateDebut   "AAAA-MM-JJ"     obligatoire
       dateFin     "AAAA-MM-JJ"     évènement sur plusieurs jours
       heureDebut, heureFin "HH:MM" optionnels
       lieu, description            optionnels
       categorie   id de navigation.json (ex. "ateliers")
       lien        page de l'évènement
       inscription lien d'inscription (bouton « S'inscrire »,
                   affiché uniquement pour les évènements à venir)
     Les évènements ne sont rattachés à aucune personne.
     Évènement à venir : bouton « Ajouter au calendrier » qui ouvre
     Outlook (outlook.office.com) avec l'évènement pré-rempli.
       publie: false                brouillon masqué

     À venir : dateFin (ou dateDebut) >= aujourd'hui, du plus
     proche au plus lointain. Passés : du plus récent au plus
     ancien. « En cours » : aujourd'hui entre début et fin.
     --------------------------------------------------------- */

  const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin",
                       "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  const ICONES = {
    date: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    heure: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    lieu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  };

  // Date locale du visiteur au format AAAA-MM-JJ (pas l'heure UTC)
  function aujourdhuiISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function partiesDate(iso) {
    const [a, m, j] = String(iso).split("-").map(Number);
    return { annee: a, mois: m - 1, jour: j };
  }

  const MOIS_LONGS = ["janvier", "février", "mars", "avril", "mai", "juin",
                      "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const jourFr = (n) => (n === 1 ? "1er" : String(n));

  // "Jeudi 15 octobre 2026" / "Du 4 au 6 novembre 2026" / "Du 28 octobre au 2 novembre 2026"
  function texteDates(debut, fin) {
    const d = partiesDate(debut);
    if (!fin || fin === debut) {
      const js = JOURS[new Date(d.annee, d.mois, d.jour).getDay()];
      return `${js.charAt(0).toUpperCase() + js.slice(1)} ${jourFr(d.jour)} ${MOIS_LONGS[d.mois]} ${d.annee}`;
    }
    const f = partiesDate(fin);
    const txtFin = `${jourFr(f.jour)} ${MOIS_LONGS[f.mois]} ${f.annee}`;
    let txtDebut = jourFr(d.jour);
    if (d.annee !== f.annee) txtDebut += ` ${MOIS_LONGS[d.mois]} ${d.annee}`;
    else if (d.mois !== f.mois) txtDebut += ` ${MOIS_LONGS[d.mois]}`;
    return `Du ${txtDebut} au ${txtFin}`;
  }

  // "09:30" -> "9 h 30"
  const heureFr = (h) => String(h).replace(/^0?(\d{1,2}):(\d{2})$/, "$1 h $2");

  // Pavé date (colonne de gauche)
  function htmlPaveDate(ev) {
    const d = partiesDate(ev.dateDebut);
    const f = ev.dateFin && ev.dateFin !== ev.dateDebut ? partiesDate(ev.dateFin) : null;
    let jour = String(d.jour);
    let mois = MOIS_COURTS[d.mois];
    let suite = "";
    if (f) {
      if (f.mois === d.mois && f.annee === d.annee) {
        jour = `${d.jour}–${f.jour}`;
      } else {
        suite = `<span class="evt__date-fin">→ ${f.jour} ${MOIS_COURTS[f.mois]}</span>`;
      }
    }
    return `
        <div class="evt__date" aria-hidden="true">
          <span class="evt__jour">${jour}</span>
          <span class="evt__mois">${mois}</span>
          ${suite || `<span class="evt__annee">${d.annee}</span>`}
        </div>`;
  }

  function htmlEvenement(ev, statut, masque) {
    const cat = titreCategorie(ev.categorie);
    const horaire = ev.heureDebut
      ? (ev.heureFin ? `${heureFr(ev.heureDebut)} – ${heureFr(ev.heureFin)}` : heureFr(ev.heureDebut))
      : "";
    const aLien = ev.lien && ev.lien !== "#";
    const titre = aLien
      ? `<a class="evt__lien" href="${esc(ev.lien)}"${cible(ev)}>${esc(ev.titre)}</a>`
      : esc(ev.titre);

    const actions = [];
    if (statut !== "passe" && ev.inscription) {
      actions.push(`<a class="evt__btn evt__btn--primaire" href="${esc(ev.inscription)}"${cible(ev, "inscriptionNouvelOnglet")}>S'inscrire</a>`);
    }
    if (statut !== "passe") {
      actions.push(`<a class="evt__btn evt__btn--secondaire" href="${esc(lienOutlook(ev))}"
            target="_blank" rel="noopener" aria-label="Ajouter « ${esc(ev.titre)} » à mon calendrier Outlook">
            ${ICONES.date}<span>Ajouter au calendrier</span></a>`);
    }

    return `
      <li class="evt evt--${statut}"${masque ? " hidden" : ""}>
        ${htmlPaveDate(ev)}
        <div class="evt__corps">
          <div class="evt__haut">
            ${cat ? `<span class="evt__cat">${esc(cat)}</span>` : ""}
            ${statut === "en-cours" ? `<span class="evt__badge">En cours</span>` : ""}
          </div>
          <h3 class="evt__titre">${titre}</h3>
          <ul class="evt__meta">
            <li>${ICONES.date}<span>${esc(texteDates(ev.dateDebut, ev.dateFin))}</span></li>
            ${horaire ? `<li>${ICONES.heure}<span>${esc(horaire)}</span></li>` : ""}
            ${ev.lieu ? `<li>${ICONES.lieu}<span>${esc(ev.lieu)}</span></li>` : ""}
          </ul>
          ${ev.description ? `<p class="evt__desc">${esc(ev.description)}</p>` : ""}
        </div>
        ${actions.length ? `<div class="evt__actions">${actions.join("")}</div>` : ""}
      </li>`;
  }

  // Lien Outlook pré-rempli :
  // https://outlook.office.com/calendar/0/deeplink/compose?subject=…&startdt=…&enddt=…&location=…&body=…
  // - avec horaire (même jour) : startdt/enddt = AAAA-MM-JJTHH:MM:00
  // - sans horaire ou sur plusieurs jours : journée(s) entière(s), allday=true
  //   (enddt = lendemain du dernier jour, borne exclue)
  function lienOutlook(ev) {
    const fin = ev.dateFin || ev.dateDebut;
    const lendemain = (iso) => {
      const d = new Date(iso + "T00:00:00");
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    const heure = (h) => String(h).padStart(5, "0") + ":00";   // "9:30" -> "09:30:00"

    const params = [["subject", ev.titre]];
    if (ev.heureDebut && fin === ev.dateDebut) {
      params.push(["startdt", `${ev.dateDebut}T${heure(ev.heureDebut)}`]);
      params.push(["enddt", `${fin}T${heure(ev.heureFin || ev.heureDebut)}`]);
    } else {
      params.push(["startdt", ev.dateDebut], ["enddt", lendemain(fin)], ["allday", "true"]);
    }
    if (ev.lieu) params.push(["location", ev.lieu]);

    const corps = [ev.description, ev.lien && ev.lien !== "#" ? new URL(ev.lien, location.href).href : ""]
      .filter(Boolean).join("\n\n");
    if (corps) params.push(["body", corps]);

    return "https://outlook.office.com/calendar/0/deeplink/compose?" +
      params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  }

  async function construireAgenda() {
    const zone = document.querySelector("[data-agenda]");
    if (!zone) return;

    try {
      const [evenements] = await Promise.all([charger("evenements"), chargerCategories()]);
      const auj = aujourdhuiISO();

      const valides = evenements.filter((ev) => publie(ev) && ev.dateDebut);
      const aVenir = valides
        .filter((ev) => (ev.dateFin || ev.dateDebut) >= auj)
        .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
      const passes = valides
        .filter((ev) => (ev.dateFin || ev.dateDebut) < auj)
        .sort((a, b) => (b.dateFin || b.dateDebut).localeCompare(a.dateFin || a.dateDebut));

      const limites = {
        avenir: parseInt(zone.dataset.limitAvenir, 10) || 6,
        passes: parseInt(zone.dataset.limitPasses, 10) || 4,
      };

      const panneaux = [
        { cle: "avenir", titre: "À venir", liste: aVenir,
          vide: "Aucun évènement programmé pour le moment. Revenez bientôt !" },
        { cle: "passes", titre: "Passés", liste: passes,
          vide: "Aucun évènement passé." },
      ];
      // Onglet ouvert par défaut : « À venir », sauf s'il est vide
      const actif = aVenir.length || !passes.length ? "avenir" : "passes";

      const onglets = panneaux.map((p) => `
        <button type="button" role="tab" class="agenda__onglet"
                id="agenda-onglet-${p.cle}" aria-controls="agenda-panneau-${p.cle}"
                aria-selected="${p.cle === actif}" tabindex="${p.cle === actif ? 0 : -1}">
          ${p.titre}
        </button>`).join("");

      const contenus = panneaux.map((p) => {
        const limite = limites[p.cle];
        const items = p.liste.map((ev, i) => {
          const fin = ev.dateFin || ev.dateDebut;
          const statut = p.cle === "passes" ? "passe" : (ev.dateDebut <= auj && fin >= auj ? "en-cours" : "a-venir");
          return htmlEvenement(ev, statut, i >= limite);
        }).join("");
        const reste = p.liste.length - limite;
        return `
        <div role="tabpanel" class="agenda__panneau" id="agenda-panneau-${p.cle}"
             aria-labelledby="agenda-onglet-${p.cle}"${p.cle === actif ? "" : " hidden"} data-pas="${limite}">
          ${p.liste.length
            ? `<ol class="agenda__liste">${items}</ol>
               ${reste > 0 ? `<button type="button" class="agenda__plus">Afficher plus d'évènements <span class="agenda__plus-nb">(${reste})</span></button>` : ""}`
            : `<p class="agenda__vide">${p.vide}</p>`}
        </div>`;
      }).join("");

      zone.innerHTML = `<div class="agenda__onglets" role="tablist" aria-label="Période">${onglets}</div>${contenus}`;
      zone.setAttribute("aria-busy", "false");

      // --- Onglets (clic + flèches du clavier) ---
      const boutons = [...zone.querySelectorAll('[role="tab"]')];
      function activer(btn, focus) {
        boutons.forEach((b) => {
          const sel = b === btn;
          b.setAttribute("aria-selected", sel);
          b.tabIndex = sel ? 0 : -1;
          zone.querySelector("#" + b.getAttribute("aria-controls")).hidden = !sel;
        });
        if (focus) btn.focus();
      }
      boutons.forEach((b, i) => {
        b.addEventListener("click", () => activer(b));
        b.addEventListener("keydown", (e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const suiv = boutons[(i + (e.key === "ArrowRight" ? 1 : -1) + boutons.length) % boutons.length];
          activer(suiv, true);
        });
      });

      // --- « Afficher plus » ---
      zone.querySelectorAll(".agenda__plus").forEach((btn) => {
        btn.addEventListener("click", () => {
          const panneau = btn.closest(".agenda__panneau");
          const pas = parseInt(panneau.dataset.pas, 10) || 4;
          const caches = [...panneau.querySelectorAll(".evt[hidden]")];
          caches.slice(0, pas).forEach((li) => { li.hidden = false; });
          const premier = caches[0] && caches[0].querySelector("a, button");
          if (premier) premier.focus({ preventScroll: true });
          const restants = caches.length - pas;
          if (restants > 0) btn.querySelector(".agenda__plus-nb").textContent = `(${restants})`;
          else btn.remove();
        });
      });

    } catch (err) {
      console.error("[contenus] Agenda : impossible de charger data/contenus/evenements.json :", err);
    }
  }

  /* ---------------------------------------------------------
     « Afficher plus » générique : les "pas" premiers enfants du
     conteneur sont visibles, chaque clic en révèle "pas" de plus.
     Utilisé par les actualités d'un projet et les catégories.
     --------------------------------------------------------- */

  // "initial" (optionnel) : nombre visible au départ, s'il diffère du lot
  function paginer(conteneur, pas = 5, libelle = "Afficher plus", initial = pas) {
    const items = [...conteneur.children];
    conteneur.setAttribute("data-pagine", "");
    if (items.length <= initial) return;
    items.forEach((el, i) => { el.hidden = i >= initial; });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bouton-plus";
    const majLibelle = () => {
      const reste = conteneur.querySelectorAll(":scope > [hidden]").length;
      btn.innerHTML = `${esc(libelle)} <span class="bouton-plus__nb">(${reste})</span>`;
      return reste;
    };
    majLibelle();

    btn.addEventListener("click", () => {
      const caches = [...conteneur.querySelectorAll(":scope > [hidden]")];
      caches.slice(0, pas).forEach((el) => { el.hidden = false; });
      const premier = caches[0] && caches[0].querySelector("a");
      if (premier) premier.focus({ preventScroll: true });
      if (!majLibelle()) btn.remove();
    });
    conteneur.after(btn);
  }

  // Branche la pagination sur tous les conteneurs [data-pagine-pas] d'une zone
  function brancherPagination(zone) {
    zone.querySelectorAll("[data-pagine-pas]").forEach((c) => {
      const pas = parseInt(c.dataset.paginePas, 10) || 5;
      paginer(c, pas, "Afficher plus", parseInt(c.dataset.pagineInitial, 10) || pas);
    });
  }

  /* ---------------------------------------------------------
     Volet de navigation (data-volet="id-navigation")
     ---------------------------------------------------------
     Construit à partir de navigation.json avec colonnesCategorie,
     la même fonction que le méga-menu et le footer : un sous-menu
     modifié dans navigation.json (ou un projet ajouté dans
     projets.json) apparaît partout à la fois.
     --------------------------------------------------------- */

  let compteurVolets = 0;   // identifiants uniques (plusieurs volets par page)

  // id de catégorie -> { cat, actif: null }
  // id d'élément de sous-menu -> { cat: sa catégorie, actif: cet id }
  async function resoudreNavigation(idNav) {
    const nav = await charger("structure/navigation");
    const menu = (nav.menu || []).filter(publie);
    const cat = menu.find((c) => c.id === idNav);
    if (cat) return { cat, actif: null };
    const parent = menu.find((c) => (c.sousMenu || []).some((s) => s.id === idNav));
    return parent ? { cat: parent, actif: idNav } : null;
  }

  // Le lien pointe-t-il vers la page affichée ? (ancres "#..." ignorées)
  function estPageCourante(lien) {
    if (!lien || lien.startsWith("#")) return false;
    try {
      const u = new URL(lien, location.href);
      return u.origin === location.origin && u.pathname === location.pathname;
    } catch (e) {
      return false;
    }
  }

  // HTML du volet ("" si l'id est inconnu ou le sous-menu vide)
  async function htmlVolet(idNav, options = {}) {
    const res = await resoudreNavigation(idNav);
    if (!res) {
      console.warn(`[contenus] Volet : "${idNav}" introuvable dans data/structure/navigation.json`);
      return "";
    }
    const { cat } = res;
    const actif = options.actif || res.actif;
    const colonnes = (await colonnesCategorie(cat))
      .map((c) => ({ ...c, liens: c.liens.filter(publie) }))
      .filter((c) => c.liens.length);
    if (!colonnes.length) return "";

    const estActif = (l) => (actif ? l.id === actif : estPageCourante(l.lien));
    const idTitre = `volet-${++compteurVolets}-titre`;
    const titre = options.titre || cat.titre;
    const titreHTML = cat.lien && cat.lien !== "#"
      ? `<a href="${esc(cat.lien)}"${cible(cat)}>${esc(titre)}</a>`
      : esc(titre);

    return `
        <nav class="volet" aria-labelledby="${idTitre}">
          <h3 id="${idTitre}" class="volet__titre">${titreHTML}</h3>
          ${colonnes.map((col) => `
          <div class="volet__groupe">
            ${col.titre ? `<h4 class="volet__sous-titre">${esc(col.titre)}</h4>` : ""}
            <ul>
              ${col.liens.map((l) => estActif(l)
                ? `<li><span class="volet__lien is-actif" aria-current="page">${esc(l.titre)}</span></li>`
                : `<li><a class="volet__lien" href="${esc(l.lien || "#")}"${cible(l)}>${esc(l.titre)}</a></li>`).join("")}
            </ul>
          </div>`).join("")}
        </nav>`;
  }

  // Conteneur générique : contenu existant -> colonne principale, volet à droite
  async function construireVolet(zone) {
    try {
      const volet = await htmlVolet(zone.dataset.volet, {
        actif: zone.dataset.voletActif,
        titre: zone.dataset.voletTitre,
      });
      if (!volet) return;
      const principal = document.createElement("div");
      principal.className = "volet-principal";
      while (zone.firstChild) principal.appendChild(zone.firstChild);
      zone.classList.add("volet-grille");
      zone.appendChild(principal);
      zone.insertAdjacentHTML("beforeend", volet);
    } catch (err) {
      console.error(`[contenus] Volet "${zone.dataset.volet}" :`, err);
    }
  }

  /* ---------------------------------------------------------
     Fiche projet (data-projet="id")
     ---------------------------------------------------------
     projets.json      titre, pays, image, description (liste de
                       paragraphes), "partenaires": ["id", ...]
     publications.json "projets": ["id-projet", ...]
     personnes.json    "projets": ["id-projet", ...]
     partenaires.json  { "categories": [{ id, titre }, ...],
                         "<id-categorie>": [{ id, nom, image, lien,
                                              nouvelOnglet }, ...] }
     Un partenaire sans image est affiché par son nom ; sans lien,
     il n'est pas cliquable. Un bloc vide n'est pas affiché.
     --------------------------------------------------------- */

  // id -> partenaire (avec le titre de sa catégorie)
  function indexerPartenaires(donnees) {
    const index = new Map();
    if (!donnees || typeof donnees !== "object") return index;
    const categories = Array.isArray(donnees.categories) ? donnees.categories : [];
    const titres = new Map(categories.map((c) => [c.id, c.titre]));
    Object.keys(donnees)
      .filter((cle) => cle !== "categories" && Array.isArray(donnees[cle]))
      .forEach((cle) => {
        donnees[cle].filter(publie).forEach((p) => {
          index.set(p.id, { ...p, categorieTitre: titres.get(cle) || "" });
        });
      });
    return index;
  }

  const initiales = (nom) => String(nom || "")
    .split(/[\s-]+/).filter(Boolean).slice(0, 2)
    .map((m) => m.charAt(0).toUpperCase()).join("");

  function htmlBlocProjet(titre, modificateur, contenu) {
    if (!contenu) return "";
    return `
          <section class="pt-groupe projet__bloc projet__bloc--${modificateur}">
            <header class="pt-groupe__entete">
              <h3 class="pt-groupe__titre">${esc(titre)}</h3>
              <span class="pt-groupe__trait"></span>
            </header>
            ${contenu}
          </section>`;
  }

  // Équipe : seules les premières personnes sont visibles, les suivantes
  // sont révélées par « Afficher plus ». Le nombre dépend de la largeur
  // d'écran : 5 sur grand écran, 6 sur téléphone (grille de 2 colonnes,
  // donc 3 lignes complètes). Recalculé si l'écran change de taille.
  const ECRAN_MOBILE = window.matchMedia("(max-width: 600px)");

  function htmlEquipe(personnes, limites) {
    if (!personnes.length) return "";
    return `<ul class="projet__equipe" data-limite="${limites.grand}" data-limite-mobile="${limites.mobile}">${personnes.map((p) => {
      const photo = p.image
        ? `<img class="projet__photo" src="${url(p.image)}" alt="" loading="lazy">`
        : `<span class="projet__photo projet__photo--initiales" aria-hidden="true">${esc(initiales(p.nom))}</span>`;
      const nom = `<span class="projet__nom">${esc(p.nom)}</span>`;
      const contenu = `${photo}${nom}${p.fonction ? `<span class="projet__fonction">${esc(p.fonction)}</span>` : ""}`;
      // Carte cliquable dès que la personne a un "lien" (page de profil)
      return `<li>${p.lien
        ? `<a class="projet__personne" href="${esc(p.lien)}"${cible(p)}>${contenu}</a>`
        : `<div class="projet__personne">${contenu}</div>`}</li>`;
    }).join("")}</ul>${personnes.length > Math.min(limites.grand, limites.mobile)
      ? `<button type="button" class="projet__plus">Afficher plus <span class="projet__plus-nb"></span></button>`
      : ""}`;
  }

  // Masque les personnes au-delà de "nb" et met à jour le bouton
  function appliquerLimiteEquipe(liste, nb) {
    const items = [...liste.children];
    items.forEach((li, i) => { li.hidden = i >= nb; });
    liste.dataset.affiches = nb;
    const btn = liste.nextElementSibling;
    if (!btn || !btn.classList.contains("projet__plus")) return;
    const reste = items.length - nb;
    btn.hidden = reste <= 0;
    btn.querySelector(".projet__plus-nb").textContent = `(${reste})`;
  }

  const limiteEquipe = (liste) =>
    parseInt(ECRAN_MOBILE.matches ? liste.dataset.limiteMobile : liste.dataset.limite, 10) || 5;

  function brancherAfficherPlus(zone) {
    zone.querySelectorAll(".projet__equipe").forEach((liste) => {
      appliquerLimiteEquipe(liste, limiteEquipe(liste));

      const btn = liste.nextElementSibling;
      if (btn && btn.classList.contains("projet__plus")) {
        btn.addEventListener("click", () => {
          const avant = parseInt(liste.dataset.affiches, 10) || 0;
          liste.dataset.deplie = "1";
          appliquerLimiteEquipe(liste, avant + limiteEquipe(liste));
          const premier = liste.children[avant] && liste.children[avant].querySelector("a");
          if (premier) premier.focus({ preventScroll: true });
        });
      }

      // Passage grand écran <-> téléphone : tant que le visiteur n'a pas
      // cliqué sur « Afficher plus », on applique la limite du nouvel écran.
      ECRAN_MOBILE.addEventListener("change", () => {
        if (!liste.dataset.deplie) appliquerLimiteEquipe(liste, limiteEquipe(liste));
      });
    });
  }

  // options.categorie = false : n'affiche pas la catégorie sous le nom
  // (inutile quand les partenaires sont déjà groupés par catégorie)
  function htmlPartenaires(partenaires, options = {}) {
    if (!partenaires.length) return "";
    const avecCategorie = options.categorie !== false;
    return `<ul class="projet__partenaires">${partenaires.map((p) => {
      const visuel = p.image
        ? `<img src="${url(p.image)}" alt="${esc(p.nom)}" loading="lazy">`
        : `<span class="projet__logo-texte">${esc(p.nom)}</span>`;
      const contenu = `
              <span class="projet__logo">${visuel}</span>
              <span class="projet__partenaire-nom">${esc(p.nom)}</span>
              ${avecCategorie && p.categorieTitre ? `<span class="projet__partenaire-cat">${esc(p.categorieTitre)}</span>` : ""}`;
      return `<li>${p.lien
        ? `<a class="projet__partenaire" href="${esc(p.lien)}"${cible(p)}>${contenu}</a>`
        : `<div class="projet__partenaire">${contenu}</div>`}</li>`;
    }).join("")}</ul>`;
  }

  async function construireProjet(zone) {
    const id = zone.dataset.projet;
    try {
      const [projets, publications, personnes, partenaires, actualites] = await Promise.all([
        charger("projets"),
        charger("publications").catch(() => []),
        charger("personnes").catch(() => []),
        charger("partenaires").catch((err) => {
          console.warn("[contenus] Projet : data/contenus/partenaires.json illisible :", err);
          return {};
        }),
        charger("actualites").catch(() => []),
        chargerCategories(),
      ]);

      const tous = projets.filter(publie);
      const projet = tous.find((pr) => pr.id === id);
      if (!projet) {
        console.error(`[contenus] Projet : "${id}" introuvable dans data/contenus/projets.json`);
        return;
      }

      const lie = (el) => Array.isArray(el.projets) && el.projets.includes(id);
      const pubs = trierParDate(publications.filter((el) => publie(el) && lie(el)));
      const equipe = personnes.filter((el) => publie(el) && lie(el));
      const actus = trierParDate(actualites.filter((el) => publie(el) && lie(el)));
      const limiteActus = parseInt(zone.dataset.limitActualites, 10) || 4;

      const indexPart = indexerPartenaires(partenaires);
      const parts = (Array.isArray(projet.partenaires) ? projet.partenaires : []).map((pid) => {
        if (!indexPart.has(pid)) console.warn(`[contenus] Projet "${id}" : partenaire "${pid}" introuvable dans partenaires.json`);
        return indexPart.get(pid);
      }).filter(Boolean);

      const paragraphes = (Array.isArray(projet.description) ? projet.description : [projet.description])
        .filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("");
      const pays = (projet.pays || []).map((p) => `<span class="pt-tag">${esc(nomPays(p))}</span>`).join("");
      const limitesEquipe = {
        grand: parseInt(zone.dataset.limitEquipe, 10) || 5,
        mobile: parseInt(zone.dataset.limitEquipeMobile, 10) || 6,
      };

      // Volet : même générateur que les volets data-volet (menu "projets")
      const volet = await htmlVolet(zone.dataset.volet || "projets", {
        actif: id,
        titre: zone.dataset.voletTitre || "Tous les projets",
      });

      zone.innerHTML = `
      <div class="projet__grille volet-grille">
        <article class="projet__principal volet-principal" aria-labelledby="projet-${esc(id)}-titre">
          <header class="projet__entete">
            ${pays ? `<div class="projet__tags">${pays}</div>` : ""}
            <h2 id="projet-${esc(id)}-titre" class="projet__titre">${esc(projet.titre)}</h2>
          </header>
          ${projet.image ? `<figure class="projet__image"><img src="${url(projet.image)}" alt="${esc(projet.imageAlt || projet.titre)}" loading="lazy"></figure>` : ""}
          ${paragraphes ? `<div class="projet__texte">${paragraphes}</div>` : ""}
          ${htmlBlocProjet("L'équipe du projet", "equipe", htmlEquipe(equipe, limitesEquipe))}
          ${htmlBlocProjet("Publications scientifiques", "publications",
            pubs.length ? `<div class="pt-grille pt-grille--publications">${pubs.map(carteArticle).join("")}</div>` : "")}
          ${htmlBlocProjet("Pour aller plus loin", "actualites",
            actus.length ? `<div class="pt-grille pt-grille--actualites" data-pagine-pas="${limiteActus}">${actus.map(carteActualite).join("")}</div>` : "")}
          ${htmlBlocProjet("Partenaires", "partenaires", htmlPartenaires(parts))}
        </article>
        ${volet}
      </div>`;
      zone.setAttribute("aria-busy", "false");
      brancherAfficherPlus(zone);
      brancherPagination(zone);
    } catch (err) {
      console.error(`[contenus] Projet "${id}" : impossible de charger les données :`, err);
    }
  }

  /* ---------------------------------------------------------
     Portrait(s) de personne(s) (data-personne="id" ou "id1, id2")
     --------------------------------------------------------- */

  async function construirePersonne(zone) {
    const ids = String(zone.dataset.personne || "").split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const [personnes] = await Promise.all([charger("personnes"), chargerCategories()]);
      const parId = new Map(personnes.filter(publie).map((p) => [p.id, p]));
      const choisies = ids.map((id) => {
        if (!parId.has(id)) console.error(`[contenus] Personne : "${id}" introuvable dans data/contenus/personnes.json`);
        return parId.get(id);
      }).filter(Boolean);
      if (!choisies.length) return;

      const liens = await chargerLiensPersonnes(choisies);
      const portraits = choisies.map((p) => htmlPortrait(p, liens)).join("");

      // Volet : même générateur que pour les projets (menu "a-propos" par défaut)
      const idVolet = zone.dataset.volet === undefined ? "a-propos" : zone.dataset.volet;
      const volet = idVolet && idVolet !== "aucun"
        ? await htmlVolet(idVolet, { actif: zone.dataset.voletActif, titre: zone.dataset.voletTitre })
        : "";

      zone.innerHTML = volet
        ? `<div class="volet-grille"><div class="volet-principal">${portraits}</div>${volet}</div>`
        : portraits;
      zone.setAttribute("aria-busy", "false");
      brancherPagination(zone);
    } catch (err) {
      console.error(`[contenus] Personne "${ids.join(", ")}" : impossible de charger les données :`, err);
    }
  }

  /* ---------------------------------------------------------
     Section partenaires (data-partenaires)
     Mêmes cartes que dans les fiches projet (htmlPartenaires),
     un bloc par catégorie de partenaires.json.
     --------------------------------------------------------- */

  async function construirePartenaires(zone) {
    const filtre = String(zone.dataset.partenaires || "").split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const [donnees, personnes] = await Promise.all([
        charger("partenaires"),
        charger("personnes").catch(() => []),
        chargerCategories(),
      ]);
      const categories = (Array.isArray(donnees.categories) ? donnees.categories : [])
        .filter((c) => !filtre.length || filtre.includes(c.id));
      filtre.filter((id) => !categories.some((c) => c.id === id)).forEach((id) => {
        console.warn(`[contenus] Partenaires : catégorie "${id}" introuvable dans data/contenus/partenaires.json`);
      });

      const blocs = categories.map((c) => {
        const membres = (Array.isArray(donnees[c.id]) ? donnees[c.id] : []).filter(publie);
        return htmlBlocProjet(c.titre, `partenaires partenaires__groupe`, htmlPartenaires(membres, { categorie: false }));
      }).join("");

      // --- Membres : pastilles rondes (même rendu que l'équipe d'un projet) ---
      const choixMembres = String(zone.dataset.membres || "").trim();
      let membres = [];
      if (choixMembres !== "aucun") {
        const toutes = personnes.filter(publie);
        if (choixMembres) {
          const parId = new Map(toutes.map((p) => [p.id, p]));
          membres = choixMembres.split(",").map((t) => t.trim()).filter(Boolean).map((id) => {
            if (!parId.has(id)) console.warn(`[contenus] Membres : "${id}" introuvable dans data/contenus/personnes.json`);
            return parId.get(id);
          }).filter(Boolean);
        } else {
          membres = toutes;
        }
      }
      const limitesMembres = {
        grand: parseInt(zone.dataset.limitMembres, 10) || 9999,
        mobile: parseInt(zone.dataset.limitMembresMobile, 10) || parseInt(zone.dataset.limitMembres, 10) || 9999,
      };
      const blocMembres = htmlBlocProjet(zone.dataset.titreMembres || "Membres", "equipe partenaires__membres",
        htmlEquipe(membres, limitesMembres));

      const idTitre = `partenaires-${++compteurVolets}-titre`;
      const contenu = `
        <section class="partenaires" aria-labelledby="${idTitre}">
          <h2 id="${idTitre}" class="projet__titre partenaires__titre">${esc(zone.dataset.titre || "Nos membres et partenaires")}</h2>
          ${blocMembres}
          ${blocs || (blocMembres ? "" : `<p class="categorie__vide">Aucun membre ni partenaire pour le moment.</p>`)}
        </section>`;

      const idVolet = zone.dataset.volet === undefined ? "membres-partenaires" : zone.dataset.volet;
      const volet = idVolet && idVolet !== "aucun"
        ? await htmlVolet(idVolet, { actif: zone.dataset.voletActif, titre: zone.dataset.voletTitre })
        : "";

      zone.innerHTML = volet
        ? `<div class="volet-grille"><div class="volet-principal">${contenu}</div>${volet}</div>`
        : contenu;
      zone.setAttribute("aria-busy", "false");
      brancherAfficherPlus(zone);
    } catch (err) {
      console.error("[contenus] Partenaires : impossible de charger data/contenus/partenaires.json :", err);
    }
  }

  /* ---------------------------------------------------------
     Liste d'une catégorie (data-categorie="id-navigation")
     --------------------------------------------------------- */

  const SOURCES_CATEGORIE = ["actualites", "publications"];

  // Carte horizontale : image, catégorie (ou type) · date, titre, extrait
  function carteListe(item) {
    const estPublication = item._source === "publications";
    const meta = [estPublication ? item.type : titreCategorie(item.categorie), formaterDate(item.date)]
      .filter(Boolean).join(" · ");
    const desc = Array.isArray(item.description) ? item.description[0] : item.description;
    return `
      <article class="liste-cat__item liste-cat__item--${esc(item._source)}">
        <a class="liste-cat__lien" href="${esc(item.lien || "#")}"${cible(item)}>
          <div class="liste-cat__image">
            ${item.image ? `<img src="${url(item.image)}" alt="${esc(item.imageAlt || item.titre)}" loading="lazy">` : ""}
          </div>
          <div class="liste-cat__corps">
            ${meta ? `<span class="pt-meta">${esc(meta)}</span>` : ""}
            <h3 class="liste-cat__titre">${esc(item.titre)}</h3>
            ${item.auteurs ? `<p class="liste-cat__auteurs">${esc(item.auteurs)}</p>` : ""}
            ${desc ? `<p class="liste-cat__desc">${esc(desc)}</p>` : ""}
            <span class="pt-projet__plus">${estPublication ? "Lire la publication" : "Lire la suite"}</span>
          </div>
        </a>
      </article>`;
  }

  async function construireCategorie(zone) {
    const idCat = zone.dataset.categorie;
    const sources = zone.dataset.sources
      ? zone.dataset.sources.split(",").map((t) => t.trim()).filter(Boolean)
      : SOURCES_CATEGORIE;
    try {
      const [nav, ...reste] = await Promise.all([
        charger("structure/navigation"),
        ...sources.map((src) => charger(src).catch((err) => {
          console.warn(`[contenus] Catégorie : data/contenus/${src}.json ignoré :`, err);
          return [];
        })),
        chargerCategories(),
      ]);
      const listes = reste.slice(0, sources.length);

      // Catégorie du menu -> elle-même + ses sous-menus ; sous-menu -> lui seul
      const menu = (nav.menu || []).filter(publie);
      const catMenu = menu.find((c) => c.id === idCat);
      const ids = new Set([idCat, ...(catMenu ? (catMenu.sousMenu || []).map((s) => s.id) : [])]);
      if (!catMenu && !menu.some((c) => (c.sousMenu || []).some((s) => s.id === idCat))) {
        console.warn(`[contenus] Catégorie : "${idCat}" introuvable dans data/structure/navigation.json`);
      }

      const elements = trierParDate(sources.flatMap((src, i) =>
        (Array.isArray(listes[i]) ? listes[i] : [])
          .filter((el) => publie(el) && ids.has(el.categorie))
          .map((el) => ({ ...el, _source: src }))
      ));

      const pas = parseInt(zone.dataset.limit, 10) || 4;
      const titre = zone.dataset.titre || titreCategorie(idCat) || idCat;
      const idTitre = `categorie-${esc(idCat)}-titre`;

      const idVolet = zone.dataset.volet === undefined ? idCat : zone.dataset.volet;
      const volet = idVolet && idVolet !== "aucun"
        ? await htmlVolet(idVolet, { actif: zone.dataset.voletActif, titre: zone.dataset.voletTitre })
        : "";

      const contenu = `
        <section class="categorie" aria-labelledby="${idTitre}">
          <h2 id="${idTitre}" class="projet__titre categorie__titre">${esc(titre)}</h2>
          ${elements.length
            ? `<div class="liste-cat" data-pagine-pas="${pas}">${elements.map(carteListe).join("")}</div>`
            : `<p class="categorie__vide">Aucun contenu pour le moment.</p>`}
        </section>`;

      zone.innerHTML = volet
        ? `<div class="volet-grille"><div class="volet-principal">${contenu}</div>${volet}</div>`
        : contenu;
      zone.setAttribute("aria-busy", "false");
      brancherPagination(zone);
    } catch (err) {
      console.error(`[contenus] Catégorie "${idCat}" : impossible de charger les données :`, err);
    }
  }

  /* ---------------------------------------------------------
     Chargement (avec cache : un fichier n'est lu qu'une fois
     même s'il alimente plusieurs blocs de la page)
     --------------------------------------------------------- */

  const cache = {};

  function charger(source) {
    if (!cache[source]) {
      // "structure/navigation" -> data/structure/navigation.json
      // "projets"              -> data/contenus/projets.json
      const chemin = source.includes("/") ? source : DOSSIER_CONTENUS + source;
      cache[source] = fetch(`${DOSSIER_DATA}${chemin}.json`, { cache: "no-cache" })
        .then((rep) => {
          if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
          return rep.json();
        });
    }
    return cache[source];
  }

  async function remplir(conteneur) {
    const source = conteneur.dataset.source;
    const rendu = RENDUS[source];
    const limite = parseInt(conteneur.dataset.limit, 10) || Infinity;

    if (!rendu) {
      console.warn(`[contenus] Aucun gabarit défini pour "${source}".`);
      return;
    }

    try {
      const [donnees] = await Promise.all([charger(source), chargerCategories()]);

      const items = [...donnees]
        .filter((item) => item.publie !== false)          // "publie": false = brouillon masqué
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, limite);

      conteneur.innerHTML = items.map((item, i) => rendu(item, i)).join("");
      conteneur.setAttribute("aria-busy", "false");
      conteneur.dispatchEvent(new CustomEvent("contenus:charges", { detail: { source, items } }));
    } catch (err) {
      console.error(`[contenus] Impossible de charger data/contenus/${source}.json :`, err);
      if (location.protocol === "file:") {
        console.error("[contenus] La page est ouverte en file:// — lancez un serveur local (ex. extension Live Server, ou `python -m http.server`).");
      }
      // En cas d'erreur, on laisse le contenu HTML de secours déjà présent.
    }
  }

  function init() {
    document.querySelectorAll("[data-source]").forEach(remplir);
    construireNavigation();
    construireCarrousel();
    construireAgenda();
    document.querySelectorAll("[data-projet]").forEach(construireProjet);
    document.querySelectorAll("[data-personne]").forEach(construirePersonne);
    document.querySelectorAll("[data-categorie]").forEach(construireCategorie);
    document.querySelectorAll("[data-partenaires]").forEach(construirePartenaires);
    document.querySelectorAll("[data-volet]:not([data-projet]):not([data-personne]):not([data-categorie]):not([data-partenaires])").forEach(construireVolet);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();