const faker = require('faker');

faker.locale = 'en';

module.exports = () => {
  const db = { products: [] };
  const size = 100;

  for (let index = 1; index <= size; index++) {
    const product = {
      id: `${index}`,
      name: faker.commerce.productName(),
      brand: faker.company.companyName(),
      category: faker.commerce.department(),
      price: faker.commerce.price(),
      summary: faker.random.words(),
      stocked: faker.random.boolean(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      image: faker.image.image(),
      made_by: faker.address.county(),
      color: faker.commerce.color(),
    };

    db.products.push(product);
  }

  return db;
};
