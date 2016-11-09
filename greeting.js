const random = array => { return array[Math.floor(Math.random() * array.length)] };

const greetingMsg = () => {
  const answers = [
    "Hello! What do you need?",
    "Hi! How can I help you?",
    "Hey, what's up?",
  ]
  return random(answers)
};

module.exports = greetingMsg;