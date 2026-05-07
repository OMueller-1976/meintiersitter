import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MarktplatzPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#EEF2F8] py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3249] mb-4">
              Marktplatz Vulkaneifel
            </h1>
            <p className="text-[#4E779F] text-lg">
              Tiergeschäfte, Tierärzte und hundefreundliche Betriebe im Kreis Daun.
            </p>
          </div>
        </section>

        {/* Status */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#EEF2F8] border-2 border-[#2E4A6B] rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">🏪</div>
              <h2 className="text-xl font-bold text-[#1E3249] mb-3">In Kürze verfügbar</h2>
              <p className="text-[#4E779F]">
                Der Marktplatz für lokale Tiergeschäfte, Tierärzte und hundefreundliche Betriebe
                im Kreis Daun wird gerade aufgebaut. Schau bald wieder vorbei!
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
