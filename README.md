[![Build Status](https://travis-ci.com/vtfk/minelev-pifu-api.svg?branch=master)](https://travis-ci.com/vtfk/minelev-pifu-api)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# minelev-pifu-api

Buddy compatible api service for MinElev

## API

### ```Get /ping```

Returns pong

## Development

Add a local `local.settings.json` file with this content:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "",
    "MONGODB_CONNECTION": "",
    "MONGODB_DATABASE": "",
    "MONGODB_COLLECTION": ""
  }
}
```

Start the dev environment

```
$ npm run dev
```

## Deploy to Azure functions

Create the function in Azure, and run this command

```
$ func azure functionapp publish <function-name>
```

## Related

- [minelev-web](https://github.com/telemark/minelev-web) web frontend for MinElev
- [minelev-logs](https://github.com/telemark/minelev-logs) logs service for MinElev
- [minelev-notifications](https://github.com/telemark/minelev-notifications) notifications service for MinElev
- [minelev-leder](https://github.com/telemark/minelev-leder) web frontend for MinElev - school administration
- [minelev-pifu-tools](https://github.com/telemark/minelev-pifu-tools) toolbox for converting pifu xml to tjommi data
- [minelev-tjommi-api](https://github.com/telemark/minelev-tjommi-api) old version of this api, using Zeit and data from [minelev-pifu-tools](https://github.com/telemark/minelev-pifu-tools)

# License

[MIT](LICENSE)