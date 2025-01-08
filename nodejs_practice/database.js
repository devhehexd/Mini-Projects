const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test')
  .then(() => console.log('MongoDB connected'))
  .catch(err => (console.error(err)));

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Item = mongoose.model('Item', itemSchema);

async function run() {
  const newItem = new Item({ name: 'Apple', price: 1.5 });
  await newItem.save();

  console.log('Item saved: ', newItem);

  const items = await Item.find();
  console.log('All items: ', items);

  await Item.deleteMany();
  console.log('All items deleted');
}

run().catch(err => console.error(err));
