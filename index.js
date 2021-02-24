const path = require('path');
const { statSync } = require('fs');
const { readdir } = require('fs').promises;

// default settings
const defaultOptions = {
  pathField: 'path'
}

const autoindexJson = (dir, options) => async function(req, res, next) {

  // set defaults and validate
  res.setHeader('Content-Type', 'application/json');
  if (options == null) options = defaultOptions;
  if (req.query[options.pathField] == null) {
    res.status(400);
    res.send(JSON.stringify({error: `${options.pathField} is empty`}));
    return;
  }

  // once validation is passed
  const url = path.join(dir, req.query[options.pathField]);
  let fstats;
  try { fstats = statSync(url); }
  catch(e) {
    if (e.code === 'ENOENT') {
      res.status(404);
      res.send(JSON.stringify({error: 'File/Directory not found'}));
      return;
    }
    res.status(400);
    res.send(JSON.stringify({error: e.message}));
    return;
  }

  // if url is a file
  if (fstats.isFile()) {
    res.send(getStats(fstats, url));
    return;
  }

  // if url is a directory
  const files = await readdir(url);
  stats = [];
  for (const file of files) {
    const filepath = path.join(url, file);
    const fstats = statSync(filepath);
    stats.push(getStats(fstats, filepath));
  }

  // send the json response
  res.send(stats);
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
