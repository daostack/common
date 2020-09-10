import GDrive from 'react-native-google-drive-api-wrapper';
import RNFS from 'react-native-fs';
import logger from './Logger';
// import AuthService from './AuthService';

const mimeType = 'application/json';
const appDataFileName = 'appData.json';
const appDataFolder = 'appDataFolder';
const downloadHeaderPath = RNFS.DocumentDirectoryPath + '/' + appDataFileName;

export default class GoogleDriveService {
  constructor(accessToken) {
    this.instance = null;
    this.acessToken = accessToken;

    GDrive.setAccessToken(accessToken);
    GDrive.init();
  }

  static init = async (accessToken) => {
    GoogleDriveService.instance = new GoogleDriveService(accessToken);
  };

  static getInstance() {
    if (GoogleDriveService.instance == null) {
      throw new Error('GoogleDrive is not initialized');
    }
    return this.instance;
  }

  deleteAppDataFile = async () => {
    const response = await this.getAppData();
    logger.log(`files -> ${response.files} `);
    response.files.forEach((file, index) => {
      GDrive.files.delete(file.id);
    });
  };

  deleteAppDataFileById = async (id) => {
    GDrive.files.delete(id);
  };

  getFileById = async (id) => {
    const downloadFileResult = await GDrive.files.download(
      id,
      {toFile: downloadHeaderPath},
      {},
    );
    await downloadFileResult.promise;
    return await RNFS.readFile(downloadHeaderPath, 'utf8');
  };

  async getAppData() {
    const response = await GDrive.files.list({spaces: appDataFolder});
    return response.json();
  }

  async setAppData(appDataJson) {
    return await GDrive.files.createFileMultipart(
      appDataJson,
      mimeType,
      {
        parents: [appDataFolder],
        name: appDataFileName,
      },
      false,
    );
  }
}
