import Link from 'next/link';
import Image from 'next/image';
import '@/app/page.css';

export default function IntroductionPage() {
  return (
    <main className="intro-container">
      <section className="intro-hero">
        <div className="intro-text">
          <h1>Welcome to <span>HealthReserve</span></h1>
          <p>
            HealthReserve is your one-stop platform to book appointments with top doctors,
            manage your health schedule, and stay on top of your wellness—all in one place.
          </p>
          <Link href="/dashboard/doctors" className="intro-button">Explore Doctors</Link>
        </div>
        <div className="intro-image">
          <Image
            src="/doctor-image.png"
            width={400}
            height={400}
            alt="Doctor Image"
          />
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose HealthReserve?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Find available doctors and book an appointment in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Scheduling</h3>
            <p>Manage your upcoming visits effortlessly and Save your time</p>
          </div>
          <div className="feature-card">
            <h3>Secure Platform</h3>
            <p>Your health data is encrypted and stored securely with care.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
