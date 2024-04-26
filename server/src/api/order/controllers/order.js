// @ts-nocheck

// @ts-ignore
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
/**
 * order controller
 */

"use strict";

// Import necessary modules
const { Client } = require('square');
const { randomUUID } = require('crypto');
const { createCoreController } = require("@strapi/strapi").factories;

// Create a Square client instance
const { paymentsApi } = new Client({
accessToken: process.env.SQUARE_ACCESS_TOKEN,
environment: "sandbox",
});

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, userName } = ctx.request.body;
    try {
        // Retrieve item information
        const lineItems = products.map((product) => {
            // Assuming you have product data stored in your database
            const item = strapi
                .query("item")
                .findOne({ id: product.id }, ["name", "price"]);

            return {
                name: item.name,
                quantity: product.count,
                base_price_money: {
                    amount: item.price * 100, // Square expects amount in cents
                    currency: "USD",
                },
            };
        });

        // Create a payment using Square API
        const { error: paymentError } = await paymentsApi.createPayment({
            idempotencyKey: randomUUID(),
            sourceId: ctx.request.body.sourceId,
            amountMoney: {
                currency: 'USD',
                amount: 100 // Update this amount as per your requirement
            },
        });

        if (paymentError) {
            throw new Error(paymentError);
        }

        // Create an order using Square API
        const { result: orderResult, error: orderError } = await squareClient.ordersApi.createOrder({
            order: {
                locationId: process.env.SQUARE_LOCATION_ID, // Add your Square location ID here
                lineItems: lineItems,
            },
        });

        if (orderError) {
            throw new Error(orderError);
        }

        // Assuming you have a route for checkout success
        const successUrl = "http://localhost:3000/checkout/success";

        // Create the order record in your database
        await strapi.query("order").create({
            userName,
            products,
            squareOrderId: orderResult.order.id,
        });

        // Return the order ID and success URL
        return { id: orderResult.order.id, success_url: successUrl };
    } catch (error) {
        ctx.response.status = 500;
        return { error: { message: "There was a problem creating the order" } };
    }
},

}));
