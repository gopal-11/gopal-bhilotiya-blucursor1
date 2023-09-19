const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

const fetchData = async () => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

app.get('/items', async (req, res) => {
  const data = await fetchData();
  res.json(data);
});

app.get('/items/filter', async (req, res) => {
  const { minRating, maxPrice } = req.query;
  console.log(minRating, maxPrice);
  const data = await fetchData();
  console.log(data);
  const filteredItems = await data.filter(
    (item) =>
      item.rating.rate >= Number(minRating) && item.price <= Number(maxPrice)
  );
  console.log(filteredItems);
  res.json(filteredItems);
});

app.get('/items/group', async (req, res) => {
  const data = await fetchData();

  const groupedItems = data.reduce((result, item) => {
    if (!result[item.category]) {
      result[item.category] = [];
    }
    result[item.category].push(item);
    return result;
  }, {});

  res.json(groupedItems);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
