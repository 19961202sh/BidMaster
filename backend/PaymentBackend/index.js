import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get('/', (req, res) => {
    res.send('Payment system is running!');
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        console.log('Received request body:', req.body); // Log incoming request

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Auction Item',
                        },
                        unit_amount: 1000, // $10.00
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:5000/success', 
            cancel_url: 'http://localhost:5000/cancel',   
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('FULL Checkout session error:', error);
        res.status(500).json({ 
            error: 'Failed to create checkout session',
            details: error.message,
            stack: error.stack 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});