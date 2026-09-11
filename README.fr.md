# Jetons CI/CD par dépôt : ce que la page propose

Ce document est ta fiche de lecture. Le dépôt lui-même reste en anglais, c'est
lui que tu enverras à HeroUI.

## Ce qui coince aujourd'hui

Le tableau de bord délivre deux jetons, pas un de plus : un jeton personnel et un
jeton CI/CD. Le premier ne pose aucun problème, il appartient à une personne et
sert sur sa machine.

Le second, si. Dès qu'un compte a plusieurs dépôts, le même secret finit collé
dans toutes les pipelines, avec trois conséquences.

Réinitialiser devient impossible à doser : tu veux corriger un projet, tu casses
les builds de tous les autres en même temps.

Une fuite n'a aucune limite. Un secret qui traîne dans les logs d'une CI publique
ouvre l'installation de HeroUI Pro partout ailleurs.

Et rien n'est traçable. Impossible de savoir quel dépôt utilise encore le jeton
avant de le faire tourner.

## Ce que la page propose à la place

Le jeton personnel ne bouge pas, la carte est reprise à l'identique. La section
CI/CD devient une liste de jetons que tu crées toi-même, chacun rattaché aux
dépôts qu'il a le droit d'authentifier.

Une carte « Connected accounts » gère la liaison avec GitHub et GitLab. Un écran
de consentement simulé montre ce que la vraie redirection OAuth demanderait, en
lecture seule sur les métadonnées, jamais sur le code.

Quand tu crées un jeton, tu lui donnes un nom et tu coches les dépôts concernés,
un seul ou plusieurs, dans une liste filtrable qui ne montre que les fournisseurs
connectés. La portée reste modifiable ensuite sans réémettre le secret.

## Les deux confirmations

Réinitialiser et révoquer ne sont pas la même chose, donc les garde-fous sont
différents.

Pour la réinitialisation, il faut cocher une case qui dit que le secret actuel
cessera de fonctionner. Le bouton reste gris tant qu'elle n'est pas cochée, et le
texte nomme les pipelines qui vont réclamer la nouvelle valeur.

Pour la révocation, il faut taper le nom exact du jeton à la main. Le dialogue
affiche la liste des dépôts qui perdent l'accès, parce qu'un jeton supprimé ne
revient pas : il faut en créer un autre.

Débrancher un fournisseur demande aussi une confirmation, avec le nombre de
jetons qui cesseront de fonctionner.

## Lancer le projet

```bash
poddock sites start ~/Documents/Dev/web/heroui-tokens-proposal
```

Le port 3010 est déjà réservé pour ce projet. Le site répond sur
<http://localhost:3010>.

L'installation de `@heroui-pro/react` passe par ta licence HeroUI Pro. Le paquet
récupère les composants au postinstall, et pnpm doit y être autorisé : c'est le
rôle du champ `pnpm.onlyBuiltDependencies` dans le `package.json`.

## Ce qui est vrai et ce qui est simulé

Tout l'état vit dans le navigateur, à partir de `src/data/demo-data.ts`. Il n'y a
aucun serveur : l'autorisation du fournisseur est une temporisation, et les
secrets sont fabriqués côté client. Dans une vraie implémentation ils sont émis
côté serveur et affichés une seule fois.

Les dépôts et le compte affichés sont fictifs. Aucune de tes données ne se trouve
dans le dépôt.

## Où regarder dans le code

| Fichier | Ce qu'il contient |
| --- | --- |
| `src/app/page.tsx` | La coquille du tableau de bord, barre latérale comprise |
| `src/components/tokens/tokens-view.tsx` | L'état de la page et son agencement |
| `src/components/tokens/personal-token-card.tsx` | Le jeton personnel, inchangé |
| `src/components/tokens/scoped-token-card.tsx` | Un jeton CI/CD et sa portée |
| `src/components/tokens/token-scope-dialog.tsx` | Créer un jeton, ou modifier sa portée |
| `src/components/tokens/reset-token-dialog.tsx` | La réinitialisation en deux temps |
| `src/components/tokens/revoke-token-dialog.tsx` | La révocation en deux temps |
| `src/components/tokens/connected-accounts-card.tsx` | Les liaisons GitHub et GitLab |
| `src/components/tokens/repository-picker.tsx` | La liste de dépôts filtrable |
| `src/components/tokens/secret-field.tsx` | Le champ masqué, avec révélation et copie |

## Ce qui vient d'où

Côté HeroUI OSS : AlertDialog, Avatar, Button, Card, Checkbox, CheckboxGroup,
Chip, Description, Input, InputGroup, Label, Link, Modal, Separator, TextField,
Toast. Côté Pro : Sidebar et EmptyState. Aucune autre librairie d'interface.

Les icônes viennent de `@gravity-ui/icons`, celles qu'utilise HeroUI dans sa
propre documentation. Les logos GitHub et GitLab sortent de ta bibliothèque
locale et sont devenus des composants React dans
`src/components/icons/provider-icons.tsx`.
