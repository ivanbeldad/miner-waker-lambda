# Miner Waker Lambda

[![GitHub package version](https://img.shields.io/github/package-json/v/ivandelabeldad/miner-waker-lambda.svg)]()
[![GitHub last commit](https://img.shields.io/github/last-commit/ivandelabeldad/miner-waker-lambda.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/github/ivandelabeldad/miner-waker-lambda/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ivandelabeldad/miner-waker-lambda?targetFile=package.json)

Restart automatically miners using ethos API and TPLink switchers through AWS Lambda


## About

This project ONLY works with TPLink HS100 devices and ethos.


## Deploy

##### Amazon Setup

First of all you will need an Amazon Web Services account and the aws cli installed and configured.
More info: https://aws.amazon.com/cli/

* Create a lambda function using either the https://console.aws.amazon.com/lambda or `aws lambda create-function`
* Select Nodejs6.10 as runtime
* Change handler to src/main.handler
* Set timeout to at least 10 seconds

> Recommended: Add a schedule trigger with CloudWatch Events

##### Local

Clone this repository
```
git clone https://github.com/ivandelabeldad/miner-waker-lambda.git
```

Copy config.yml.sample to config.yml and fill the gaps with your own configuration

Then run the following inside the project folder

```
npm install
npm run deploy -- name-of-your-lambda-function
```


## License

The API Rackian is open-sourced software licensed under
the [MIT license](https://github.com/ivandelabeldad/miner-waker-lambda/blob/master/LICENSE).
