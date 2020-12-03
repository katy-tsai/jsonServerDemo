const Path = require('path');
const glob = require('glob');
const apiFiles = glob.sync(Path.resolve(__dirname, "./data") + "/*.js", {
    nodir: true
});

let data = {};

apiFiles.forEach(filePath => {
    const api = require(filePath);
    let [, url] = filePath.split("data/");
    url = url.slice(0, url.length - 3);
    data[url] = api;
});


module.exports = () => ({ ...data });