module.exports.getDate = function () {
  let today = new Date();
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  let currentDay = today.toLocaleDateString("en-US", options);
  return currentDay;
};

module.exports.getDay = function () {
  let today = new Date();
  let options = {
    weekday: "long",
  };

  let currentDay = today.toLocaleDateString("en-US", options);
  return currentDay;
};
console.log(module.exports);
