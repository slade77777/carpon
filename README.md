# CarponMobile

- iOS [![Build status](https://build.appcenter.ms/v0.1/apps/5478c34c-9793-47dc-9b7f-b2d4fd266048/branches/develop/badge)](https://appcenter.ms)

- android [![Build status](https://build.appcenter.ms/v0.1/apps/1360aadb-7683-46e3-93a1-19c40179bf19/branches/develop/badge)](https://appcenter.ms)


# Issues:

1. Problem with pods path

Run the command:

```shell
pod deintegrate
sudo gem install cocoapods-clean
pod clean
pod setup
gem install cocoapods --pre
pod install
```

2. Error: Build input file cannot be found: '../react-native/third-party/..'

Run the command:

```shell
cd node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../
cd node_modules/react-native/third-party/glog-0.3.5/ && ../../scripts/ios-configure-glog.sh && cd ../../../../
```

3. Problem with android
"class name ... does not match path"
"com.android.builder.dexing.DexArchiveBuilderException:"

```shell
./gradlew clean
```

4. Open React Developer Menu in android

```shell
adb shell input keyevent 82
```

5. Debug in Android not working

Run:
```shell
adb reverse tcp:8081 tcp:8081
```

Paste http://localhost:8081/debugger-ui into the address field of my Chrome browser. You should see the normal debugging screen but your app will still not be connected