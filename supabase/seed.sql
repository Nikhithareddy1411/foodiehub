-- Optional starter data for FoodieHub.
-- Run after schema.sql in the Supabase SQL Editor.
-- Stable UUIDs keep restaurant/menu relationships reproducible.

insert into public.restaurants (id, name, slug, cuisine, description, image_url, rating, delivery_minutes, price_level, featured)
values
('10000000-0000-4000-8000-000000000001','Saffron & Spice','saffron-spice','Indian · Comfort food','A little warmth, a lot of flavor. Freshly prepared Indian favorites.','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=85',4.9,'20–30 min','$$',true),
('10000000-0000-4000-8000-000000000002','Bella Napoli','bella-napoli','Italian · Pizza & pasta','Hand-stretched pizza, slow-simmered sauces, and good company.','https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=85',4.8,'25–35 min','$$',false),
('10000000-0000-4000-8000-000000000003','The Green Bowl','the-green-bowl','Healthy · Salads','Colorful bowls and feel-good ingredients made to order.','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85',4.7,'15–25 min','$$',false),
('10000000-0000-4000-8000-000000000004','Umami House','umami-house','Japanese · Asian','Thoughtful sushi, ramen, and Japanese-inspired small plates.','https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&q=85',4.8,'25–35 min','$$$',false)
on conflict (slug) do nothing;

insert into public.menu_items (id, restaurant_id, name, description, category, price, image_url, is_vegetarian, is_popular, available)
values
('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Butter Chicken','Tender chicken in a creamy tomato sauce with a hint of fenugreek.','Mains',17.50,'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&q=85',false,true,true),
('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','Paneer Tikka','Chargrilled cottage cheese, peppers, and house spices.','Vegetarian',15.00,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=700&q=85',true,false,true),
('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','Chicken Biryani','Fragrant basmati rice layered with spiced chicken and herbs.','Mains',18.00,'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=700&q=85',false,true,true),
('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000001','Garlic Naan','Soft tandoor-baked bread brushed with garlic butter.','Sides',4.50,'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=700&q=85',true,false,true),
('20000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000002','Margherita Pizza','San Marzano tomato, fresh mozzarella, basil, olive oil.','Pizza',16.00,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=85',true,true,true),
('20000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000002','Penne Arrabbiata','Penne pasta tossed in a spicy garlic and tomato sauce.','Pasta',15.50,'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700&q=85',true,false,true),
('20000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000003','Harvest Bowl','Quinoa, avocado, roasted sweet potato, greens, and tahini.','Bowls',14.00,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=85',true,true,true),
('20000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000004','Salmon Sushi Set','Fresh salmon nigiri and maki served with pickled ginger.','Sushi',21.00,'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&q=85',false,true,true)
on conflict (id) do nothing;
