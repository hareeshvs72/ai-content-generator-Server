const stripe = require("../Stripe/Stripe");
const PLANS = require("../config/plans");

exports.createSubscription = async (req, res) => {
    console.log("inside createSubscription");
    
  try {
    const { plan, userId } = req.body;

    const priceId = PLANS[plan];

    if (!priceId) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

  const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  payment_method_types: ["card"],
  line_items: [
    {
      price: priceId,
      quantity: 1,
    },
  ],
  success_url: "http://localhost:4200/payment-success",
  cancel_url: "http://localhost:4200/payment-cancel",
  metadata: {
    userId,
    plan
  }
});

res.status(200).json({ url: session.url , id: session.id  });

    

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};