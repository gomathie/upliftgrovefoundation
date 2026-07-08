import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Users, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/ghana-youth/1920/1080"
            alt="Ghanaian youth smiling and learning together"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary-navy/70 mix-blend-multiply"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Empowering Ghanaian Youth to Build Brighter Futures
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Providing a safe space, confidential counseling, and community programs to help young people navigate challenges and thrive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/support"
              className="px-8 py-4 bg-accent-gold text-primary-navy font-heading font-bold rounded-md hover:bg-opacity-90 transition-opacity w-full sm:w-auto text-center"
            >
              Get Support Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white font-heading font-bold rounded-md hover:bg-white/20 transition-all w-full sm:w-auto text-center backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe every young person deserves guidance, mental health support, and a community that believes in them. UpliftGrove Foundation is dedicated to breaking down barriers to youth counseling in Ghana, fostering resilience, and creating pathways to success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-2xl bg-bg-warm-sand">
              <div className="mx-auto w-16 h-16 bg-primary-navy/10 text-primary-navy rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-4xl text-accent-gold mb-2">5,000+</h3>
              <p className="font-medium text-primary-navy text-lg">Youth Supported</p>
              <p className="text-sm text-gray-500 mt-2">[NEEDS INPUT: update stat]</p>
            </div>
            <div className="p-8 rounded-2xl bg-bg-warm-sand">
              <div className="mx-auto w-16 h-16 bg-primary-navy/10 text-primary-navy rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-4xl text-accent-gold mb-2">50+</h3>
              <p className="font-medium text-primary-navy text-lg">Professional Counselors</p>
              <p className="text-sm text-gray-500 mt-2">[NEEDS INPUT: update stat]</p>
            </div>
            <div className="p-8 rounded-2xl bg-bg-warm-sand">
              <div className="mx-auto w-16 h-16 bg-primary-navy/10 text-primary-navy rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-4xl text-accent-gold mb-2">25</h3>
              <p className="font-medium text-primary-navy text-lg">Communities Reached</p>
              <p className="text-sm text-gray-500 mt-2">[NEEDS INPUT: update stat]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Preview Grid */}
      <section className="py-20 bg-bg-warm-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl mb-4">Our Programs</h2>
              <p className="text-gray-600 max-w-2xl">Discover how we are making a difference in the lives of young people through targeted initiatives and compassionate support.</p>
            </div>
            <Link href="/programs" className="hidden md:flex items-center text-primary-navy font-semibold hover:text-accent-gold transition-colors">
              View All Programs <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://picsum.photos/seed/counseling/800/600"
                  alt="Counseling session"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl mb-3">Counseling & Guidance</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  Confidential one-on-one and group counseling sessions to help youth navigate anxiety, trauma, educational stress, and personal growth.
                </p>
                <Link href="/programs#counseling" className="text-primary-navy font-medium hover:text-accent-gold inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Program 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://picsum.photos/seed/mentorship/800/600"
                  alt="Mentorship program"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl mb-3">[Program Name: NEEDS INPUT]</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  [Program description placeholder. E.g., Peer mentorship networks connecting experienced young adults with teens entering high school.]
                </p>
                <Link href="/programs#program-2" className="text-primary-navy font-medium hover:text-accent-gold inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Program 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://picsum.photos/seed/community/800/600"
                  alt="Community outreach"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl mb-3">[Program Name: NEEDS INPUT]</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  [Program description placeholder. E.g., Community outreach and life skills workshops focusing on resilience and leadership.]
                </p>
                <Link href="/programs#program-3" className="text-primary-navy font-medium hover:text-accent-gold inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link href="/programs" className="inline-flex items-center text-primary-navy font-semibold hover:text-accent-gold transition-colors">
              View All Programs <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-white mb-6">You Are Not Alone</h2>
          <p className="text-lg text-gray-300 mb-10">
            If you are going through a difficult time, our professional counselors are here to listen and help. Your information is kept completely confidential.
          </p>
          <Link
            href="/support"
            className="inline-block px-8 py-4 bg-accent-gold text-primary-navy font-heading font-bold rounded-md hover:bg-opacity-90 transition-opacity text-lg"
          >
            Talk to a Counselor Today
          </Link>
        </div>
      </section>
    </div>
  );
}
