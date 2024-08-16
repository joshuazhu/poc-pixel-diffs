import { compare } from 'odiff-bin';
import * as fs from 'fs';

const PATH_TO_ACTUALS = `${__dirname}/fixtures/actuals`;
const PATH_TO_EXPECTS = `${__dirname}/fixtures/expects`;
const PATH_TO_DIFFS = `${__dirname}/fixtures/diffs`;

const run = async () => {
  const getSubFolders = (path: string) => fs.readdirSync(path);

  const testCases = getSubFolders(PATH_TO_ACTUALS);

  testCases.map(async (testCase) => {
    const actualsPhoto = `${PATH_TO_ACTUALS}/${testCase}/a.png`;
    const expectsPhoto = `${PATH_TO_EXPECTS}/${testCase}/a.png`;
    const diffResultPath = `${__dirname}/fixtures/diffs/${testCase}`;

    if (!fs.existsSync(expectsPhoto)) {
      fs.copyFileSync(actualsPhoto, expectsPhoto);
    }

    if (!fs.existsSync(diffResultPath)) {
      fs.mkdirSync(diffResultPath);
    }

    const result = await compare(
      actualsPhoto,
      expectsPhoto,
      `${diffResultPath}/diff.png`,
      {
        outputDiffMask: true,
        diffColor: 'yellow'
      }
    );

    if (!result.match) {
      console.log(
        `${testCase}: Pictures not match, saving diff result to ${diffResultPath}`
      );
    }
  });
};

run();
