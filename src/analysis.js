// Analyse logs
const fs = require("fs");

let files = require("require-all")(__dirname + "/../output/01");

let allEvents = [];

// Loop over keys and push events to var
for (let key in files) {
  const currentFile = files[key];

  // Exclude some files for testing purposes
  if (currentFile.total_events === 0) continue;
  // if (currentFile.total_events > 30) continue;

  console.log("Found events: " + currentFile.total_events);

  allEvents = [...allEvents, ...currentFile.events];
}

const newEvents = allEvents.map(event => {
  const universalObject = {
    timestamp: event.timestamp,
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

console.log(newEvents);

fs.writeFileSync("data.json", JSON.stringify(newEvents));

const testEvent = {
  raw:
    '{"ABCGuestId":"23.62.157.42.226211553581157943","ABC_LD":{"country":"AU","state":"Qld"},"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0","host":"www.abc.net.au","logString":"incomeBracket","trackEvent_obj":{"category":"incomeBracket","action":6,"label":"storyLabIncome","value":6,"isMobile":false,"pathname":"/news/2019-05-21/income-scale-australia/9301378"}}',
  logtypes: ["json"],
  timestamp: 1558378961084,
  unparsed: null,
  logmsg:
    '{"ABCGuestId":"23.62.157.42.226211553581157943","ABC_LD":{"country":"AU","state":"Qld"},"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0","host":"www.abc.net.au","logString":"incomeBracket","trackEvent_obj":{"category":"incomeBracket","action":6,"label":"storyLabIncome","value":6,"isMobile":false,"pathname":"/news/2019-05-21/income-scale-australia/9301378"}}',
  id: "d7838fd3-7b31-11e9-801a-0234fe2ede76",
  tags: ["trackEvent"],
  event: {
    json: {
      logString: "incomeBracket",
      ABC_LD: { country: "AU", state: "Qld" },
      host: "www.abc.net.au",
      ABCGuestId: "23.62.157.42.226211553581157943",
      trackEvent_obj: {
        category: "incomeBracket",
        value: 6,
        label: "storyLabIncome",
        pathname: "/news/2019-05-21/income-scale-australia/9301378",
        action: 6,
        isMobile: false
      },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0"
    },
    http: { clientHost: "58.6.208.170" }
  }
};
