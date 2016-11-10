const random = array => { return array[Math.floor(Math.random() * array.length)] };

const investorSearch = () => {
  const answers = [
    "What are you looking for? (e.g. B2B/B2C investors, country)",
    "What are you looking for? (e.g. industry sector, funding stage)",
    "What are you looking for? (e.g. B2B/B2C investors, funding stage)",
    "What are you looking for? (e.g. industry sector, country)"
  ]
  return random(answers)
};

module.exports = investorSearch;