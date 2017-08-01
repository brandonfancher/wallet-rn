# Tunneling to Overcome Dev Network Issues

In Xcode:
1. Product > Scheme > Edit Scheme > Run > Arguments > Environment Variables
1. Add TUNNEL_HOST (e.g., f51e87b7.ngrok.io) and TUNNEL_PORT (e.g., 80)

```objective-c
// AppDelegate.m

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
```

```objective-c
// RCTWebSocketExecutor.m

NSDictionary *environment = [[NSProcessInfo processInfo] environment];
NSString *port = environment[@"TUNNEL_PORT"] ?: [[_bridge bundleURL] port] ?: @"8081";
NSString *host = environment[@"TUNNEL_HOST"] ?: [[_bridge bundleURL] host] ?: @"localhost";

NSString *URLString = [NSString stringWithFormat:@"http://%@:%@/debugger-proxy?role=client", host, port];
_url = [RCTConvert NSURL:URLString];
```

In `Info.plist`, add the ngrok key as shown below:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSExceptionDomains</key>
  <dict>
    <key>ngrok.io</key>
    <dict>
      <key>NSIncludesSubdomains</key>
      <true/>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
    <key>localhost</key>
    <dict>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>
```
