# Icon configuration

For common, we are using **[iconfont.cn](https://www.iconfont.cn/) ** to manage icon and **[react-native-iconfont-cli](https://github.com/iconfont-cli/react-native-iconfont-cli)** to generate icon.

The full icon set locate in my project in iconfont, the js link represent everything. 

![place](./Asset/icon_doc_1.png)

## Add or update new icon

Js link need to be regenerate everytime when the new icon is added or updated.

#### 1. Upload new icons

You can upload new icons using following button.

![icon_doc_2](./Asset/icon_doc_3.png)

#### 2. Regenerate new link

Once the icon set has been changed or updated, it will have a warning text above current js link, it will ask to regenerate new JS link after you click it. 

![icon_doc](./Asset/icon_doc_4.png)

#### 3. Updated local link

Then you will need update local js link which locate in `./iconfont.js`.

![icon_doc_3](./Asset/icon_doc_2.png)

#### 4. Regenerate the icons

There is command to regenerate the icon

```javascript
yarn icon
```

![icon_doc](./Asset/icon_doc_5.png)