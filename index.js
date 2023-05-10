import fs from 'fs-extra';
import util from 'node:util';
import { exec } from 'child_process';
import download from 'download';
import chalk from 'chalk';
import { queryFeatures } from '@esri/arcgis-rest-feature-service';
import imgToPDF from 'image-to-pdf';
const _exec = util.promisify(exec);

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
  await _exec(`tiff2pdf -z -o ${parts[0]}.pdf ${file}`);
};

const jpeg2pdf = async (file) => {
  const parts = file.split('.');
  if (parts[1] !== 'jpg' && parts[1] !== 'jpeg') {
    console.log(chalk.red(`${file} is not a jpeg file.`));
    return;
  }
  const stream = fs.createWriteStream(`${parts[0]}.pdf`);
  stream.on('finish', () => {
    fs.remove(file);
  });
  imgToPDF([file]).pipe(stream);
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
      const type = file.split('.')[1];
      if (type === 'tif' || type === 'tiff') {
        try {
          await tiff2pdf(file);
          fs.remove(file);
        } catch (error) {
          console.log(chalk.red(`tiff2pdf ${SVY_IMAGE} write failed.`, error));
        }
      }
      if (type === 'jpg' || type === 'jpeg') {
        jpeg2pdf(file);
      }
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
  fs.exists(
    `surveys/${SVY_IMAGE}`
      .replace('.tif', '.pdf')
      .replace('.tiff', '.pdf')
      .replace('.jpg', '.pdf')
      .replace('.jpeg', '.pdf'),
  )
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
    queryFeatures({
      url: featureServiceUrl,
      geometry: vernoniaSpatialExtent,
      returnGeometry: true,
      outFields: ['*'],
      spatialRel: 'esriSpatialRelIntersects',
      geometryType: 'esriGeometryPolygon',
      f: 'geojson',
    }).then((geojson) => {
      fs.writeFile('surveys.geojson', JSON.stringify(geojson));
    });
  })
  .catch((error) => {
    console.log(error);
    console.log(error.response);
    error.response.geometry.details.forEach((detail) => {
      console.log(detail);
    });
  });
