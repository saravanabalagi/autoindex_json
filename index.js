const path = require('path');
const { statSync } = require('fs');
const { readdir } = require('fs').promises;

// default settings
const defaultOptions = {
  onErrorStatus4xx: true
}

const autoindexJson = (dir, options) => async function(req, res, next) {

  // set defaults and validate
  res.setHeader('Content-Type', 'application/json');
  if (options == null) options = defaultOptions;
  else for(let option in defaultOptions)
    if (!options.hasOwnProperty(option))
      options[option] = defaultOptions[option];

  // once validation is passed
  const url = path.join(dir, req.path);
  let fstats;
  try { fstats = statSync(url); }
  catch(e) {
    if (e.code === 'ENOENT') {
      if(options.onErrorStatus4xx) res.status(404);
      if (req.query['exists'] != null) res.send(JSON.stringify({ exists: false }));
      else res.send(JSON.stringify({error: 'File/Directory not found'}));
      return;
    }
    if(options.onErrorStatus4xx) res.status(400);
    res.send(JSON.stringify({error: e.message}));
    return;
  }

  // is it is an exists query
  if (req.query['exists'] != null) {
    res.send({exists: true});
    return;
  } 

  // if url is a file
  if (fstats.isFile()) {
    if (req.query['info'] == null) next();
    else res.send(getStats(fstats, url));
    return;
  }

  // if url is a directory
  let files = await readdir(url);

  // pagination
  const limit = parseInt(req.query['limit'] || -1);
  const page = parseInt(req.query['page'] || -1);
  if (limit > 0 && files.length > limit ) {
    
    // if page number not specified, show stats
    if (page < 0) {
      const info = {
        files: files.length,
        pages: Math.ceil(files.length / limit)
      }
      res.send(info);
      return;
    }

    // else if page number is specified
    const startIdx = page * limit;
    files = files.slice(startIdx, startIdx + limit);
  }

  // fill in stats to send the response
  stats = [];
  for (const file of files) {
    const filepath = path.join(url, file);
    const fstats = statSync(filepath);
    stats.push(getStats(fstats, filepath));
  }

  // send the json response
  res.send(stats);
  return;
}

const getStats = (fstats, filepath) => {

  // determine filetype
  // type: string, should be one of file/directory/others
  let ftype = 'others';
  if (fstats.isDirectory()) ftype = 'directory';
  else if (fstats.isFile()) ftype = 'file';

  const fstatsRequired = {
      name: path.basename(filepath),
      type: ftype,

      // date: string, should be RFC1123-date of HTTP-date defined by RFC2616
      mtime: new Date(fstats.mtime).toUTCString()
  }

  // size: int, should only appear for files
  if (ftype === 'file') fstatsRequired.size = fstats.size;
  return fstatsRequired;
}

module.exports = autoindexJson;
