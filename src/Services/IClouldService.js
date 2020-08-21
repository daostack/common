import RNFS from 'react-native-fs';
import RNCloudFs from 'react-native-cloud-fs';

const mimeType = 'application/json';
const appDataFileName = 'appDataCloud.json';
const appDataFolder = 'appDataFolder';
const downloadHeaderPath = `${RNFS.DocumentDirectoryPath}/${appDataFileName}`;

const appDataFilePath = `${appDataFolder}/${appDataFileName}`;
const iCloudScope = 'hidden';

export default class IClouldService {
  constructor() {
    this.instance = null;
  }

  static init = async () => {
    IClouldService.instance = new IClouldService();
  };

  static getInstance() {
    if (IClouldService.instance == null) {
      IClouldService.instance = new IClouldService();
    }
    return this.instance;
  }

  async getAppData() {
    const isExisting = await RNCloudFs.fileExists({
      targetPath: appDataFilePath,
      scope: 'hidden',
    });

    if (isExisting) {
      const appDataFiles = await RNCloudFs.listFiles({
        targetPath: appDataFilePath,
        scope: 'hidden',
      });
      return appDataFiles;
    }

    return null;
  }

  async setAppData(appDataJson) {
    await RNFS.writeFile(downloadHeaderPath, appDataJson, 'utf8');

    return await RNCloudFs.copyToCloud({
      sourcePath: { path: downloadHeaderPath },
      targetPath: appDataFilePath,
      mimeType,
      scope: iCloudScope,
    });
  }
}
