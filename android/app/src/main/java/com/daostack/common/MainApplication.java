package com.daostack.common;

import android.app.ActivityManager;
import android.app.Application;
import android.content.Context;

import com.daostack.common.BuildConfig;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.orhanobut.hawk.Hawk;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.daostack.common.RNBridgePackage;
import com.daostack.common.async.MainHandler;
import com.daostack.common.config.IConfig;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private static Context context;

    public static Context getAppContext() {
        return context;
    }

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new RNFirebaseMessagingPackage());
            packages.add(new RNBridgePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false);
      initializeFlipper(this); // Remove this line if you don't want Flipper enabled
      context = getApplicationContext();
      Hawk.init(this).build();
      init();
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

    private void init() {

        boolean isCoreProcess = false;
        List<ActivityManager.RunningAppProcessInfo> processInfos = ((ActivityManager) getSystemService(Context.ACTIVITY_SERVICE)).getRunningAppProcesses();
        if (processInfos != null) {
            int pid = android.os.Process.myPid();
            for (ActivityManager.RunningAppProcessInfo info : processInfos) {
                if (info.pid == pid) {
                    if (IConfig.CORE_PROCESS_NAME.equals(info.processName)) {
                        isCoreProcess = true;
                    }
                    break;
                }
            }
        }
        //Main Thread
        if (isCoreProcess) {
            //init sp
//            Hawk.init(this).build();
            MainHandler.init(this);
        }
    }
}
