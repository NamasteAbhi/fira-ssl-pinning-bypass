# Fira SSL Pinning Bypass

Bypass Fira SSL pinning on Android devices.
Supported ABIs: `arm64-v8a`

## Patched APK (No Root)

Download the latest patched APK:
+ [fira-v12.2.apk](https://github.com/NamasteAbhi/fira-ssl-pinning-bypass/releases/download/fira/patched_app.apk)

## Run using Frida (Requires Root)

Requires frida-tools
```
frida -U -l .\fira-ssl-pinning-bypass.js -f org.fasaroid.fira
```

## Intercept network traffic

You can use a tool like mitmproxy or Burp Suite to intercept the network.

1. Install patched APK in the device
2. Install [mitmproxy](https://mitmproxy.org/) or [Burp Suite](https://portswigger.net/burp)
3. Set up proxy for wifi settings or run: `adb shell settings put global http_proxy <proxy>`

Now you should be able to see the network traffic.
