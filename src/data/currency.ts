//currency function for myanmar
// export const currencyFormatter = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "MMK",
// });
// export const formatCurrency = (amount: number) => {
//   return amount.toLocaleString('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   });
// };

//format currency for myanmar
export const formatCurrencyMMK = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "MMK",
  });
};
