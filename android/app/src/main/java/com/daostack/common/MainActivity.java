package com.daostack.common;

import android.os.Bundle;
import android.os.PersistableBundle;

import com.facebook.react.ReactActivity;

import androidx.annotation.Nullable;
import android.content.Intent;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "common";
  }

  @Override
  public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
      // Use SplashTheme in AndroidManifest.xml for MainActivity, themes loads before layouts inflate
      setTheme(R.style.AppTheme); // Now set the theme from Splash to App before setContentView
      setContentView(R.drawable.background_splash); // Then inflate the new view
      SplashScreen.show(this); // Now show the splash screen. Hide it later in JS
      super.onCreate(savedInstanceState);

  }

  @Override
  public void onNewIntent(Intent intent) {
      setIntent(intent);
      super.onNewIntent(intent);
  }
}
