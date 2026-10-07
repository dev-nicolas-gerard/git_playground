# Mes Fiches Assmat

Site 100 % statique : six générateurs imprimables et trois guides originaux pour les assistantes et assistants maternels. Aucun service payant Cloudflare, aucune API d’exécution, aucune dépendance de production.

## Développement et déploiement

```sh
npm run build
npm test
python3 -m http.server 4173 --directory dist
```

Cloudflare Pages : commande `npm run build`, sortie `dist`, branche de production `site-mes-fiches-assmat` dans `dev-nicolas-gerard/git_playground`. Les autres branches ne doivent pas déclencher de publication de ce site. La branche `master` reste indépendante. Le dépôt de test peut être remplacé plus tard par un dépôt dédié, sans changer le code du site.

`config.json` fixe l’URL canonique, la date de publication et les informations d’édition. Après un changement de domaine, adapter `origin`, reconstruire, rediriger l’ancien domaine et mettre à jour Search Console. Ne pas changer d’URL simplement pour tester.

## Pourquoi ce créneau

Le pari est un ensemble cohérent de documents d’organisation, plutôt qu’un annuaire de centaines d’outils génériques. Les besoins de planning, présence et transmissions sont récurrents. Le visiteur obtient immédiatement un document personnalisé, pas seulement un article. La version mobile, les deux créneaux de présence pour le périscolaire, les dates réelles, les coupons multiples et l’export CSV constituent des fonctions utiles et vérifiables.

La recherche du 8 octobre 2026 montre aussi une concurrence réelle : AssMatNET propose un planning interactif ; Airnounou propose des cahiers de transmission ; Chez Nounou Julie propose une feuille de présence. La niche n’est donc pas vide. Aucun volume de recherche, coût par clic ou revenu attendu n’a été mesuré. Ne pas présenter ce choix comme un marché validé ou une promesse de positionnement.

Les alternatives ont des inconvénients : les convertisseurs PDF/images généralistes affrontent de gros acteurs ; les calculateurs de salaire ou de CMG demandent une maintenance réglementaire ; les exercices directement destinés aux enfants impliquent d’autres précautions publicitaires. Ce site reste un outil pour adultes, sans conseil de paie, santé ou nutrition.

## Acquisition : ce qui est fait et ce qui reste à faire

Fait dans le code : une URL lisible par outil, contenu et liens disponibles en HTML sans attendre JavaScript, titres et descriptions propres, canonique absolue, sitemap XML, robots.txt, données structurées exactes, navigation entre outils, vrai fichier 404, mise en page mobile, aucun appel de réseau effectué par les champs. Pas de pages de villes, variantes artificielles ou faux témoignages. Pas de note ou de popularité inventée.

À faire avec le propriétaire dès que le site est publié :

1. Ajouter la propriété de préfixe d’URL dans Google Search Console et fournir son fichier HTML ou sa balise de vérification. Une propriété de domaine n’est pas nécessaire pour le sous-domaine Pages.
2. Envoyer `/sitemap.xml` dans Search Console. Demander l’indexation de l’accueil et des trois outils prioritaires : présence, transmission, coupons. Vérifier les réponses HTTP et les URL canoniques avant l’envoi.
3. Tester les fiches avec quelques professionnels et recueillir des retours concrets. Le propriétaire peut montrer le site à des personnes qu’il connaît ; l’agent ne diffuse pas de messages sans demande explicite.
4. Ajouter un lien uniquement depuis une ressource réellement pertinente, avec l’accord de son responsable. Ne pas acheter de liens, spammer des groupes ou promettre des classements.
5. Observer les impressions, requêtes et clics à 14, 30 et 60 jours. Corriger d’abord les problèmes d’indexation et les fonctions. Développer ensuite des outils voisins seulement lorsqu’une demande est identifiable.

Un sitemap facilite la découverte, sans garantir l’indexation. Google indique que l’exploration peut prendre de quelques jours à quelques semaines et qu’une demande ne garantit pas l’inclusion. Un site neuf peut avoir peu ou pas de trafic pendant son lancement. Aucune soumission à Google n’est réputée effectuée tant que Search Console ne l’a pas confirmée.

## Publicité : verrouillée au lancement

Le service qui rémunère un éditeur est **Google AdSense**, et non Google Ads, qui sert à acheter de la publicité. Avant toute activation : fournir l’identifiant éditeur et la ligne ads.txt exacte, obtenir l’approbation du site, compléter les coordonnées légales, configurer une CMP certifiée adaptée aux exigences de Google et mettre à jour la confidentialité. Les identifiants d’éditeur sont publics ; ne jamais mettre de mot de passe ni de clé privée dans le dépôt.

Le build refuse actuellement `ads.enabled=true` : c’est un verrou volontaire jusqu’à une intégration et une vérification complètes. La version publiée ne charge aucun script d’annonce, de consentement ou de mesure. Il ne suffit pas de mettre un identifiant dans la configuration. Demain, intégrer le code fourni par AdSense et la CMP, ajuster le CSP uniquement pour les domaines réellement requis, vérifier les choix d’acceptation et de refus, puis publier.

Placement envisagé : une annonce clairement nommée « Publicités » après les explications et à distance des boutons d’impression et d’export ; jamais dans la fiche imprimée, près d’une commande de téléchargement ou au milieu d’une transmission personnalisée. Évaluer la conformité de la page outil avant d’y activer une annonce ; commencer par les guides si nécessaire. Ne pas pousser le contenu ou créer de clics accidentels avec des annonces automatiques.

Les revenus demandent de l’audience. Formule : revenu = pages vues / 1 000 × RPM réellement observé. Exemple arithmétique, sans valeur prédictive : à un RPM hypothétique de 3 €, 10 000 pages vues donneraient 30 €, 100 000 donneraient 300 €. Le RPM réel peut être très différent. Ne pas acheter du trafic pour tenter de gagner sur les annonces, ni encourager des proches à cliquer.

## Gratuité et confidentialité

Le site utilise seulement les fichiers statiques de Pages. Aucun Worker, Pages Function, D1, R2, KV, Images, IA Cloudflare ou service externe de PDF. L’impression PDF utilise le navigateur. Aucun abonnement ou moyen de paiement n’est ajouté. La documentation Cloudflare annonce des requêtes statiques gratuites et illimitées et une limite de 500 builds/mois sur Pages Free. La limite de build n’est pas une autorisation d’activer un plan payant.

Les champs sont uniquement en mémoire dans la page. Pas de cookies applicatifs, localStorage, sessionStorage, URL contenant la saisie ou requête réseau pour la fiche. Le fournisseur d’hébergement peut traiter les données techniques des requêtes. Les PDF et CSV sauvegardés restent sur l’appareil du visiteur. Les coordonnées complètes de l’éditeur ne sont pas inventées : la page de mentions le signale et doit être complétée avant monétisation.

## Sources de référence

- Google, contenu utile : https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google, sitemap : https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google, demande d’exploration : https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- AdSense, éligibilité : https://support.google.com/adsense/answer/9724?hl=fr
- AdSense, emplacements : https://support.google.com/adsense/answer/1346295?hl=fr
- AdSense, CMP : https://support.google.com/adsense/answer/13554116?hl=fr
- Cloudflare, statique gratuit : https://developers.cloudflare.com/pages/functions/pricing/
- Cloudflare, limites : https://developers.cloudflare.com/pages/platform/limits/

Ces sources ont été consultées le 8 octobre 2026. Recontrôler les règles avant l’intégration de la publicité.
