-- Insertar Categorías
INSERT INTO CATEGORIA (nombre, descripcion, es_activa) VALUES
('Tortas y Pasteles', 'Deliciosas tortas y pasteles para todas las ocasiones', true),
('Bolleria y Masas Dulces', 'Variedad de bolleria fresca y masas dulces', true),
('Panes Especiales', 'Panes artesanales y panes especiales', true),
('Galletas y Pequenos Dulces', 'Galletas, brownies y pequenos dulces', true);

-- Insertar Productos
INSERT INTO PRODUCTO (nombre, descripcion, precio, imagen_url, categoria, stock, es_activo) VALUES
('Torta de Tres Leches', 'Un bizcocho esponjoso banado en una mezcla de tres tipos de leche', 22990, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2FNGpdb9xllndHQkGvVVvkSWs_xoyY4Jmz1gRGQJdi0E-2qAAx71oEUusuBDJHMHly4axFJCYFQcbUOul2U5yoqnkePJy6yEVvUjOvigHNoQ_k2qfgsMDkbwjEaqqxrogLetbKJRA0EkO/s0/torta-tres-leches-menos-azucar.jpg', 'Tortas y Pasteles', 10, true),
('Pastel de Chocolate', 'Un clasico pastel hecho con chocolate o cacao en polvo', 24990, 'https://amoradulce.com/wp-content/uploads/2019/12/Torta-chocolate-1_04_13_2024-scaled.jpg', 'Tortas y Pasteles', 10, true),
('Cheesecake', 'Una tarta dulce con base de galleta y relleno cremoso de queso crema', 23990, 'https://peopleenespanol.com/thmb/HkV2jbNhxgWQi7d0wSMFwEcMQ1w=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/cheesecake-facil-con-leche-condensada-2000-4160526441114bf3ad8f3409586a2c8a.jpg', 'Tortas y Pasteles', 10, true),
('Kuchen de Manzana', 'Una tarta con base de masa y relleno de manzanas cocidas', 18990, 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Apple_cake_with_vanilla_ice_cream_2.jpg', 'Tortas y Pasteles', 10, true),
('Selva Negra', 'Una torta de capas de bizcocho de chocolate con cereyas', 26990, 'https://upload.wikimedia.org/wikipedia/commons/6/66/Black_Forest_gateau.jpg', 'Tortas y Pasteles', 10, true),
('Pie de Limon', 'Una tarta con base de masa y relleno cremoso de limon', 17990, 'https://www.recetasnestle.cl/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/49d627e69672b6915c22f2eb2dfd1b93.webp?itok=cJEPzpNP', 'Tortas y Pasteles', 10, true),
('Torta Pastelera', 'Torta rellena de crema pastelera y cubierta con nueces frescas', 8990, 'https://i5.walmartimages.cl/asr/a1afe955-13cc-4f6b-94b2-8e608ad77570.0cbab0a9265430beeaf5a5598a443337.jpeg?null=&odnHeight=612&odnWidth=612&odnBg=FFFFFF', 'Tortas y Pasteles', 10, true),
('Croissant', 'Un panecillo de masa de hojaldre leudada, ideal para el desayuno', 1990, 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Croissants_au_beurre_%2818953292873%29.jpg', 'Bolleria y Masas Dulces', 20, true),
('Napolitana', 'Una pieza de bolleria hecha con masa de croissant y relleno', 2290, 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Pain_au_chocolat_Luc_Viatour.jpg', 'Bolleria y Masas Dulces', 20, true),
('Donas', 'Una masa dulce frita, generalmente en forma de anillo o redonda', 1590, 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chocolate_donuts_2.jpg', 'Bolleria y Masas Dulces', 20, true),
('Roles de Canela', 'Un rollo de masa dulce relleno de canela y azucar', 2990, 'https://i0.wp.com/sarasellos.com/wp-content/uploads/2024/05/cinnamon-rolls-rollos-canela-3.jpg?resize=1024%2C1024&ssl=1', 'Bolleria y Masas Dulces', 20, true),
('Palmera', 'Una galleta o bollo de masa de hojaldre caramelizada', 1890, 'https://imag.bonviveur.com/palmeritas-de-hojaldre.webp', 'Bolleria y Masas Dulces', 20, true),
('Muffin', 'Un pequeno panecillo dulce similar a un queque o magdalena', 2190, 'https://www.vitamix.com/content/dam/vitamix/migration/media/recipe/rcppumpkinmuffins/images/pumpkinmuffinsmainjpg.jpg', 'Bolleria y Masas Dulces', 20, true),
('Pan de Masa Madre', 'Un pan hecho mediante fermentacion lenta', 4490, 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Home_made_sour_dough_bread.jpg', 'Panes Especiales', 15, true),
('Baguette', 'Una barra de pan larga y delgada, conocida por su corteza crujiente', 1590, 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/f9f9282c-f4ab-480f-a42d-4347d51dfee2/Derivates/ae113aa0-b9c5-463c-b1e5-316f0390fb74.jpg', 'Panes Especiales', 15, true),
('Brioche', 'Un pan dulce enriquecido con huevos y mantequilla', 3990, 'https://www.harinaselecta.cl/img/blog/tabla-de-madera-con-pan-brioche-dulce-blog-selecta.webp', 'Panes Especiales', 15, true),
('Focaccia', 'Un pan plano italiano cubierto con aceite de oliva y hierbas', 3490, 'https://www.conasi.eu/blog/wp-content/uploads/2022/02/como-hacer-focaccia-desdes-900x563.jpg', 'Panes Especiales', 15, true),
('Alfajores', 'Dos galletas suaves unidas por un relleno dulce', 1990, 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Alfajorartes.JPG', 'Galletas y Pequenos Dulces', 25, true),
('Galletas con Chispas de Chocolate', 'La clasica galleta mantecosa cargada de chispas de chocolate', 1690, 'https://mojo.generalmills.com/api/public/content/_pLFRXFETcuXWg_Z0MhZPw_webp_base.webp?v=1c273e93&t=191ddcab8d1c415fa10fa00a14351227', 'Galletas y Pequenos Dulces', 25, true),
('Macarons', 'Un delicado dulce frances hecho a base de clara de huevo y almendra', 1890, 'https://upload.wikimedia.org/wikipedia/commons/4/49/Des_macarons_de_chez_Bouillet_%28mars_2023%29.jpg', 'Galletas y Pequenos Dulces', 25, true),
('Brownies', 'Un pequeno pastel de chocolate denso y compacto', 2490, 'https://icecreambakery.in/wp-content/uploads/2024/12/Brownie-Recipe-with-Cocoa-Powder.jpg', 'Galletas y Pequenos Dulces', 25, true),
('Merenguitos', 'Pequenos dulces hechos de claras de huevo batidas con azucar', 2990, 'https://www.recetasnestle.com.pe/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/f411ec369da32e4b42ed184220d30a85.webp?itok=xH9iySeF', 'Galletas y Pequenos Dulces', 25, true);
