<h1 align="center">autoindex-json</h1>

<div align="center">

![npm](https://img.shields.io/npm/v/autoindex-json)
![npm](https://img.shields.io/npm/l/autoindex-json)
![npm](https://img.shields.io/npm/dm/autoindex-json)

Serves directory listings for a given path in JSON format. Output adheres to the [NGINX json autoindex](http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex_format) format. Supports pagination. If you would like to serve HTML files instead, take a look at [serve-index](https://github.com/expressjs/serve-index)
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

const app = express();
const DATA_DIR = '/path/to/your/data';
app.use('/files', autoindexJson(DATA_DIR), express.static(DATA_DIR));
app.listen(3000);
```

Then to get the info JSON response, simply append `?info` to the required path in the request URL. For directories, autoindex_json will be served by default, hence, `?info` is optional. Here are some example requests and JSON responses:

```py
GET http://localhost:3000/files                     # or
GET http://localhost:3000/files?info
```

```json
[{"name":"bdd100k","type":"directory","mtime":"Tue, 02 Feb 2021 10:26:42 GMT"},
{"name":"cmu_seasons","type":"directory","mtime":"Fri, 17 Jul 2020 15:54:36 GMT"},
{"name":"cyrill_bonn","type":"directory","mtime":"Thu, 18 Apr 2019 10:18:44 GMT"},
{"name":"kitti","type":"directory","mtime":"Mon, 15 Feb 2021 11:54:58 GMT"},
{"name":"new_college","type":"directory","mtime":"Thu, 28 Jan 2021 02:11:52 GMT"},
{"name":"newer_college","type":"directory","mtime":"Sun, 31 Jan 2021 15:48:01 GMT"},
{"name":"oxford_robotcar","type":"directory","mtime":"Mon, 15 Jun 2020 13:22:01 GMT"}]
```
```py
GET http://localhost:3000/files/new_college         # or
GET http://localhost:3000/files/new_college?info
```
```json
[{"name":"README.md","type":"file","mtime":"Thu, 28 Jan 2021 02:07:03 GMT","size":2280},
{"name":"city_centre","type":"directory","mtime":"Thu, 28 Jan 2021 02:15:21 GMT"},
{"name":"new_college","type":"directory","mtime":"Thu, 28 Jan 2021 02:12:51 GMT"}]
```
```
GET http://localhost:3000/files/new_college/README.md?info
```
```json
{"name":"README.md","type":"file","mtime":"Thu, 28 Jan 2021 02:07:03 GMT","size":2280}
```
```
GET http://localhost:3000/files/new_college/README.md
```
```md
This is a *sample* README file content handled by express.static
```

This output conforms to [NGINX JSON autoindex](http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex_format) output standards

```
location / {
    autoindex on;
    autoindex_format json;
}
```

## Note

We suggest using `autoindexJson` before `express.static`. Otherwise, `someFile?info` will result in `express.static` serving the file before `autoindexJson` can handle it.

If you would only like to serve info JSON for directories, you shall swap the order and it would still work.

## Pagination

Autoindex_json supports query based dynamic pagination. Use the `limit` parameter to retrieve information regarding the number of files and number of pages corresponding to the limit. 

```
GET http://localhost:3000/files?limit=4
```
```json
{
    "files": 6,
    "pages": 2
}
```

Then simply query the required page using `page` parameter.

```
GET http://localhost:3000/files?limit=4&page=0
```
```json
[{"name":"bdd100k","type":"directory","mtime":"Tue, 02 Feb 2021 10:26:42 GMT"},
{"name":"cmu_seasons","type":"directory","mtime":"Fri, 17 Jul 2020 15:54:36 GMT"},
{"name":"cyrill_bonn","type":"directory","mtime":"Thu, 18 Apr 2019 10:18:44 GMT"},
{"name":"kitti","type":"directory","mtime":"Mon, 15 Feb 2021 11:54:58 GMT"},
{"name":"new_college","type":"directory","mtime":"Thu, 28 Jan 2021 02:11:52 GMT"},
]
```

```
GET http://localhost:3000/files?limit=4&page=1
```

```json
[{"name":"newer_college","type":"directory","mtime":"Sun, 31 Jan 2021 15:48:01 GMT"},
{"name":"oxford_robotcar","type":"directory","mtime":"Mon, 15 Jun 2020 13:22:01 GMT"}]
```

Note that the pages queried should be indexed from 0 and not 1! If the page limit is exceeded, an empty array is returned.

```
GET http://localhost:3000/files?limit=4&page=2
```
```json
[]
```

Note that the `info` parameter is implicit in the above examples. The following lines will yield the same response, as the statically served root is a directory.

```
GET http://localhost:3000/files?limit=4
GET http://localhost:3000/files?info&limit=4
```

## Error Handling

If the given path is not found or accessible, then the response will be 4xx with content

```
{"error":"File/Directory not found"}
{"error":"<Error Message>"}
```

The status code 4xx will get unavoidably logged in the browser console. So, if you want to avoid that, you can suppress settings setting the status alone and still get the same error JSON by setting `onErrorStatus4xx` option to false.


## Options

### dir

*string* | Required

Path to directory to be served


#### options

*json* | optional

```javascript
{
    onErrorStatus4xx: true,  // bool
}
```

If `onErrorStatus4xx` is true, status code is set to 4xx on error. Else, error messages will be delivered in JSON, but with a 2xx response status code.

## Licence

Please see attached [LICENSE](LICENSE)
