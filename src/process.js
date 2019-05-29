const _ = require("lodash")

const data = require("../output/merged/combined-income-comparisons-responses.json");

console.log("Number of unique responses: " + data.length);
console.log("---");

// Calculation functions
const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const payValues = data.map(d => {
  if (d.weeklyPay === "0") return 0;
  else return d.weeklyPay;
});
const payValuesFiltered = payValues.filter(d => {
  if (typeof d === "undefined") return false;
  if (d > 100000) return false;

  return true;
});

const averageWeeklyPay = average(payValuesFiltered);
const medianWeeklyPay = median(payValuesFiltered);

console.log("Average weekly pay entered is: " + averageWeeklyPay);
console.log("Median weekly pay entered is: " + medianWeeklyPay);

const guessValues = data
  .map(d => {
    if (d.bracketGuess === "0") return 0;
    else return d.bracketGuess;
  })
  .filter(d => {
    if (typeof d === "undefined") return false;
    return true;
  });

var counts = {};

for (var i = 0; i < guessValues.length; i++) {
  var num = guessValues[i];
  counts[num] = counts[num] ? counts[num] + 1 : 1;
}

console.log("---");
console.log("Average bracket guess was: " + average(guessValues));
console.log("Median bracket guess was: " + median(guessValues));

console.log("People guessing bracket 13: " + counts[13]);
console.log("People guessing bracket 12: " + counts[12]);
console.log("People guessing bracket 11: " + counts[11]);
console.log("People guessing bracket 10: " + counts[10]);
console.log("People guessing bracket 9: " + counts[9]);
console.log("People guessing bracket 8: " + counts[8]);
console.log("People guessing bracket 7: " + counts[7]);
console.log("People guessing bracket 6: " + counts[6]);
console.log("People guessing bracket 5: " + counts[5]);
console.log("People guessing bracket 4: " + counts[4]);
console.log("People guessing bracket 3: " + counts[3]);
console.log("People guessing bracket 2: " + counts[2]);
console.log("People guessing bracket 1: " + counts[1]);

const actuaBracketValues = data
  .map(d => {
    if (d.incomeBracket === "0") return 0;
    else return d.incomeBracket;
  })
  .filter(d => {
    if (typeof d === "undefined") return false;
    return true;
  });

counts = {};

for (var i = 0; i < actuaBracketValues.length; i++) {
  var num = actuaBracketValues[i];
  counts[num] = counts[num] ? counts[num] + 1 : 1;
}

console.log("---");
console.log("Average actual bracket was: " + average(actuaBracketValues));
console.log("Median actual bracket was: " + median(actuaBracketValues));

console.log("People's actual bracket 13: " + counts[13]);
console.log("People's actual bracket 12: " + counts[12]);
console.log("People's actual bracket 11: " + counts[11]);
console.log("People's actual bracket 10: " + counts[10]);
console.log("People's actual bracket 9: " + counts[9]);
console.log("People's actual bracket 8: " + counts[8]);
console.log("People's actual bracket 7: " + counts[7]);
console.log("People's actual bracket 6: " + counts[6]);
console.log("People's actual bracket 5: " + counts[5]);
console.log("People's actual bracket 4: " + counts[4]);
console.log("People's actual bracket 3: " + counts[3]);
console.log("People's actual bracket 2: " + counts[2]);
console.log("People's actual bracket 1: " + counts[1]);

// Let's find out how many are on mobile
const onMobile = data.filter(d => {
  if (d.isMobile === true) return true;
  return false;
});

const notOnMobile = data.filter(d => {
  if (d.isMobile === false) return true;
  return false;
});

console.log("---");
console.log("People on mobile: " + onMobile.length);
console.log("People not on mobile: " + notOnMobile.length);
console.log(
  `Percent on mobile: ${(onMobile.length / (onMobile.length + notOnMobile.length)) * 100}`
);
console.log("---");

// Work out where people are
const geoData = data
  .map(d => {
    return d.lgaDropdown;
  })
  .filter(d => {
    if (typeof d === "undefined") return false;
    return true;
  });

counts = {};

for (var i = 0; i < geoData.length; i++) {
  var num = geoData[i];
  counts[num] = counts[num] ? counts[num] + 1 : 1;
}


const countArray = Object.keys(counts).map(function(key,index) {
  return {
    lgaDropdown: key,
    count: counts[key]
  }
});


const sortedGeoData = _.sortBy(countArray, "count")

console.log("lgaDropdown,count")
sortedGeoData.reverse().forEach(lga => {
  console.log(lga.lgaDropdown + ",", lga.count)
}) 