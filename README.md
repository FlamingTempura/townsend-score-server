# Postcode Townsend Deprivation Score service (for QRisk)

This service looks up the townsend deprivation score for a given UK postcode. This can be used for QRisk3.

```
node townsend.js
```

The postcode must be provided without spaces. Case does not matter.

```
GET http://localhost:3092/so143ja
=> { postcode: "SO143JA", lsoa: "Southampton 029C", townsend: 1.938381642 }
```

## Datasets

Two datasets are required. These are in data.7z and should be extracted to the root directory:

```
7z e data.7z
```

| Name | __Scores- 2011 UK LSOA.csv__ |
| :--- | :--- |
| Source       | [Census data](https://www.statistics.digitalresources.jisc.ac.uk/dataset/2011-uk-townsend-deprivation-scores) |
| Description  | 2011 UK Townsend Deprivation Scores |
| CSV columns  | "ID", GEO_CODE, GEO_LABEL, TDS, quintile |
| License      | Open Government License |

| Name | __PCD11_OA11_LSOA11_MSOA11_LAD11_EW_LU_aligned_v2.csv__ |
| :--- | :--- |
| Source       | [ONS](https://ons.maps.arcgis.com/home/item.html?id=ef72efd6adf64b11a2228f7b3e95deea) |
| Description  | Postcode to output area to lower layer super output area to middle layer super output area to local authority district (December 2011) lookup in England and Wales |
| CSV columns  | "PCD7", "PCD8", "OA11CD", "LSOA11CD", "LSOA11NM", "MSOA11CD", "MSOA11NM", "LAD11CD", "LAD11NM", "LAD11NMW", "PCDOASPLT"
| License      | Open Government License
