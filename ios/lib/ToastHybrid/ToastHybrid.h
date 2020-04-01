#import <React/RCTBridgeModule.h>
#import "Toast.h"
#import "ToastConfig.h"

//#if __has_include(<React/RCTBridgeModule.h>)
//#import <React/RCTBridgeModule.h>
//#elif __has_include("RCTBridgeModule.h")
//#import "RCTBridgeModule.h"
//#else
//#import "React/RCTBridgeModule.h"   // Required when used as a Pod in a Swift project



@interface ToastHybrid : NSObject <RCTBridgeModule>

@end
