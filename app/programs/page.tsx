import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Our Programs | UpliftGrove Foundation",
  description: "Discover the counseling, mentorship, and community outreach programs offered by UpliftGrove.",
};

export default function ProgramsPage() {
  return (
    <div className="bg-bg-warm-sand min-h-screen">
      {/* Header */}
      <section className="bg-primary-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">Our Programs</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Comprehensive support systems designed to empower youth, build resilience, and foster community connection.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        
        {/* Program 1: Counseling & Guidance (Priority) */}
        <section id="counseling" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-accent-gold/20 text-accent-gold rounded-full font-medium text-sm mb-4">
                Core Program
              </div>
              <h2 className="text-3xl mb-4">Counseling & Guidance</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our flagship program provides safe, confidential spaces for young people to discuss their challenges with professional counselors. We offer both one-on-one sessions and peer group counseling.
              </p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  Individual mental health support
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  Academic and career guidance
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  Trauma and stress management
                </li>
              </ul>
              <Link
                href="/support"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-navy text-white font-heading font-semibold rounded-md hover:bg-opacity-90 transition-opacity"
              >
                Talk to a Counselor <MessageCircle className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://picsum.photos/seed/counseling-main/1000/800"
                alt="Youth in a counseling session"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Program 2 */}
        <section id="program-2" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://picsum.photos/seed/mentorship-main/1000/800"
                alt="Youth mentorship"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-3xl mb-4">[Program 2: NEEDS INPUT]</h2>
              <p className="text-lg text-gray-600 mb-6">
                [Description of the second core program. For example, a mentorship initiative pairing young people with successful professionals in their communities.]
              </p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  [Key outcome 1]
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  [Key outcome 2]
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Program 3 */}
        <section id="program-3" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl mb-4">[Program 3: NEEDS INPUT]</h2>
              <p className="text-lg text-gray-600 mb-6">
                [Description of the third core program. For example, community outreach and life skills workshops held in local schools.]
              </p>
               <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  [Key outcome 1]
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  [Key outcome 2]
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://picsum.photos/seed/community-main/1000/800"
                alt="Community workshop"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

      </div>

      {/* Impact Stories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-16">Impact Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Story 1 */}
            <div className="bg-bg-warm-sand p-8 rounded-2xl border border-gray-100">
              <div className="text-accent-gold text-4xl font-serif mb-4">"</div>
              <p className="text-gray-700 italic text-lg mb-6">
                "The counseling I received at UpliftGrove completely changed my perspective on my future. I felt heard, understood, and finally had the tools to manage my anxiety about school."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-navy/10 rounded-full flex items-center justify-center text-primary-navy font-bold">
                  K
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary-navy">Kwame *</p>
                  <p className="text-sm text-gray-500">Age 17 (Name changed for privacy)</p>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-bg-warm-sand p-8 rounded-2xl border border-gray-100">
              <div className="text-accent-gold text-4xl font-serif mb-4">"</div>
              <p className="text-gray-700 italic text-lg mb-6">
                "[NEEDS INPUT: Add an anonymized impact story or quote from a beneficiary showing the value of the programs.]"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-navy/10 rounded-full flex items-center justify-center text-primary-navy font-bold">
                  A
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary-navy">Ama *</p>
                  <p className="text-sm text-gray-500">Age 19 (Name changed for privacy)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
