const random = array => { return array[Math.floor(Math.random() * array.length)] };

const thanksMsg = () => {
  const answers = [
    "Thanks!",
    "Thank you! :)",
    "Aww, that's nice of you.",
    "Thanks! That means a lot.",
    "Thanks! Happy to help."
  ]
  return random(answers)
};

module.exports = thanksMsg;