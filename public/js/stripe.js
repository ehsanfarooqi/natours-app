import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async tourId => {
  const stripe = Stripe(
    'pk_test_51OpGZDKX61SmIbImGtA0QG8NSl5PfSctRDvBbqJhm7JN9ZDpSTl1TeCo55cvq88WTJLQRmlYIBAZTnv5ks34BEuj00VviwoA9q'
  );

  try {
    // 1. Get checkout session from the API
    const session = await axios(`api/bookings/checkout-session/${tourId}`);

    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
