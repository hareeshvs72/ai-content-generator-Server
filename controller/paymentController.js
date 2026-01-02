// controller/paymentController.js
const stripe = require("../Stripe/Stripe");

exports.createCheckoutSession = async (req, res) => {
    console.log("isndied create checkout");
    
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription", // or "payment"
      line_items: [
        {
          price: "price_1ScJV8FP9sjWd71VLQBbDVsJ", // your price ID
          quantity: 1,
        },
      ],
      success_url: "http://localhost:4200/payment-success",
      cancel_url: "http://localhost:4200/payment-cancel",
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
