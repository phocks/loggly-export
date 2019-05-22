require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const dayjs = require("dayjs");

// const START_TIME = "2019-05-20T19:00:00.000+10:00"; // WHEN ARTICLE WENT LIVE
const START_TIME = "2019-05-20T20:00:00.000+10:00";
let initialTime = dayjs(START_TIME);

const timeArray = Array(60);

// Accepts a dayjs time
const processMinute = async minuteFrom => {
  try {
    // Send request for search ID
    const searchResponse = await axios.get("http://abcnews.loggly.com/apiv2/search", {
      auth: { username: "News", password: process.env.LOGGLY_PASSWORD },
      params: {
        q: "storyLabIncome",
        size: 100,
        from: minuteFrom.format(),
        until: minuteFrom.add(1, "minute").format()
      }
    });
    console.log("Search ID received");

    // Store search ID for later request
    const rsid = searchResponse.data.rsid.id;

    // Now get actual events
    const eventsResponse = await axios.get("http://abcnews.loggly.com/apiv2/events", {
      auth: { username: "News", password: process.env.LOGGLY_PASSWORD },
      params: {
        rsid: rsid
      }
    });
    console.log("Search data received");

    // Convert to a JSON string
    const output = JSON.stringify(eventsResponse.data);

    fs.writeFileSync("output/" + minuteFrom.format() + ".json", output);
    console.log("File written: " + minuteFrom.format());
    return true;
  } catch (error) {
    console.error(error);
  }
};

let nextTime = initialTime;

const main = async () => {
  for (const item of timeArray) {
    await processMinute(nextTime);
    await sleep(5000);
    nextTime = nextTime.add(1, "minute");
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
