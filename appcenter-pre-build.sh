#!/usr/bin/env bash
if [ $ENVIRONMENT_VARIABLE = "production" ]; then
   cp .env.production .env
fi
if [ $ENVIRONMENT_VARIABLE = "staging" ]; then
   cp .env.staging .env
fi
if [ $ENVIRONMENT_VARIABLE = "development" ]; then
   cp .env.development .env
fi
sudo gem install cocoapods --pre
npx jetify
cd ios
rm -rf Pods
pod install

echo "checking environment settings"

echo $ENV_FILE
