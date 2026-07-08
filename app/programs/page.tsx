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
                src="/images/counseling.webp"
                alt="Youth in a counseling session"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Program 2 */}
        <section id="program-2" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/music-therapy.webp"
                alt="Youth mentorship"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl mb-4">Music Therapy</h2>
              <p className="text-lg text-gray-600 mb-6">
                A registered core activity of our foundation. We use music-based therapeutic techniques alongside professional counseling to help young people process trauma, express emotion, and build resilience in a way that feels natural and engaging.
              </p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  Emotional expression and stress relief through music
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  Complementary support alongside talk therapy and counseling
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Program 3 */}
        <section id="program-3" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl mb-4">Youth Advocacy &amp; Community Development</h2>
              <p className="text-lg text-gray-600 mb-6">
                Reflecting our registered mandate to provide humanitarian aid, promote human rights, and implement development projects, this program delivers education support, health services, and advocacy work that address the everyday needs of the youth and communities we serve.
              </p>
               <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  Education access and support services
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">✓</span>
                  Human rights and youth advocacy initiatives
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/community.webp"
                alt="Community workshop"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

      </div>

      {/* Impact Stories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-6">Impact Stories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            UpliftGrove Foundation LBG was registered in Ghana in November 2025 and is in the early stages of running these programs. As we work with young people and communities, we will share real, anonymized stories here with documented consent — check back soon.
          </p>
        </div>
      </section>
    </div>
  );
}
