/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTConvert.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  // Added by Brandon: If port and host are provided in Schemes > Environment Variables, use those.
  // This helps us develop on-device on restricted networks with tools like ngrok.
  NSDictionary *environment = [[NSProcessInfo processInfo] environment]; // Get Environment Variables from Schemes
  if (environment[@"TUNNEL_PORT"] && environment[@"TUNNEL_HOST"]) {
    NSString *port = environment[@"TUNNEL_PORT"];
    NSString *host = environment[@"TUNNEL_HOST"];
    NSString *URLString = [NSString stringWithFormat:@"http://%@:%@/index.ios.bundle?platform=ios&dev=true", host, port];
    jsCodeLocation = [RCTConvert NSURL:URLString];
  } else {
    // Original Code from React
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  }

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"walletrn"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
