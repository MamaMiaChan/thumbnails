import { CHART_ID_OPTIONS, ChartID, CKBJson } from '@antv/knowledge';
import * as fse from 'fs-extra';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as SVGO from 'svgo';
import { SVGO_SETTINGS } from './svgo-settings';
import { SVG_PATH, TS_PATH } from './utils';

interface ChartInfo {
  chartId: string;
  chartName: string;
  svgCode: string;
}

interface ChartBaseRecord {
  svgFileName: string;
  svgFilePath: string;
  tsFileName: string;
  tsFilePath: string;
  chartId: string;
  chartName: string;
  svgCode: string;
}

interface ExtractSVGsParam {
  strict: boolean;
}

const genChartBaseRecord = async (fileName: string): Promise<ChartBaseRecord> => {
  const chartId = fileName;
  const chartName = CHART_ID_OPTIONS.includes(fileName as ChartID) ? ckb[fileName].name : fileName;

  const tsFileName = chartId;
  const tsFilePath = path.join(process.cwd(), TS_PATH, `${tsFileName}.ts`);

  const svgFilePath = path.join(process.cwd(), SVG_PATH, `${fileName}.svg`);

  const svg = await fse.readFile(svgFilePath as string, { encoding: 'utf8' });
  const { data: optSvg } = await svgo.optimize(svg);

  return {
    chartId,
    chartName,
    svgCode: optSvg,
    svgFileName: fileName,
    svgFilePath,
    tsFileName,
    tsFilePath,
  };
};

const svgo: SVGO = new SVGO(SVGO_SETTINGS);

/**
 * Template of a chart file.
 *
 * chartId.toUpperCase(): variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
 */
const fileTemplate = ({ chartId, chartName, svgCode }: ChartInfo) => `// ${chartId}

import { ChartImageInfo } from '../interfaces';

const ${chartId.toUpperCase()}: ChartImageInfo = {
  id: '${chartId}',
  name: '${chartName}',
  svgCode:
    '${svgCode}',
};

export default ${chartId.toUpperCase()};
`;

/**
 * Template of `index.ts` file
 *
 * @param chartFiles
 */
const indexTemplate = (chartFiles: string[]) => `// generated file index.ts

import { ChartID } from '@antv/knowledge';
import { ChartImageInfo } from './interfaces';

${chartFiles.map((file: string) => `import ${file.toUpperCase()} from './charts/${file}';`).join('\n')}

const Thumbnails: Partial<Record<ChartID, ChartImageInfo>> = {
${chartFiles.map((file: string) => `  ${file}: ${file.toUpperCase()}`).join(',\n')},
};

export default Thumbnails;

export { ${chartFiles.map((file: string) => `${file.toUpperCase()}`).join(', ')} };

// react component for displaying Thumbnail images
export { Thumbnail } from './components/Thumbnail';
`;

const ckb = CKBJson();

/**
 * Extract svg images from `svgs/`, optimize svg codes
 * and then generate corresponding ts file in `src/charts/`.
 */
const extractSVGs = async ({ strict }: ExtractSVGsParam) => {
  // get all charts

  const chartBase: ChartBaseRecord[] = [];

  const files = await fse.readdir(SVG_PATH);

  const questions: inquirer.Question[] = [];
  const notices: string[] = [];

  await Promise.all(
    files.map(async file => {
      const fileExtName = path.extname(file);
      const fileName = path.basename(file, fileExtName);

      if (fileExtName !== '.svg') {
        notices.push(`File ${file} is not with .svg and it has been ignored.`);
      } else {
        // `file` should be a ChartID
        if (CHART_ID_OPTIONS.includes(fileName as ChartID)) {
          chartBase.push(await genChartBaseRecord(fileName));
        } else {
          questions.push({
            default: false,
            message: `The name of file ${fileName} is not a ChartID. Still want to add it?`,
            name: fileName,
            type: 'confirm',
          });
        }
      }
    }),
  );

  // tslint:disable-next-line: no-console
  notices.forEach(notice => console.log(notice));

  if (strict) {
    // tslint:disable-next-line: no-console
    questions.forEach(({ name }) => console.log(`The name of file ${name} is not a ChartID. It has been ignored.`));
  } else {
    await inquirer.prompt(questions).then(async answers => {
      await Promise.all(
        Object.keys(answers).map(async fileName => {
          if (answers[fileName]) {
            chartBase.push(await genChartBaseRecord(fileName));
          }
        }),
      );
    });
  }

  // clear charts

  const currentTsFileNames = await fse.readdir(TS_PATH);
  const currentTsFilePaths = currentTsFileNames.map(fileName => path.join(process.cwd(), TS_PATH, fileName));
  await Promise.all(
    currentTsFilePaths.map(async tsPath => {
      await fse.unlink(tsPath);
    }),
  );

  // generate ts files

  await Promise.all(
    chartBase.map(async rec => {
      const { tsFilePath, chartId, chartName, svgCode } = rec;
      await fse.writeFile(tsFilePath, fileTemplate({ chartId, chartName, svgCode }));
    }),
  );

  // update index.ts

  await fse.writeFile(
    path.join(process.cwd(), 'src', 'index.ts'),
    indexTemplate(chartBase.map(rec => rec.tsFileName).sort()),
  );
};

(async () => {
  const myArgs = process.argv.slice(2);

  const isStrictMode = myArgs.length && myArgs[0] && myArgs[0] === 'strict' ? true : false;

  await extractSVGs({ strict: isStrictMode });

  // tslint:disable-next-line: no-console
  console.log('extract svg done!');
})();
