<h1 align="center">autoindex-json</h1>

<div align="center">

![npm](https://img.shields.io/npm/v/autoindex-json)
![npm](https://img.shields.io/npm/l/autoindex-json)
![npm](https://img.shields.io/npm/dm/autoindex-json)

Serves directory listings for a given path in JSON format. Output adheres to the [NGINX json autoindex](http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex_format) format. If you would like to serve HTML files, take a look at [serve-index](https://github.com/expressjs/serve-index)
</div>

## Installation

Install it using `npm` or `yarn`

```
npm install autoindex-json
yarn add autoindex-json
```

## Usage

Use it in your node server app

```javascript
const express = require('express');
const autoindexJson = require('autoindex-json');

const DATA_DIR = '/path/to/your/data';
app.use('/files', express.static(DATA_DIR), autoindexJson(DATA_DIR));
app.listen(3000);
```

Then to get the JSON response,

```
GET http://localhost:3000/files?path=

[{"name":"bdd100k","type":"directory","mtime":"Tue, 02 Feb 2021 10:26:42 GMT"},
{"name":"cmu_seasons","type":"directory","mtime":"Fri, 17 Jul 2020 15:54:36 GMT"},
{"name":"cyrill_bonn","type":"directory","mtime":"Thu, 18 Apr 2019 10:18:44 GMT"},
{"name":"kitti","type":"directory","mtime":"Mon, 15 Feb 2021 11:54:58 GMT"},
{"name":"new_college","type":"directory","mtime":"Thu, 28 Jan 2021 02:11:52 GMT"},
{"name":"newer_college","type":"directory","mtime":"Sun, 31 Jan 2021 15:48:01 GMT"},
{"name":"oxford_robotcar","type":"directory","mtime":"Mon, 15 Jun 2020 13:22:01 GMT"}]


GET http://localhost:3000/files?path=new_college

[{"name":"README.md","type":"file","mtime":"Thu, 28 Jan 2021 02:07:03 GMT","size":2280},
{"name":"city_centre","type":"directory","mtime":"Thu, 28 Jan 2021 02:15:21 GMT"},
{"name":"new_college","type":"directory","mtime":"Thu, 28 Jan 2021 02:12:51 GMT"}]
```

This output conforms to [NGINX JSON autoindex](http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex_format) output standards

```
location / {
    autoindex on;
    autoindex_format json;
}
```

## Error Handling

If the given path is not found or accessible, then the response will be like

```
{"error":"File/Directory not found"}
{"error":"<Error Message>"}
```

## Parameters

### dir

*string* | Required

Path to directory to be served


#### options

*json* | optional

```javascript
{
    pathField: "path"  //string
}
```

Value of `pathField` is the key to look in the URL (i.e. request.url.\<pathField>) to take as the path relative to `dir`.

## Licence

Please see attached [LICENSE](LICENSE)
