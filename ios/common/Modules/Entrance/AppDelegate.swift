//
//  AppDelegate.swift
//  common
//
//  Created by lmcmz on 11/3/20.
//  Copyright © 2020 DAOstack. All rights reserved.
//

import UIKit
import React
import Firebase
import GoogleSignIn
import CodePush

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    private var bridge: RCTBridge?
    
    func application(
        _ application: UIApplication,
        open url: URL,
        sourceApplication: String?,
        annotation: Any
    ) -> Bool {
        return RCTLinkingManager.application(
            application,
            open: url,
            sourceApplication: sourceApplication,
            annotation: annotation)
    }
    
    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        return RCTLinkingManager.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler)
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        GIDSignIn.sharedInstance().clientID = FirebaseApp.app()?.options.clientID
        
        let jsCodeLocation = sourceURL()
        bridge = RCTBridge(bundleURL: jsCodeLocation, moduleProvider: nil, launchOptions: nil)
        
        let rootView = RCTRootView(bridge: bridge!, moduleName: "common", initialProperties: launchOptions)
        
        let rootViewController = UIViewController()
        rootViewController.view = rootView

        self.window = UIWindow(frame: UIScreen.main.bounds)
        self.window?.rootViewController = rootViewController
        self.window?.makeKeyAndVisible()
        
        return true
    }
    
    func sourceURL() -> URL? { 
        #if DEBUG
            return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
        #else
            return CodePush.bundleURL()
        #endif
    }

}

