<div align="center">

# CKAN Javascript Client

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/datopian/ckan-client-js/issues)
[![build](https://github.com/datopian/ckan-client-js/workflows/ckan-client-js%20actions/badge.svg)](https://github.com/datopian/ckan-client-js/actions)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://opensource.org/licenses/MIT)

`ckan-client-js` is a Javascript client "SDK" for interacting with the CKAN data management system (DMS). It covers the whole action API as well as convenience methods for uploading files, updating the metastore etc.

</div>

## Prerequisites

- [Node](https://nodejs.org/en/)
- [NPM Package Manager](https://www.npmjs.com/)

## Built with

- [crypto-js](https://cryptojs.gitbook.io/docs/)
- [axios](https://github.com/axios/axios)
- [ava](https://github.com/avajs/ava)
- [nock](https://github.com/nock/nock)
- [webpack](https://webpack.js.org/)

**Table of Contents**

- [Install](#install)
- [How to use?](#how-to-use?)
- [API](#api)
  - [Setting up the Client](#setting-up-the-client)
  - [Create a dataset](#createa-dataset)
  - [Retrieve the dataset](#retrieve-the-dataset)
  - [Update the dataset](#update-the-dataset)
  - [Create a dataset](#create-a-dataset)
  - [Advanced actions](#advanced-actions)
  - [Uploading a resource](#uploading-a-resource)
- [Build](#build)
- [Tests](#tests)
- [Changelog](#changelog)

## Install

First, clone the repo via git:

```bash
$ git clone git@github.com:datopian/ckan-client-js.git
```

And then install dependencies with npm.

```bash
$ cd ckan-client-js
```

```bash
$ npm install
```

It will create a directory called `ckan-client-js`.<br>
Inside that directory, it will generate the initial project structure.

```bash
ckan-client-js
.
├── CHANGELOG.md
├── CONTRIBUTING.md
├── lib
│   ├── file.js
│   ├── index.js
│   └── util
│       ├── ckan-auth-api.js
│       └── ckan-upload-api.js
├── License
├── package.json
├── package-lock.json
├── README.md
├── test
│   ├── fixtures
│   │   └── sample.csv
│   └── upload.test.js
└── webpack.config.js
```

## How to use?

Importing in **NodeJS**

```js
const { Client } = require('./lib/index')
const f11s = require('data.js') // This is for working with datasets
...
```

Importing in **web applications**

```js
import { Client } from "ckanClient";
import f11s from "data.js"  // This is for working with datasets
...
```

## API

### Setting up the Client

```js
const client = new Client(
  'my-api-key',
  'my-organization-id',
  'my-dataset-id',
  'api-url'
)
```

### Create a dataset

```js
// create a dataset
const dataset = await client.create({
  name: 'market',
})
console.log(dataset)
// {
//   relationships_as_object: [],
//   private: false,
//   id: '03de2e7a-6e52-4410-b6b1-49491f0f4d5a',
//   metadata_created: '2020-09-16T15:03:18.022114',
//   metadata_modified: '2020-09-16T15:03:18.022125',
//   creator_user_id: 'cdb427df-c1ac-4365-b33c-94ccfad55aff',
//   type: 'dataset',
//   resources: [],
//   groups: [],
//   relationships_as_subject: [],
//   name: 'market',
//   title: 'market',
//   revision_id: 'cfae5ff5-9b2e-4c91-965d-c0a2c740da37'
// }
```

### Retrieve the dataset

By id

```js
const dataset = await client.retrieve('03de2e7a-6e52-4410-b6b1-49491f0f4d5a')
```

Or by the name

```js
const dataset = await client.retrieve('market')
```

### Update the dataset

```js
await client.push(dataset)
```

Example of pushing a resource and updating the dataset

```js
// pushing some resource to the dataset
dataset.resources.push({
  bytes: 12,
  path: 'https://somecsvonline.com/somecsv.csv',
})

// then saving it, this will return a new dataset with updated fields
const updatedDataset = await client.push(dataset)
console.log(updatedDataset)
// {
//   relationships_as_object: [],
//   private: false,
//   id: '03de2e7a-6e52-4410-b6b1-49491f0f4d5a',
//   metadata_created: '2020-09-16T15:03:18.022114',
//   metadata_modified: '2020-09-16T15:07:51.299795',
//   creator_user_id: 'cdb427df-c1ac-4365-b33c-94ccfad55aff',
//   type: 'dataset',
//   resources: [
//     {
//       hash: '',
//       description: '',
//       format: 'CSV',
//       path: 'https://somecsvonline.com/somecsv.csv',
//       package_id: '03de2e7a-6e52-4410-b6b1-49491f0f4d5a',
//       created: '2020-09-16T15:07:51.315447',
//       revision_id: '60460e2f-c22b-4107-bee2-ccb21c849054',
//       id: '9f01b4a5-9592-4528-b135-5c0ddd43720c',
//       bytes: 12
//     }
//   ],
//   groups: [],
//   relationships_as_subject: [],
//   name: 'market',
//   title: 'market',
//   revision_id: 'cfae5ff5-9b2e-4c91-965d-c0a2c740da37'
// }
```

### Advanced actions

If you want to make more advanced requests to CKAN API, then you can use `action()` method. Please note that it accepts CKAN dataset and returns CKAN dataset. If you want to have frictionless data you have to use [CKAN<=>Frictionless Mapper](https://github.com/datopian/frictionless-ckan-mapper-js)

```js
// Update the the dataset name
const response = await client.action('package_update', {
  id: '03de2e7a-6e52-4410-b6b1-49491f0f4d5a',
  title: 'New title',
})
console.log(response.result)
// {
//   license_title: null,
//   maintainer: null,
//   relationships_as_object: [],
//   private: false,
//   maintainer_email: null,
//   num_tags: 0,
//   id: '03de2e7a-6e52-4410-b6b1-49491f0f4d5a',
//   metadata_created: '2020-09-16T15:03:18.022114',
//   metadata_modified: '2020-09-16T15:16:17.696326',
//   author: null,
//   author_email: null,
//   state: 'active',
//   version: null,
//   creator_user_id: 'cdb427df-c1ac-4365-b33c-94ccfad55aff',
//   type: 'dataset',
//   resources: [],
//   num_resources: 0,
//   tags: [],
//   groups: [],
//   license_id: null,
//   relationships_as_subject: [],
//   organization: null,
//   name: 'market',
//   isopen: false,
//   url: null,
//   notes: null,
//   owner_org: null,
//   extras: [],
//   title: 'New Title',
//   revision_id: '2b3fc86b-fcc0-47cc-92f2-a6c4830638f4'
// }
```

### Uploading a resource

```js
// If it is in Browser you can pass an attached file
const resource = f11s.open('path/to/example.csv')

client.pushBlob(resource)
// If you are in browser you can also track the progress, in the second argument
// client.pushBlob(resource, (progressEvent) => {
//   let progress = (progressEvent.loaded / progressEvent.total) * 100
//   console.log(progress)
// })

const dataset = await client.create({
  name: 'dataset-name',
})
dataset.resources.push(resource.descriptor)

const updatedDataset = await client.push(dataset)
```

## Build

This command will create a bundle in `dist`

```
npm run build
```

## Tests

```bash
$ npm test
```

or

```bash
$ yarn test
```

watch the test

```bash
$ npm run test:watch
```

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](CHANGELOG.md).

## Contributing

Please make sure to read the [CONTRIBUTING.md](CONTRIBUTING.md) Guide before making a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](License) file for details
