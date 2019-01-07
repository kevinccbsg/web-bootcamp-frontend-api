
const storage = () => {
  const data = [];
  return {
    getQuote: (id) => data.filter(obj => obj.id === id),
    saveQuote: (id, quote) => {
      const newQuote = { id, ...quote };
      data.push(newQuote);
      return newQuote;
    },
  };
};

module.exports = storage;
