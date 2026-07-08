import { Users, Handshake } from "lucide-react";
import { VolunteerForm } from "@/components/VolunteerForm";
import { PartnershipForm } from "@/components/PartnershipForm";

export const metadata = {
  title: "Get Involved | UpliftGrove Foundation",
  description: "Volunteer or partner with UpliftGrove to support youth in Ghana.",
};

export default function GetInvolvedPage() {
  return (
    <div className="bg-bg-warm-sand min-h-screen">
      <section className="bg-primary-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">Get Involved</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">
            Join us in making a lasting impact on the lives of young people. Your time, skills, and partnerships are invaluable.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Volunteer Section */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-accent-gold/20 text-accent-gold rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-3xl mb-4">Volunteer</h2>
            <p className="text-gray-600 mb-8">
              We are always looking for passionate individuals to support our mission. Whether you have professional counseling experience, administrative skills, or simply a desire to mentor, there is a place for you.
            </p>
            <VolunteerForm />
          </div>

          {/* Partner Section */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
             <div className="w-16 h-16 bg-primary-navy/10 text-primary-navy rounded-full flex items-center justify-center mb-6">
              <Handshake className="w-8 h-8" />
            </div>
            <h2 className="text-3xl mb-4">Partner With Us</h2>
            <p className="text-gray-600 mb-8">
              Are you an organization, school, or corporate entity looking to support youth development in Ghana? We actively seek partnerships to expand our reach and enhance our programs.
            </p>
            <PartnershipForm />
          </div>

        </div>
      </div>
    </div>
  );
}
