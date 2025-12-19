import React from 'react';
import Navbar from '../../components/layout/Navbar';

const Legal = () => {
  const primaryBg = 'bg-linear-to-br from-blue-800 to-slate-900';

  const Section = ({ title, children }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-blue-900 mb-3 border-b pb-2">{title}</h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      
       <Navbar title={"Policies & Terms"} />

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        
        <Section title="Privacy Policy">
          At Billing Habit, we value your trust. We collect your phone number and shop name to manage your account. 
          Your inventory data and bills are private and are never shared with third parties. 
          We use industry-standard encryption to keep your data safe on our servers.
        </Section>

        <Section title="Terms & Conditions">
          1. Billing Habit is a tool for calculation and record-keeping. Accuracy depends on user input.<br />
          2. We are not responsible for any legal or tax-related errors made by the user.<br />
          3. You agree not to use this app for any illegal transactions.<br />
          4. Subscription fees are subject to change with 30-day prior notice.<br />
        </Section>

        <Section title="Refund & Cancellation Policy">
          1. <span className='font-bold'>Cancellations:</span> You can stop your subscription at any time from the app settings.<br />
          2. <span className='font-bold'>Refunds:</span> As this is a digital SaaS product, we offer a 7-day money-back guarantee for technical issues only.<br />
          3. <span className='font-bold'>Processing:</span> Approved refunds are processed via Razorpay within 5-7 working days back to the original payment source.<br />
        </Section>

        <Section title="Contact Us">
          For support or queries, contact us at: <br />
          Email: billinghabit@gmail.com<br />
          Address: Jabalpur, MP India - 482001<br />
          Phone: +91 9685208320<br />
        </Section>

        <div className="text-center text-gray-400 text-xs mt-10">
          Last Updated: December 2025
        </div>
      </div>
    </div>
  );
};

export default Legal;