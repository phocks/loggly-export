require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const dayjs = require("dayjs");

const START_TIME = "2019-05-20T19:02:00.000+10:00";

let fromTime = dayjs(START_TIME);
let toTime = fromTime.add(1, "minute");

console.log(fromTime.format(), toTime.format());

const main = async () => {
  try {
    // Send request for search ID
    const searchResponse = await axios.get("http://abcnews.loggly.com/apiv2/search", {
      auth: { username: "News", password: process.env.LOGGLY_PASSWORD },
      params: {
        q: "storyLabIncome",
        size: 100,
        from: fromTime.format(),
        until: toTime.format()
      }
    });

    // Store search ID for later request
    const rsid = searchResponse.data.rsid.id;

    // Now get actual events
    const eventsResponse = await axios.get("http://abcnews.loggly.com/apiv2/events", {
      auth: { username: "News", password: process.env.LOGGLY_PASSWORD },
      params: {
        rsid: rsid
      }
    });

    // Convert to a JSON string
    const output = JSON.stringify(eventsResponse.data);

    fs.writeFileSync("data.json", output);
  } catch (error) {
    console.error(error);
  }
};

main();
