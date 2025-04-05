# PCPartRadar

Website to find best price for hardware components.

## Endpoints API V1

```
GET /api/v1/components/<slug> - Info produit (info_produit.json)
GET /api/v1/components/<slug>/prices - Juste la partie prix de l'info produit
GET /api/v1/components/?name=rtx3080&page=1,2,3... - Recherche selon filtres
GET /api/v1/brands
GET /api/v1/categories
GET /api/v1/gpu-models
GET /api/v1/vendors
```