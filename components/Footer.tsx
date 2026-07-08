import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-white mb-4 block">
              UpliftGrove<span className="text-accent-gold">.</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Supporting Ghanaian youth through counseling, guidance, and community programs. Empowering the next generation to thrive.
            </p>
            <p className="text-gray-400 text-sm">
              Okra Street, near The Church of Jesus Christ of Latter-day Saints<br />
              House Number 05, Millenium City, Kasoa, Gomoa East, Central Region, Ghana
            </p>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:text-accent-gold transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-accent-gold transition-colors">Our Programs</Link></li>
              <li><Link href="/get-involved" className="hover:text-accent-gold transition-colors">Get Involved</Link></li>
              <li><Link href="/donate" className="hover:text-accent-gold transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/privacy" className="hover:text-accent-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent-gold transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} UpliftGrove Foundation LBG. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p>Registration: CG079131125 &middot; TIN: C0066475368</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
