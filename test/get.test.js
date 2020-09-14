const test = require('ava')
const nock = require('nock')
const urlParser = require('url')

const { Client } = require('../lib/index')

const config = {
  api: 'http://ckan:5000',
  authToken: '5f492394-630d-4759-92f4-000f279dd71b',
  organizationId: 'demo-organization',
  datasetId: 'my-first-dataset',
}

const client = new Client(
  config.authToken,
  config.organizationId,
  config.datasetId,
  config.api
)

const metadataBody = {
  path: 'test/fixtures/sample.csv',
  pathType: 'local',
  name: 'sample',
  format: 'csv',
  mediatype: 'text/csv',
  encoding: 'UTF-8',
  resources: [],
}

const resourceBody = {
  path: 'test/fixtures/sample.csv',
  pathType: 'local',
  name: 'sample',
  format: 'csv',
  mediatype: 'text/csv',
  encoding: 'UTF-8',
  package_id: 'my_dataset_name',
}

test('get package', async (t) => {
  // Testing dataname/id
  let scope = nock(config.api)
    .get('/api/3/action/package_show')
    .query(true)
    .reply(200, (url) => {
      const queryObject = urlParser.parse(url, true).query
      t.is(client.api, config.api)
      t.deepEqual(queryObject, {
        id: 'my_dataset',
        use_default_schema: 'false',
        include_tracking: 'false',
      })
      return {
        success: true,
        result: {},
      }
    })

  await client.getPackage({
    id: 'my_dataset',
  })

  t.is(scope.isDone(), true)

  // Testing use_default_schema and include_tracking
  scope = nock(config.api)
    .persist()
    .get('/api/3/action/package_show')
    .query(true)
    .reply(200, (url) => {
      const queryObject = urlParser.parse(url, true).query
      t.is(client.api, config.api)
      t.deepEqual(queryObject, {
        id: 'my_dataset1',
        use_default_schema: 'true',
        include_tracking: 'true',
      })
      return {
        success: true,
        result: {},
      }
    })

  await client.getPackage({
    id: 'my_dataset1',
    useDefaultSchema: true,
    includeTracking: true,
  })

  t.is(scope.isDone(), true)
})
