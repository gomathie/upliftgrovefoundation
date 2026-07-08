import { IntakeForm } from "@/components/IntakeForm";
import { Shield, Phone, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Get Support | UpliftGrove Foundation",
  description: "Confidential intake form for Ghanaian youth seeking counseling and support.",
};

export default function SupportPage() {
  return (
    <div className="bg-bg-warm-sand min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-6">Reach Out for Support</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You don't have to navigate difficult times alone. Fill out the form below, and one of our professional counselors will reach out to you.
          </p>
        </div>

        {/* Crisis Alert */}
        <div className="bg-[#FFF8E6] border border-accent-gold rounded-xl p-6 mb-12 flex items-start space-x-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-accent-gold flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-heading font-semibold text-primary-navy mb-2">Need Immediate Help?</h3>
            <p className="text-text-charcoal mb-4">
              If you are in immediate danger or experiencing an acute crisis, please contact the local emergency hotline right away.
            </p>
            <p className="font-bold text-primary-navy">
              Emergency Hotline: [NEEDS INPUT - Local Crisis Number]
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Trust Banner */}
          <div className="bg-primary-navy text-white p-6 flex items-center space-x-4">
            <Shield className="w-8 h-8 text-accent-gold flex-shrink-0" />
            <div>
              <h2 className="text-xl font-heading font-semibold text-white mb-1">100% Confidential</h2>
              <p className="text-sm text-gray-300">
                Your information is completely safe with us. It will only be seen by our professional counseling team.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <IntakeForm />
          </div>
          
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            A counselor will reach out within [NEEDS INPUT - e.g., 24 hours] of receiving your message.
          </p>
        </div>
      </div>
    </div>
  );
}
