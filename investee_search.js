const random = array => { return array[Math.floor(Math.random() * array.length)] };

const investeeSearch = () => {
  const answers = [
    "What are you looking for? (e.g. industry sector, year of incorporation)",
    "What are you looking for? (e.g. B2B/B2C companies, year of incorporation)",
    "What are you looking for? (e.g. industry sector, funding stage)",
    "What are you looking for? (e.g. B2B/B2C companies, funding stage)",
    "What are you looking for? (e.g. funding stage, year of incorporation)"
  ]
  return random(answers)
};

module.exports = investeeSearch;