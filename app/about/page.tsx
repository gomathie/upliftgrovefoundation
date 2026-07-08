import Image from "next/image";

export const metadata = {
  title: "About Us | UpliftGrove Foundation",
  description:
    "Learn about the UpliftGrove Foundation's mission, story, and team supporting youth in Ghana.",
};

export default function AboutPage() {
  return (
    <div className="bg-bg-warm-sand min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            About UpliftGrove
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Dedicated to breaking down barriers to youth counseling in Ghana,
            fostering resilience, and creating pathways to success.
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
                UpliftGrove Foundation LBG was incorporated in Ghana on 14th
                November 2025, established with a simple but powerful belief:
                every young person deserves access to guidance and mental health
                support, regardless of their background.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We recognized a critical gap in community support structures for
                youth navigating the complexities of modern life, education, and
                personal growth in Ghana. By providing safe, confidential
                counseling and mentorship, we empower them to build brighter
                futures.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-our-story.png"
                alt="Community gathering"
                fill
                className="object-cover"
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
                To provide accessible, professional counseling and community
                guidance programs that empower Ghanaian youth to overcome
                personal challenges, realize their potential, and become
                positive contributors to society.
              </p>
            </div>
            <div className="bg-bg-warm-sand p-10 rounded-2xl">
              <h2 className="text-2xl text-accent-gold mb-4">Our Vision</h2>
              <p className="text-gray-700 text-lg">
                A Ghana where every young person has the emotional resilience,
                mental well-being, and community support needed to thrive and
                lead a fulfilling life.
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
            Meet the Executive Council and leadership behind UpliftGrove
            Foundation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                seed: "team-isaac",
                name: "Isaac Mensah",
                role: "Executive Council Member / Director",
              },
              {
                seed: "team-martha",
                name: "Martha Ankai-Macaidoo",
                role: "Executive Council Member / Director",
              },
              {
                seed: "team-nanakofi",
                name: "Nana Kofi Entwi-Mensah",
                role: "Executive Council Member / Director & Secretary",
              },
            ].map((member) => (
              <div
                key={member.seed}
                className="bg-white p-8 rounded-2xl shadow-sm text-center"
              >
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-bg-warm-sand">
                  <Image
                    src={`/images/${member.seed}.webp`}
                    alt={`${member.name} placeholder photo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl mb-1">{member.name}</h3>
                <p className="text-accent-gold font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  A founding member of UpliftGrove Foundation's Executive
                  Council, helping guide the organization's mission to support
                  Ghanaian youth through counseling and community development.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="py-20 bg-primary-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-white mb-6">Accreditation</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-4">
            As a newly registered foundation, we are actively seeking
            partnerships with schools, ministries, and sponsors to expand our
            reach.{" "}
            <a
              href="/get-involved"
              className="text-accent-gold underline hover:text-white"
            >
              Partner with us.
            </a>
          </p>
          <p className="mt-8 text-gray-400 max-w-2xl mx-auto text-sm">
            UpliftGrove Foundation LBG is a registered NGO in Ghana (Company
            Limited by Guarantee), incorporated 14th November 2025. Registration
            No. CG079131125 &middot; TIN C0066475368 &middot;
            Registrar-General&apos;s Department, Accra.
          </p>
        </div>
      </section>
    </div>
  );
}
