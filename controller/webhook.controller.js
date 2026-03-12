const stripe = require("../Stripe/Stripe");
const User = require("../Model/userModel");
require("dotenv").config()
exports.handleWebhook = async (req, res) => {
  console.log("inside webhook");
  
  const sig = req.headers["stripe-signature"];
// console.log(sig);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
    
    
  }
 console.log(event.type);
 
  if (event.type === "checkout.session.completed") {
  
    const session = event.data.object;
console.log("Session:", session);
console.log("Metadata:", session.metadata);
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    await User.findByIdAndUpdate(userId, {
      plan: plan,
      stripeCustomerId: session.customer,
      subscriptionId: session.subscription
    });
     
    console.log("User upgraded to:", plan);
  }

  // Handle cancellation
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    await User.findOneAndUpdate(
      { subscriptionId: subscription.id },
      { plan: "free" }
    );

    console.log("User downgraded to free");
  }

  res.json({ received: true });
};