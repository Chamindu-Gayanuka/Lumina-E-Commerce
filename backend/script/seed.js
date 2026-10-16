import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connect from '../src/config/db.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
import Order from '../src/models/Order.js';
import Review from '../src/models/Review.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CUSTOMER_EMAIL = 'chamindugayanuka@gmail.com';
const SELLER_EMAIL = 'dangerwarrior2002@gmail.com';
const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
const image = name => `https://res.cloudinary.com/m1b97faq/image/upload/${name}`;

const customerAddress = {
    label: 'Home',
    fullName: 'Chamindu Gayanuka',
    phone: '0762944551',
    address: 'No. 123, Kiula Place, Upper Street, Padiyathalawa',
    city: 'Padiyathalawa',
    district: 'Ampara',
    postalCode: '32100',
    isDefault: true
};
const products = [
    ['Aura Pro Wireless', 'Premium noise cancelling wireless headphones.', 24900, 'Electronics', 25, 'product-aura-pro-wireless.png', [['Battery', '40 hours'], ['Connectivity', 'Bluetooth 5.3']]],
    ['Studio Wireless Mic', 'Compact wireless microphone for creators.', 18900, 'Electronics', 18, 'product-studio-wireless-mic.png', [['Range', '50 m'], ['Battery', '8 hours']]],
    ['Smart Fitness Watch', 'Track activity, heart rate and workouts.', 12900, 'Electronics', 18, 'product-watch.jpg', [['Display', 'AMOLED'], ['Water resistance', '5 ATM']]],
    ['Ceylon Cotton Tee', 'Soft and breathable cotton T-shirt.', 4500, 'Fashion', 40, 'product-cotton-tee.png', [['Material', '100% cotton'], ['Fit', 'Regular']]],
    ['Denim Jacket', 'Classic everyday denim jacket.', 8900, 'Fashion', 22, 'product-denim-jacket.png', [['Material', 'Denim'], ['Sizes', 'S to XL']]],
    ['Rattan Pendant Light', 'Handwoven pendant light for warm interiors.', 15500, 'Home', 16, 'product-rattan-pendant-light.png', [['Material', 'Rattan'], ['Bulb', 'E27']]],
    ['Modern Table Lamp', 'Warm ambient lamp for home and office.', 7200, 'Home', 30, 'product-lamp.jpg', [['Power', '40 W'], ['Colour', 'Warm white']]],
    ['Scented Soy Candle Trio', 'Hand-poured soy candles with calming scents.', 3800, 'Home', 35, 'product-scented-soy-candle-trio.png', [['Wax', 'Soy'], ['Pieces', '3']]],
    ['Vit C Glow Serum', 'Brightening vitamin C facial serum.', 5200, 'Beauty', 28, 'product-vitc-serum.png', [['Volume', '30 ml'], ['Skin type', 'All skin types']]],
    ['Cloud Plush Bear', 'Soft plush bear for children.', 3500, 'Toys', 24, 'product-cloud-plush-bear.png', [['Material', 'Plush'], ['Age', '3+']]],
    ['Educational Building Blocks', 'Colourful blocks for creative learning.', 2900, 'Toys', 22, 'product-builing-blocks.png', [['Pieces', '80'], ['Age', '4+']]],
    ['Premium Ceylon Tea', 'Aromatic Ceylon black tea from Sri Lanka.', 1500, 'Groceries', 60, 'product-ceylon-tea.png', [['Weight', '250 g'], ['Origin', 'Sri Lanka']]],
    ['Organic Wildflower Honey', 'Pure organic wildflower honey.', 2400, 'Groceries', 45, 'product-organic-wildflower-honey.png', [['Weight', '350 g'], ['Organic', 'Yes']]],
    ['Leather Everyday Bag', 'Minimal leather bag for daily use.', 11900, 'Fashion', 20, 'product-bag.jpg', [['Material', 'Faux leather'], ['Capacity', '12 L']]]
].map(([name, description, price, category, stock, file, specifications]) => ({
    name,
    description,
    price,
    category,
    stock,
    lowStockLevel: 5,
    image: image(file),
    images: [image(file)],
    specifications,
    featured: true,
    status: 'Active'
}));

