import Image from "next/image";

export const metadata = {
  title: "About Us | UpliftGrove Foundation",
  description: "Learn about the UpliftGrove Foundation's mission, story, and team supporting youth in Ghana.",
};

export default function AboutPage() {
  return (
    <div className="bg-bg-warm-sand min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">About UpliftGrove</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Dedicated to breaking down barriers to youth counseling in Ghana, fostering resilience, and creating pathways to success.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                [NEEDS INPUT: Founding story]. The UpliftGrove Foundation was established with a simple but powerful belief: every young person deserves access to guidance and mental health support, regardless of their background.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We recognized a critical gap in community support structures for youth navigating the complexities of modern life, education, and personal growth in Ghana. By providing safe, confidential counseling and mentorship, we empower them to build brighter futures.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://picsum.photos/seed/aboutstory/800/800"
                alt="Community gathering"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-bg-warm-sand p-10 rounded-2xl">
              <h2 className="text-2xl text-accent-gold mb-4">Our Mission</h2>
              <p className="text-gray-700 text-lg">
                To provide accessible, professional counseling and community guidance programs that empower Ghanaian youth to overcome personal challenges, realize their potential, and become positive contributors to society.
              </p>
            </div>
            <div className="bg-bg-warm-sand p-10 rounded-2xl">
              <h2 className="text-2xl text-accent-gold mb-4">Our Vision</h2>
              <p className="text-gray-700 text-lg">
                A Ghana where every young person has the emotional resilience, mental well-being, and community support needed to thrive and lead a fulfilling life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-12">Our Team & Board</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
            Meet the dedicated professionals and community leaders behind UpliftGrove Foundation. [NEEDS INPUT: Add actual bios and photos below]
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member Placeholder */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-bg-warm-sand">
                  <Image
                     src={`https://picsum.photos/seed/team${item}/400/400`}
                     alt="Team member placeholder"
                     fill
                     className="object-cover"
                     referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl mb-1">Name [NEEDS INPUT]</h3>
                <p className="text-accent-gold font-medium mb-4">Role / Title</p>
                <p className="text-gray-600 text-sm">
                  Brief biography highlighting their experience in youth counseling, education, or community development.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Accreditation */}
      <section className="py-20 bg-primary-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-white mb-12">Partners & Accreditation</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
            {/* Logos Placeholders */}
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center text-sm">[Partner Logo]</div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center text-sm">[Ministry Logo]</div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center text-sm">[Sponsor Logo]</div>
          </div>
          <p className="mt-12 text-gray-400 max-w-2xl mx-auto text-sm">
             UpliftGrove Foundation is a registered NGO in Ghana. [NEEDS INPUT: Registration Number / Details]
          </p>
        </div>
      </section>
    </div>
  );
}
