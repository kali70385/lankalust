const AboutPage = () => (
  <div className="container py-12 max-w-3xl">
    <h1 className="text-3xl font-display font-bold text-gradient mb-6">About LankaLust</h1>
    <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
      <p>LankaLust is Sri Lanka's premier adult classifieds platform, connecting adults across the island for personal encounters, services, and companionship. Launched in 2026, we provide a safe, discreet, and user-friendly space for consenting adults to explore their desires.</p>
      <h2 className="text-xl font-semibold text-foreground mt-8">Our Mission</h2>
      <p>We believe every adult deserves a judgement-free platform to express themselves. Our mission is to create a trusted community where Sri Lankan adults can connect freely, whether for personal relationships, professional services, or social interaction.</p>
      <h2 className="text-xl font-semibold text-foreground mt-8">What We Offer</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong className="text-foreground">Classified Ads</strong> — Browse and post ads across categories including Male & Female Personals, Massage, Live Cam, Toys, Jobs, and Hotels/Rooms.</li>
        <li><strong className="text-foreground">Chat Rooms</strong> — Real-time public and private chat rooms for socialising with like-minded adults.</li>
        <li><strong className="text-foreground">Dating</strong> — A simple, swipe-style dating system to find your match.</li>
        <li><strong className="text-foreground">WalKatha</strong> — A curated collection of adult stories written by our community.</li>
      </ul>
      <h2 className="text-xl font-semibold text-foreground mt-8">Our Values</h2>
      <p>Privacy, safety, and consent are at the core of everything we do. We employ strict content moderation, encourage users to report suspicious activity, and never share personal data with third parties.</p>
      <p className="text-sm mt-8 text-muted-foreground/70">LankaLust is intended for adults aged 18 and above only. By using this platform you confirm that you meet the minimum age requirement.</p>
    </div>
  </div>
);

export default AboutPage;
