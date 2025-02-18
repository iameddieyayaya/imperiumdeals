// async function getPricesForProduct(productName: string) {
//   const productRepository = getRepository(Product);

//   const products = await productRepository.find({
//     where: [
//       { name: productName, source: 'WargamePortal' },
//       { name: productName, source: 'GamesWorkshop' },
//     ],
//   });

//   return products;
// }

// // Usage example
// // const prices = await getPricesForProduct('Canoness with Jump Pack');
// console.log(prices);