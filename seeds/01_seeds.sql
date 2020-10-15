INSERT INTO users (name, email, password) VALUES ('Helmer Rodriguez', 'hrod@nbc.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('elmer Rodriguez', 'rod@nbc.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('mer Rod', 'hr@nbc.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES (1, 'Bath house', 'fine', 'google.jpeg', 'yahoo.jpeg', 300, 2, 7, 1, 'Nigeria', 'Rainbow Road', 'Lagos', 'what', '99999', true),
(1, 'nice house', 'ok', 'google.jpeg', 'yahoo.jpeg', 500, 3, 7, 1, 'canada', 'blest', 'North bay', 'PEI', '90210', false),
(3, 'okay house','there are worse places', 'google.jpeg', 'yahoo.jpeg', 100, 1, 1, 2, 'canada', 'north street', 'toronto', 'ontario', '90211', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES ('2019-01-01', '2019-01-09', 3, 2),
('2019-06-01', '2019-06-19', 1, 2),
('2019-09-10', '2019-10-09', 3, 1);

INSERT INTO property_reviews (property_id, guest_id, reservation_id, rating, message) VALUES (1, 2, 2, 5, 'message'),
(3, 2, 1, 4, 'message'),
(3, 1, 3, 2, 'message');