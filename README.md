# vernonia-surveys

A tool for downloading Columbia County record surveys within Vernonia spatial extent and converting to PDF.

Check out the _Survey Search_ tool in [Vernonia Map](https://map.vernonia-or.gov/) to quickly find and view PDFs of surveys related to a tax lot.

![Survey Search](/screenshot.jpg 'Survey Search')

## use

### geometry

[surveys.geojson](https://cityofvernonia.github.io/vernonia-surveys/surveys.geojson)

### pdfs

```
https://cityofvernonia.github.io/vernonia-surveys/surveys/<Survey>.pdf
```

or use the _SurveyUrl_ property/attribute

### properties/attributes

```json
{
  "type": "Feature",
  "geometry": { ... },
  "properties": {
    "Client": "Weyerhaeuser NR Company",
    "Comments": "Two unsurveyed 80 acre parcels",
    "FileDate": "3/28/2016",
    "Firm": "K.L.S. Surveying, Inc.",
    "SurveyDate": "2/8/2016",
    "SurveyType": "Partition",
    "Sheets": 2,
    "Plat": null,
    "Survey": "PP2016-04",
    "SurveyUrl": "https://cityofvernonia.github.io/vernonia-surveys/surveys/PP2016-04.pdf"
  }
}
```

## update

### requirements

[libtiff](http://www.libtiff.org/)

### install

```shell
npm install
```

### run

```shell
node index.js
```

### pages

don't forget to merge and push `gh-pages`

---

Made with :heart: and :coffee: in Vernonia, Oregon
