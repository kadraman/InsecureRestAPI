# InsecureRestAPI

 _InsecureRestAPI_ is an intentionally insecure demonstration REST API built with Node.js, Express, and MongoDB. It is designed to showcase common application security vulnerabilities and to help security teams and developers evaluate, test, and learn static and dynamic application security scanning tools and secure coding practices.

 It is compatible with tools such as [OpenText Application Security](https://www.opentext.com/products/application-security).

## Pre-requisites

 - [Node.js 20 or later](https://nodejs.org/en/download)
 - [MongoDB](https://www.mongodb.com/) Community Edition (optional as an embedded version will be downloaded for testing)
 - [Docker installation](https://docs.docker.com/engine/install/) (optional)
 - [Powershell for Linux](https://learn.microsoft.com/en-us/powershell/scripting/install/install-powershell-on-linux) (if running on Linux to be able to run the Powershell scripts)

## Run Application (locally)

You can the run the application locally using the following:

```bash
npm install
npm install -g ts-node-dev
npm test
npm run dev
```

The API should then be available at the URL `http://localhost:5000`. If it fails to start,
make sure you have no other applications running on port 5000. 

## Run Application (as Docker container)

You also can build a Docker image for the application using the following:

```bash
npm run build
docker build -t demoapi:latest .
docker run -dp 8080:5000 demoapi:latest
```

The API should then be available at the URL `http://localhost:8080`. If it fails to start,
make sure you have no other applications running on port 8080.

## Using the API

Use the Swagger Documentation to test the API endpoints. First login as a user using the endpoint `/api/v1/site/sign-in` and either of the following credentials

- email: `user1@localhost.com` / password: `password`
- email: `admin@localhost.com` / password: `password`

Then copy the value of the `accessToken` returned. Go back to the top of the page. Click on **Authorize**
and enter this value.

There are also some example [Postman](https://www.postman.com/downloads/) collections in the `etc` directory.

## Scan Application (with OpenText Application Security)

To carry out a Fortify Static Code Analyzer local scan, run the following:

```
.\scan.ps1
```

To carry out a Fortify ScanCentral SAST scan, run the following:

```
fcli ssc session login
scancentral package -o package.zip -bt none
fcli sc-sast scan start --publish-to "_YOURAPP_:_YOURREL_" -f package.zip --store curScan
fcli sc-sast scan wait-for ::curScan::
fcli ssc action run appversion-summary --av "_YOURAPP_:_YOURREL_" -fs "Security Auditor View" -f summary.md
```

To carry out a Fortify on Demand scan, run the following:

```
fcli fod session login
scancentral package -o package.zip -bt none -oss
fcli fod sast-scan start --release "_YOURAPP_:_YOURREL_" -f package.zip --store curScan
fcli fod sast-scan wait-for ::curScan::
fcli fod action run release-summary --rel "_YOURAPP_:_YOURREL_" -f summary.md
```

---

Kevin A. Lee (kadraman) - klee2@opentext.com
