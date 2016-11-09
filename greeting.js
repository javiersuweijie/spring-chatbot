const random = array => { return array[Math.floor(Math.random() * array.length)] };

const greetingMsg = () => {
  const answers = [
    "Bye!",
    "See you soon!",
    "See you!",
    "Ciao! Talk again soon.",
    "Goodbye!"
  ]
  return random(answers)
};

module.exports = greetingMsg;