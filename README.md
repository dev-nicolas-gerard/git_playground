# Débit Futé

Site indépendant de planification de coupes linéaires et comparaison de deux formats d'achat. Production : https://debit-fute.pages.dev/

## Hypothèse commerciale, sans garantie

L'analyse a écarté des outils généralistes de déménagement, de boîtes imprimables et de calepinage. Les recherches montrent aussi une concurrence réelle sur la découpe linéaire (CutOptim, NestingCalc, Tout est Faisable). Ce projet ne prétend donc pas découvrir un marché vierge. L'angle retenu est une décision avant achat : longueur des barres, quantité, prix total saisi, sciure et chutes séparées. Les dimensions et tarifs restent dans le navigateur. Le site apporte un outil utile avant la publicité ; aucun revenu certain, volume de recherche, CPC ou RPM mesuré n'est revendiqué.

La seule monétisation prévue initialement est Google **AdSense**, produit destiné aux éditeurs. Google Ads est le produit d'achat de publicité. Aucun compte publicitaire, partenariat marchand ou revenu n'est actif. Ne pas publier de promesses de gains, de faux témoignages ou de prix récupérés sans source.

## Développement

Node >=20. Aucune dépendance de production.

```
npm run build
npm test
```

La génération produit `dist/` avec HTML complet, CSS, modules JS, favicon, sitemap, robots et en-têtes. Les pages et les guides sont consultables sans JS ; le calculateur nécessite JS. Pas de backend, Workers, Pages Functions, D1, R2, KV, Images ou API d'IA. Hébergement Cloudflare Pages statique ; aucune fonction payante créée.

## Calcul et limites

Quatre heuristiques de placement : décroissant best-fit, décroissant first-fit, croissant best-fit, ordre de saisie first-fit. Le minimum global n'est pas garanti. Une seule longueur de stock par scénario, même matière et même section, coupes droites. Les deux formats comparés ne sont pas mélangés. Jusqu'à 200 pièces. Unités internes entières au millième de millimètre ; une cote saisie est arrondie à cette précision.

Capacité = stock − réserve totale. Placement = somme des pièces + largeur de coupe entre chaque paire. Pour le bilan physique, la coupe de détachement finale consomme min(largeur de lame, espace restant), puis la chute est l'espace restant net de cette coupe. Les petites fins de barre absorbées par la lame ne deviennent pas des chutes négatives. Chaque barre vérifie : pièces + sciage + réserve + chute = stock. Le schéma n'est pas une instruction de sciage et ne traite pas les angles, les défauts ni le dimensionnement structurel.

## Publication

Dépôt public `dev-nicolas-gerard/git_playground`, branche indépendante `site-debit-fute` ; master et le site Mes Fiches Assmat ne doivent pas être modifiés. Cloudflare Pages : projet `debit-fute`, commande `npm run build`, sortie `dist`, branche production `site-debit-fute`, previews désactivées. Déploiements de production sur push configurés. La réception réelle des événements GitHub doit être vérifiée : sur le premier site les commits via le connecteur n'avaient pas déclenché de build, et la connexion interactive GitHub a été annulée par l'utilisateur. Ne pas annoncer l'automatisation comme validée tant qu'un événement push suivi d'un build réussi n'a pas été observé. Un build manuel via l'API permet la publication initiale.

## Référencement et validation commerciale

Huit pages indexables, liens internes, descriptions propres, canonical cohérent, données structurées WebApplication/Article, sitemap et robots. La page légale incomplète et 404 sont noindex. Cela facilite la découverte ; l'indexation et la position ne sont pas garanties. Aucun volume de recherche ou délai d'indexation n'est inventé.

Après accès autorisé à Google Search Console : vérifier la propriété, soumettre `/sitemap.xml`, inspecter la page principale, suivre les requêtes et erreurs. À 14 jours vérifier la découverte et corriger les problèmes observés ; à 30 jours examiner les impressions et les intentions réelles ; à 60 jours décider des améliorations de contenu à partir des données. Ne pas multiplier des pages de faible valeur pour toutes les longueurs de barres. Sans trafic mesuré, aucune prévision de revenu fiable n'est possible.

Sources primaires consultées :
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://support.google.com/adsense/answer/9724
- https://support.google.com/adsense/answer/13554116
- https://developers.cloudflare.com/pages/functions/pricing/

## Avant la publicité

Compléter l'identité et le contact réels de l'éditeur dans `config.json` ; ne pas inventer une adresse. Faire approuver le compte AdSense et le site. Intégrer le consentement requis, dont une CMP certifiée Google pour les usages concernés en EEE, Royaume-Uni et Suisse ; mettre à jour la confidentialité et les en-têtes CSP. Ajouter `ads.txt` avec l'identifiant réel. Prévoir les premiers emplacements dans les guides, loin des boutons de calcul et d'export. Le build refuse `ads.enabled=true` : il faut une intégration revue, pas seulement changer un booléen. Aucun `ads.txt` fictif ni script publicitaire dormant.
