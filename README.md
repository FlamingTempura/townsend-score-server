# Postcode Townsend Deprivation Score service (for QRisk)

This service looks up the townsend deprivation score for a given postcode. This can be used for QRisk3.

The postcode must be provided without spaces. Case does not matter.

```
node townsend.js
```

```
GET http://localhost:3092/so143ja
=> { postcode: "SO143JA", lsoa: "Southampton 029C", townsend: 1.938381642 }
```

## Datasets

Two datasets are required. These are in data.7z and should be extracted to the root directory:

```
7z e data.7z
```

### Scores- 2011 UK LSOA.csv

_Available at:_ https://www.statistics.digitalresources.jisc.ac.uk/dataset/2011-uk-townsend-deprivation-scores)

_Description:_ 2011 UK Townsend Deprivation Scores

_CSV columns:_ "ID",GEO_CODE,GEO_LABEL,TDS,quintile


### PCD11_OA11_LSOA11_MSOA11_LAD11_EW_LU_aligned_v2.csv

_Available at:_ https://ons.maps.arcgis.com/home/item.html?id=ef72efd6adf64b11a2228f7b3e95deea

_Description_: Postcode to Output Area to Lower Layer Super Output Area to Middle Layer Super Output Area to Local Authority District (December 2011) Lookup in England and Wales

_CSV columns:_ "PCD7","PCD8","OA11CD","LSOA11CD","LSOA11NM","MSOA11CD","MSOA11NM","LAD11CD","LAD11NM","LAD11NMW","PCDOASPLT"