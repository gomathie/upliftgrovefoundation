import { MapPin, Phone, Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | UpliftGrove Foundation",
  description: "Get in touch with the UpliftGrove Foundation for general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-bg-warm-sand min-h-screen">
      <section className="bg-primary-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">
            Have a general question about our programs, partnerships, or operations? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="bg-yellow-50 border-l-4 border-accent-gold p-6 mb-12 max-w-4xl mx-auto rounded-r-xl">
          <h3 className="font-heading font-semibold text-primary-navy mb-2">Looking for counseling support?</h3>
          <p className="text-gray-700">
            Please do not use this general contact form for confidential support requests. Instead, use our secure <a href="/support" className="text-primary-navy font-bold underline hover:text-accent-gold">Intake Form</a> to speak with a counselor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          
          {/* Contact Details */}
          <div>
            <h2 className="text-3xl mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-navy shadow-sm mr-4 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">Office Location</h3>
                  <p className="text-gray-600">
                    Okra Street, near The Church of Jesus Christ of Latter-day Saints,<br />
                    House Number 05, Millenium City, Kasoa, Gomoa East, Central Region, Ghana
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Digital Address: CG-1575-9030</p>
                  <p className="text-sm text-gray-500 mt-1">Office Hours: Monday – Friday, 9:00 AM – 5:00 PM (GMT)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-navy shadow-sm mr-4 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">Phone Number</h3>
                  <p className="text-gray-600">0546 015 680</p>
                  <p className="text-gray-600">0508 133 939</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-navy shadow-sm mr-4 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">Email Address</h3>
                  <p className="text-gray-600">kobinamensah73@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* General Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl mb-6">Send a Message</h3>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
