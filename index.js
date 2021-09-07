require('cross-fetch/polyfill');
require('isomorphic-form-data');
const fs = require('fs-extra');
const { exec } = require('child_process');
const download = require('download');
const chalk = require('chalk');
const { queryFeatures } = require('@esri/arcgis-rest-feature-layer');

const featureServiceUrl =
  'https://gis.columbiacountymaps.com/server/rest/services/BaseData/Survey_Research/FeatureServer/0';

const surveyUrl = 'https://gis.columbiacountymaps.com/Surveys/';

const vernoniaSpatialExtent = {
  rings: [
    [
      [606952.056605339, 1490512.4505739063],
      [606952.056605339, 1529343.4065166563],
      [650728.9227023721, 1529343.4065166563],
      [650728.9227023721, 1490512.4505739063],
      [606952.056605339, 1490512.4505739063],
    ],
  ],
  spatialReference: { wkid: 102970, latestWkid: 6557 },
};

/**
 * Convert tiff to pdf.
 * @param {*} file 
 * @returns 
 */
const tiff2pdf = async (file) => {
  const parts = file.split('.');

  if (parts[1] !== 'tif' && parts[1] !== 'tiff') {
    console.log(chalk.red(`${file} is not a tiff file.`));
    return;
  }

  exec(`tiff2pdf -z -o ${parts[0]}.pdf ${file}`);
};

/**
 * Wrire file to `surveys` directory.
 * @param {*} SVY_IMAGE
 * @param {*} data
 */
const fileWrite = async (SVY_IMAGE, data) => {
  const file = `surveys/${SVY_IMAGE}`;

  fs.writeFile(file, data)
    .then(async () => {
      await tiff2pdf(file);
    })
    .catch((error) => {
      console.log(chalk.red(`${SVY_IMAGE} write failed.`, error));
    });
};

/**
 * Download file.
 * @param {*} SVY_IMAGE
 */
const fileDownload = (SVY_IMAGE) => {
  download(`${surveyUrl}${SVY_IMAGE}`)
    .then((data) => {
      fileWrite(SVY_IMAGE, data);
    })
    .catch(() => {
      console.log(chalk.red(`${SVY_IMAGE} download failed.`));
    });
};

/**
 * Check if file already exists.
 * @param {*} feature
 */
const fileCheck = (feature) => {
  const {
    attributes: { SVY_IMAGE },
  } = feature;

  fs.pathExists(`surveys/${SVY_IMAGE}`)
    .then((exists) => {
      if (!exists) {
        fileDownload(SVY_IMAGE);
      }
    })
    .catch((error) => {
      console.log(chalk.red(`File: surveys/${SVY_IMAGE} exists error.`, error));
    });
};

/**
 * Query surveys within spatial extent.
 */
queryFeatures({
  url: featureServiceUrl,
  geometry: vernoniaSpatialExtent,
  returnGeometry: false,
  outFields: ['SVY_IMAGE'],
  spatialRel: 'esriSpatialRelIntersects',
  geometryType: 'esriGeometryPolygon',
})
  .then((results) => {
    console.log(chalk.yellow(`${results.features.length} results`));
    results.features.forEach(fileCheck);
    // fileCheck(results.features[0]);
  })
  .catch((error) => {
    console.log(error);
    console.log(error.response);
    error.response.geometry.details.forEach((detail) => {
      console.log(detail);
    });
  });
