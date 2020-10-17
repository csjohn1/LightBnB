const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  
  const queryString = `
  SELECT * FROM users
  WHERE email LIKE $1;
  `;

  const values = [`%${email}%`];

  return pool.query(queryString, values)
  .then(res => res.rows[0]);
  
  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT * FROM users
  WHERE id LIKE $1;
  `;

  const values = [`%${id}%`];

  return pool.query(queryString, values)
  .then(res => {
    res.rows[0];
  });
  



  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  const queryString = `
  INSERT INTO users (
    name, email, password) 
    VALUES (
    $1, $2, $3)
    RETURNING *;
  `;

  const values = [`${user.name}`, `${user.email}`, `${user.password}`];

  return pool.query(queryString, values)
  .then(res => res.rows[0]);



  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  
  const queryString = `
SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id 
WHERE reservations.guest_id = $1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT $2;
  `;

  const values = [`${guest_id}`, limit];

  return pool.query(queryString, values)
  .then(res => res.rows);
  
  
  //return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  // for values array
  const queryParams = [];
  // for query
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  // if city entered in search
  if(options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`
  }
  // if owner_id entered in search
  if(options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    const length = queryParams.length;
    queryString += `${length === 0 ? 'WHERE': ' AND'} owner_id = $${length}`;
  }
  // if minimum and maximum cost is working
  if(options.minimum_price_per_night) {
    const min = options.minimum_price_per_night * 100;
    queryParams.push(`${min}`);
    if(options.maximum_price_per_night) {
      const max = options.maximum_price_per_night * 100;
      queryParams.push(`${max}`);
      const length = queryParams.length;
      queryString += `${length === 1 ? 'WHERE': ' AND'} cost_per_night BETWEEN $${length - 1 } AND $${length}`;
    } else {
      const length = queryParams.length;
      queryString += `${length === 0 ? 'WHERE': ' AND'} cost_per_night >= $${length}`;
    }
  } else if(options.maximum_price_per_night) {
    const max = options.maximum_price_per_night * 100;
    queryParams.push(`${max}`);
    const length = queryParams.length;
    queryString += `${length === 0 ? 'WHERE': ' AND'} cost_per_night <= $${length}`;
  }
  // intermediate queryString before checking average ratings
  queryString += `
  GROUP BY properties.id
  `;
  // if minimum rating is entered
  if(options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    const length = queryParams.length;
    queryString += `HAVING avg(property_reviews.rating) >= $${length}`;
  }
  // ending the queryString
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  // testing
  //console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then(response => response.rows)
  .catch(error => error.stack);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {


  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms) 
    VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const values = [`${property.owner_id}`, `${property.title}`, `${property.description}`, `${property.thumbnail_photo_url}`, `${property.cover_photo_url}`, `${property.cost_per_night}`, `${property.street}`, `${property.city}`, `${property.province}`, `${property.post_code}`, `${property.country}`, `${property.parking_spaces}`, `${property.number_of_bathrooms}`, `${property.number_of_bedrooms}`, ];

  return pool.query(queryString, values)
  .then(res => console.log(res.rows[0]));







  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
