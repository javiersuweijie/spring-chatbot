const random = array => { return array[Math.floor(Math.random() * array.length)] };

const welcomeMsg = () => {
  const answers = [
    "You're welcome. Glad to help!",
    "No problem. Glad to help!",
    "You're welcome!",
    "My pleasure.",
    "Happy to help :)",
  ]
  return random(answers)
};

module.exports = welcomeMsg;