try {
    await connect();
    let admin = await User.findOne({email: ADMIN_EMAIL});
    const customer = await User.findOne({email: CUSTOMER_EMAIL, role: 'Customer'});
    const seller = await User.findOne({email: SELLER_EMAIL, role: 'Seller'});
    if (!customer || !seller) throw new Error('Customer and seller accounts must already exist. Seed does not create additional users.');
    if (admin && admin.role !== 'Administrator') throw new Error(`ADMIN_EMAIL belongs to a non-administrator account: ${ADMIN_EMAIL}`);
    admin = await User.findOneAndUpdate({email: ADMIN_EMAIL}, {
        $set: {
            name: 'Lumina Admin',
            email: ADMIN_EMAIL,
            password,
            role: 'Administrator',
            status: 'Active',
            emailVerified: true
        }
    }, {upsert: true, new: true, setDefaultsOnInsert: true});
    await User.updateOne({_id: customer._id}, {
        $set: {
            name: 'Chamindu Gayanuka',
            emailVerified: true,
            addresses: [customerAddress]
        }
    });
    await User.updateOne({_id: seller._id}, {
        $set: {
            name: 'Danger Warrior',
            storeName: 'DW Store',
            phone: '0782096804',
            businessAddress: 'Ampara, Sri Lanka',
            description: 'Small Business',
            role: 'Seller',
            status: 'Active',
            approvalStatus: 'Approved',
            emailVerified: true
        }
    });
    for (const name of ['Electronics', 'Fashion', 'Home', 'Beauty', 'Toys', 'Groceries']) await Category.updateOne({name}, {
        $setOnInsert: {
            name,
            status: 'Active'
        }
    }, {upsert: true});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    const created = [];
    for (const data of products) created.push(await Product.create({
        ...data,
        sellerId: seller._id,
        sellerName: 'DW Store'
    }));
    const byName = name => {
        const p = created.find(x => x.name === name);
        if (!p) throw new Error(`Missing product ${name}`);
        return p;
    };
    const item = (name, qty) => {
        const p = byName(name);
        return {
            productId: p._id,
            name: p.name,
            price: p.price,
            qty,
            quantity: qty,
            image: p.image,
            sellerId: seller._id,
            seedData: true
        };
    };
    const makeOrder = async (items, status, paymentStatus, daysAgo = 0) => {
        const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
        const order = await Order.create({
            customerId: customer._id,
            items,
            deliveryAddress: customerAddress,
            subtotal,
            deliveryFee: subtotal >= 5000 ? 0 : 450,
            totalAmount: subtotal + (subtotal >= 5000 ? 0 : 450),
            paymentMethod: 'COD',
            paymentStatus,
            status
        });
        if (daysAgo) await Order.updateOne({_id: order._id}, {
            $set: {
                createdAt: new Date(Date.now() - daysAgo * 86400000),
                updatedAt: new Date(Date.now() - daysAgo * 86400000)
            }
        });
        return order;
    };
    await makeOrder([item('Aura Pro Wireless', 1), item('Ceylon Cotton Tee', 1)], 'Pending', 'Pending', 2);
    await makeOrder([item('Studio Wireless Mic', 1), item('Premium Ceylon Tea', 2)], 'Processing', 'Pending', 8);
    const delivered = await makeOrder([item('Smart Fitness Watch', 1), item('Leather Everyday Bag', 1)], 'Delivered', 'Paid', 20);
    await Review.create({
        productId: byName('Smart Fitness Watch')._id,
        userId: customer._id,
        rating: 4,
        comment: 'Excellent product and similar to the images.'
    });
    await Review.create({
        productId: byName('Leather Everyday Bag')._id,
        userId: customer._id,
        rating: 5,
        comment: 'Good quality and fast delivery.'
    });
    for (const p of [byName('Smart Fitness Watch'), byName('Leather Everyday Bag')]) await Product.updateOne({_id: p._id}, {
        $set: {
            rating: p.name.includes('Watch') ? 4 : 5,
            reviewCount: 1,
            soldCount: 1
        }
    });
    console.log('Seed complete');
    console.log({
        admin: admin._id,
        customer: customer._id,
        seller: seller._id,
        products: created.length,
        deliveredOrder: delivered._id
    });
} catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
} finally {
    await (await import('mongoose')).default.disconnect();
}
