const random = array => { return array[Math.floor(Math.random() * array.length)] };

investorCount = function(result, investor_s) {
  const answers = [
    "I found " + result + " " + investor_s + ".",
    result + " " + investor_s + " found.",
    "Success! I found " + result + " " + investor_s + ".",
    "Voila! " + result + " " + investor_s + " found."
  ]
  return random(answers)
};

module.exports = investorCount;