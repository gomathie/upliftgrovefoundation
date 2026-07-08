import { HeartHandshake, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Donate | UpliftGrove Foundation",
  description: "Support UpliftGrove Foundation's youth programs in Ghana through a donation.",
};

export default function DonatePage() {
  return (
    <div className="bg-bg-warm-sand min-h-screen">
      <section className="bg-primary-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">Support Our Mission</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">
            Your generous contribution allows us to reach more young people, provide free counseling, and build resilient communities.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Donation Form placeholder */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl mb-6 text-center">Make a Donation</h2>
            
            <div className="flex justify-center space-x-4 mb-8">
              <button className="px-6 py-2 bg-primary-navy text-white rounded-md font-medium">One-Time</button>
              <button className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md font-medium hover:bg-gray-50">Monthly</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <button className="py-3 border border-gray-300 rounded-md font-bold text-primary-navy hover:border-accent-gold hover:text-accent-gold transition-colors">$25</button>
              <button className="py-3 border-2 border-accent-gold bg-accent-gold/10 rounded-md font-bold text-primary-navy">$50</button>
              <button className="py-3 border border-gray-300 rounded-md font-bold text-primary-navy hover:border-accent-gold hover:text-accent-gold transition-colors">$100</button>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-text-charcoal mb-2">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input type="number" className="w-full pl-8 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold" placeholder="Other amount" />
              </div>
            </div>

            <button className="w-full px-6 py-4 bg-accent-gold text-primary-navy font-heading font-bold rounded-md hover:bg-opacity-90 transition-opacity flex justify-center items-center">
              <HeartHandshake className="mr-2 w-5 h-5" /> Donate Now
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              Payments are processed through a secure, encrypted payment gateway. We never store your card details.
            </p>
          </div>

          {/* Transparency info */}
          <div>
            <h2 className="text-3xl mb-6">Where Your Funds Go</h2>
            <p className="text-lg text-gray-600 mb-8">
              We are committed to full transparency. Every donation directly supports our initiatives in Ghana.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="text-accent-gold mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">Professional Counseling</h3>
                  <p className="text-gray-600">Funding allows us to provide free or heavily subsidized counseling sessions for youth who otherwise could not afford it.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-accent-gold mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">Community Outreach</h3>
                  <p className="text-gray-600">Supporting the logistics and materials needed to run workshops in schools and local centers.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-accent-gold mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">Training Counselors</h3>
                  <p className="text-gray-600">Investing in the continuous education of our counselors to ensure they are equipped with the best practices.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-primary-navy/5 rounded-xl border border-primary-navy/10">
              <h3 className="font-heading font-semibold text-primary-navy mb-2">Financial Transparency</h3>
              <p className="text-sm text-gray-600">
                UpliftGrove Foundation is a registered NGO. Our annual financial reports will be published here to ensure accountability to our donors and community as they become available.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
