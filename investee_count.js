const random = array => { return array[Math.floor(Math.random() * array.length)] };

investeeCount = function(result, company_s) {
  const answers = [
    "I found " + result + " " + company_s + ".",
    result + " " + company_s + " found.",
    "Success! I found " + result + " " + company_s + ".",
    "Voila! " + result + " " + company_s + " found."
  ]
  return random(answers)
};

module.exports = investeeCount;