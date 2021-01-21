import React from 'react';
import quotes from '../quotes.json';

export const useQuote = () => {
  const [quote, setQuote] = React.useState(quotes[0]);

  React.useEffect(() => {
    setTimeout(() => {
      const index = quotes.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(quote),
      );

      setQuote(quotes[index === quotes.length - 1 ? 0 : index + 1]);
    }, 10000);
  }, [quote]);

  return quote;
};
