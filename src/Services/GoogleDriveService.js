import GDrive from 'react-native-google-drive-api-wrapper';
import RNFS from 'react-native-fs';

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

  static getInstance(accessToken) {
    if (
      !GoogleDriveService.instance ||
      GoogleDriveService.instance.accessToken !== accessToken
    ) {
      GoogleDriveService.instance = new GoogleDriveService(accessToken);
    }

    return GoogleDriveService.instance;
  }

  deleteAppDataFile = async () => {
    const response = await this.getAppData();
    console.log('files -> ', response.files);
    response.files.forEach((file, index) => {
      GDrive.files.delete(file.id);
    });
  };

  deleteAppDataFileById = async id => {
    GDrive.files.delete(id);
  };

  getFileById = async id => {
    const response = await GDrive.files.download(
      id,
      {toFile: downloadHeaderPath},
      {},
    );

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
