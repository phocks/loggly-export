// Analyse logs
const fs = require("fs");
const dayjs = require("dayjs");
const _ = require("lodash");

let dirs = require("require-all")({
  dirname: __dirname + "/../output/01",
  recursive: true
});
console.log("Loaded log files...");

let allEvents = [];

// Loop over keys and push events to var
for (let key in dirs) {
  const currentFile = dirs[key];

  // Exclude some files for testing purposes
  if (currentFile.total_events === 0) continue;
  if (currentFile.total_events === undefined) continue;
  // if (currentFile.total_events > 30) continue;

  console.log("Found events: " + currentFile.total_events);

  allEvents.push(...currentFile.events);
}
console.log(`Found ${allEvents.length} total events...`);

const abcIds = allEvents.map(event => event.event.json.ABCGuestId);
const uniqAbcIds = (uniq = [...new Set(abcIds)]);
console.log(`Found ${uniqAbcIds.length} unique ABC Ids`);

const newEvents = allEvents.map(event => {
  const date = dayjs(event.timestamp);

  const universalObject = {
    timestamp: event.timestamp,
    date: date.format(),
    ABCGuestId: event.event.json.ABCGuestId,
    clientHost: event.event.http.clientHost,
    country: event.event.json.ABC_LD.country,
    state: event.event.json.ABC_LD.state,
    id: event.id,
    [event.event.json.logString]: event.event.json.trackEvent_obj.action,
    userAgent: event.event.json.userAgent,
    isMobile: event.event.json.trackEvent_obj.isMobile
  };

  if (event.event.json.logString === "lgaDropdown")
    universalObject.lgaCode = event.event.json.trackEvent_obj.value;

  return universalObject;
});
console.log(`Data extracted from ${newEvents.length} events...`);

const combinedPlays = uniqAbcIds.map(user => {
  const filtered = newEvents.filter(event => event.ABCGuestId === user);
  const merged = _.defaults({}, ...filtered);
  return merged;
});
console.log(`Merged data into ${combinedPlays.length} unique ABC Ids...`);

// Write the data
fs.writeFileSync("output/data.json", JSON.stringify(combinedPlays));
console.log(`Data file written...`);
