# vernonia-surveys

A tool for downloading Columbia County record surveys within Vernonia spatial extent, converting survey images to PDF, and [hosting](https://cityofvernonia.github.io/vernonia-surveys/) it all for use in web applications.

Check out the _Survey Search_ tool in [Vernonia Map](https://map.vernonia-or.gov/) to quickly find and view PDFs of surveys related to a tax lot.

![Survey Search](/screenshot.jpg 'Survey Search')

## Use

### Geometry

[https://cityofvernonia.github.io/vernonia-surveys/surveys.geojson](https://cityofvernonia.github.io/vernonia-surveys/surveys.geojson)

### PDFs

```
https://cityofvernonia.github.io/vernonia-surveys/surveys/<Survey>.pdf
```

Or use the _SurveyUrl_ property/attribute.

### Properties/attributes

```json
{
  "type": "Feature",
  "geometry": {},
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

## Update

### Requirements

[libtiff](http://www.libtiff.org/) available via command line.

### Install

```shell
npm install
```

### Run

```shell
node index.js
```

### Pages

Don't forget to merge and push `gh-pages`.

---

Made with :heart: and :coffee: in Vernonia, Oregon
