# dancersQ

    $ git clone https://github.com/sbutalia/dancersQ2018.git
    $ cd dancersQ
    $ npm install

### Workarounds
rename `_requiresUserActionForMediaPlayback` to `requiresUserActionForMediaPlayback`
remove underscore

### Start the app in a browser
    $ ionic serve

### Re-add platform if any troubles
    $ cordova platform rm ios --save //or android
    $ cordova platform add ios --save //or android

### Run on device.
    $ ionic cordova run ios //or android --device
    $ https://ionicframework.com/docs/intro/deploying

### Useful flags (l - livereload, s - server logs, c - client logs)
    $ ionic cordova run android -l -s -c

### Run on emulator.
    $ ionic cordova build ios //or android
    $ ionic cordova emulate ios //or android

### Build on product environment and release
    $ ionic cordova build ios //or android --prod --release

## Plugins

    <plugin name="cordova-plugin-inappbrowser" spec="^1.7.1" />
    <plugin name="cordova-plugin-whitelist" spec="^1.3.2" />
    <plugin name="cordova-plugin-ionic-webview" spec="^1.1.15" />
    <plugin name="cordova-plugin-statusbar" spec="^2.2.3" />
    <plugin name="cordova-plugin-ionic-keyboard" spec="^2.0.2" />
    <plugin name="cordova-plugin-media" spec="^5.0.2">
    <plugin name="cordova-plugin-music-controls" spec="^2.1.4" />
    <plugin name="cordova-plugin-splashscreen" spec="^4.1.0" />
    <plugin name="cordova-plugin-file" spec="^6.0.1" />
    <plugin name="cordova-plugin-device" spec="^1.1.7" />
    <plugin name="cordova-plugin-filechooser" spec="^1.0.1" />
    <plugin name="cordova-plugin-filepicker" spec="^1.1.5" />
    <plugin name="cordova-plugin-facebook4" spec="^2.1.0" />
