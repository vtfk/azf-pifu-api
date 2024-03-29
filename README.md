[![Coverage Status](https://coveralls.io/repos/github/vtfk/azf-pifu-api/badge.svg?branch=master)](https://coveralls.io/github/vtfk/azf-pifu-api?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# azf-pifu-api

Api service for MinElev, using data from [minelev-pifu-tools](https://github.com/telemark/minelev-pifu-tools)

## API

All API calls needs an Authorization header with valid jwt  

### ```GET /me```

Get my teacher or student object

### ```GET /me/students```

Get all my students

Filter students by providing a name in the `name` property, example: `/me/students?name=Rasmus`

### ```GET /me/classes```

Get all my classes

### ```GET /me/schools```

Get all my schools

---

### ```GET /students?name={name}```

Search all **your** students

### ```GET /students/{id}```

Get a specific student

### ```GET /students/{id}/contactteachers```

Get all contact teacher for a given student

**Optional:** this also supports adding `?kontaktlarergruppe=true` to retrieve **only** kontaktlærergrupper for this teacher

### ```GET /teachers```

Get all teachers

**Optional:** this also supports searching by name, by adding ``?name={name}``

### ```GET /teachers/{id}```

Get a given teacher

### ```GET /teachers/{id}/contactclasses```

Get all contact classes for a given teacher

### ```GET /teachers/{id}/students```

Get all students for a given teacher

### ```GET /classes```

Get all classes

### ```GET /classes/{id}```

Get a given class

### ```GET /classes/{id}/students```

Get all students in a class the teacher has a relationship to.

If you want to get all students, regarding of who the current caller/teacher is, set the `all` query parameter to `true`.

### ```GET /classes/{id}/teachers```

Get all teachers in a class

### ```GET /schools```

Get all schools

### ```GET /schools/{id}```

Get a given school

### ```GET /schools/{id}/teachers```

Get all teachers for a given school

### ```Get /schools/{id}/students```

Get all students for a given school

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
    "MONGODB_CONNECTION": "mongodb://username:password@server",
    "MONGODB_DATABASE": "minelev",
    "MONGODB_COLLECTION": "pifu",
    "JWT_SECRET": "This is a very funny secret..."
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
