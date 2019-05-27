// Analyse logs
const fs = require("fs");
const dayjs = require("dayjs");
const _ = require("lodash");

const _cliProgress = require('cli-progress');
// create a new progress bar instance and use shades_classic theme
const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

let dirs = require("require-all")({
  dirname: __dirname + "/../output/merged/json",
  recursive: true
});
console.log("Loaded log files...");

let all = [];

// Loop over keys and push events to var
for (let key in dirs) {
  const currentFile = dirs[key];

  all.push(...currentFile);
}
console.log(`Found ${all.length} total events...`);

const abcIds = all.map(event => event.ABCGuestId);
const uniqAbcIds = (uniq = [...new Set(abcIds)]);
console.log(`Found ${uniqAbcIds.length} unique ABC Ids`);

console.log("Now merging data...")
progressBar.start(uniqAbcIds.length, 0);

const combinedPlays = uniqAbcIds.map((user, index) => {
  const filtered = all.filter(event => event.ABCGuestId === user);
  const merged = _.defaults({}, ...filtered);
  progressBar.update(index + 1);
  return merged;
});
progressBar.stop();

console.log(`Merged data into ${combinedPlays.length} unique ABC Ids...`);

// // Write the data
fs.writeFileSync("output/data.json", JSON.stringify(combinedPlays));
console.log(`Data file written...`);
