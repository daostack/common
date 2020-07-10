# CodePush

[CodePush](https://github.com/microsoft/react-native-code-push) made by Microsoft that enables React Native developers to deploy mobile app updates directly to their users’ devices. It use [AppCenter](http://appcenter.ms/) to manage.

### How to use

1. Install **code-push CLI**

   ```shell
   npm install -g code-push-cli
   ```

2. Login with code-push

   ```shell
   code-push login
   ```

3. Check project depolyment key (This step should be already configured)

   ```shell
   code-push deployment ls <project_name> -k
   ```

   If the project don't have deloyment key, it can bee added by following command

   ```shell
    code-push deployment add <project_name> -d
   ```

4. Bundle local js and upload to AppCenter

   To Staging env

   ```shell
   code-push release-react <project_name> [ios|android] -m 
   ```

   Or you can use this shorter command

   ```
   codepush:[ios|android]:release
   ```

   To Production env

   ```shell
   code-push release-react <project_name> [ios|android] -m -d Production
   ```

   Or you can use this shorter command

   ```
   codepush:[ios|android]:release:production
   ```

5. Find the release package in AppCenter

   The default behaviour will upload it in Staging env

   ![code](./Asset/code_push_1.png)

6. Move staging to production

   ![code2](./Asset/code_push_2.png)