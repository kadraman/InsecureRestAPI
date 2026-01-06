# InsecureRestAPI

_InsecureRestAPI_ is a simple NodeJS/Express/MongoDB REST API that can be used for the demonstration of Application Security testing tools - such as OpenText Application Security.

Pre-requisites
---------------

 - Node.js 20 or later
 - MongoDB Community Edition (optional as an embedded version will be downloaded for testing)
 - Docker (optional)

Run Application (locally)
-------------------------

Install and run:

```bash
npm install
npm install -g ts-node-dev
npm test
npm run dev
```

The API should then be available at `http://localhost:5000`.

Run Application (as Docker container)
-------------------------------------

Build and run:

```bash
npm run build
docker build -t demoapi:latest .
docker run -dp 8080:5000 demoapi:latest
```

Using the API
-------------

Use the Swagger Documentation to test endpoints. Example credentials:

- email: `user1@localhost.com` / password: `password`
- email: `admin@localhost.com` / password: `password`

Scan Application (with OpenText Application Security)
-----------------------------------------------------

Use `make sast-scan` for a local SAST scan or the provided `fcli` commands for ScanCentral / FoD in the repository docs.

## Changes made (recent)

- Added `copilot-instructions.md` describing the repository purpose, how to run the app and tests, and the intentional insecure modes used for scanner testing.
- Added `CONTRIBUTING.md` with guidance for safely adding intentionally vulnerable examples (feature flags, inline comments, tests, and PR checklist).
- Added unit tests for utilities: `TextUtils` and `FileUtils` under `test/` and updated tests to safely mock `fs` and `child_process`.
- Modernized encryption utilities while preserving an opt-in legacy mode for demonstration. Legacy mode is gated by environment flags:
  - `USE_CRYPTO_BROWSERIFY=true` — load `crypto-browserify` at runtime
  - `USE_LEGACY_CIPHER=true` — enable legacy EVP_BytesToKey derived cipher behavior
- Annotated deliberate vulnerabilities across the codebase with `/* INTENTIONAL - educational */` comments (logging secrets, unsafe file operations, command construction, and unsafe JSON interpolation) so scanners and reviewers can more easily identify the intent.

> Important: This repository intentionally contains insecure code and vulnerable patterns for teaching and security scanner testing. Do not deploy this project or reuse insecure patterns in production.

---

Kevin A. Lee (kadraman) - klee2@opentext.com
# InsecureRestAPI

_InsecureRestAPI_ is a simple NodeJS/Express/MongoDB REST API that can be used for the demonstration of Application Security testing tools - such as [OpenText Application Security](https://www.opentext.com/products/application-security).

Pre-requisities
---------------

 - [Node.js 20 or later](https://nodejs.org/en/download)
 - [MongoDB](https://www.mongodb.com/) Community Edition (optional as an embedded version will be downloaded for testing)
 - Docker installation (optional)

Run Application (locally)
-------------------------

You can the run the application locally using the following:


```
npm install
npm install -g ts-node-dev
npm test
npm run dev
```

The API should then be available at the URL `http://localhost:5000`. If it fails to start,
make sure you have no other applications running on port 5000. 

Run Application (as Docker container)
-------------------------------------

You also can build a Docker image for the application using the following:

```
npm run build
docker build -t demoapi:latest .
```

Then run the container using a command similar to the following:

```
docker run -dp 8080:5000 demoapi:latest
```

The API should then be available at the URL `http://localhost:8080`. If it fails to start,
make sure you have no other applications running on port 8080.

Using the API
-------------

You can use the Swagger Documentation to test the API endpoints.
First login as a user using the endpoint "/api/v1/site/sign-in" and either of the following credentials

    - email: `user1@localhost.com`
      password: `password`
    - email: `admin@localhost.com`
      password: `password`

Then copy the value of the `accessToken` returned. Go back to the top of the page. Click on **Authorize**
and enter this value.

There are also some example [Postman](https://www.postman.com/downloads/) collections in the `etc` directory.

Scan Application (with OpenText Application Security)
-----------------------------------------------------

To carry out a Fortify Static Code Analyzer local scan, run the following:

```
make sast-scan
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
