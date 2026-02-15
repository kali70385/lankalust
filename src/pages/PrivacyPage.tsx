const PrivacyPage = () => (
  <div className="container py-12 max-w-3xl">
    <h1 className="text-3xl font-display font-bold text-gradient mb-6">Privacy Policy</h1>
    <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground text-sm">
      <p className="text-base">Last updated: February 2026</p>

      <h2 className="text-lg font-semibold text-foreground mt-6">1. Information We Collect</h2>
      <p>We collect information you provide directly (name, email, phone, location, ad content) and data collected automatically (IP address, browser type, device info, cookies, and usage analytics).</p>

      <h2 className="text-lg font-semibold text-foreground mt-6">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>To provide and improve our services</li>
        <li>To display your classified ads and profile</li>
        <li>To facilitate communication between users</li>
        <li>To detect fraud and enforce our terms</li>
        <li>To send service-related notifications</li>
      </ul>

      <h2 className="text-lg font-semibold text-foreground mt-6">3. Information Sharing</h2>
      <p>We do not sell your personal data to third parties. We may share information with law enforcement when legally required, service providers who assist our operations (under strict confidentiality), and other users only as you choose to make visible in your ads or profile.</p>

      <h2 className="text-lg font-semibold text-foreground mt-6">4. Data Security</h2>
      <p>We implement industry-standard encryption and security measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security of your information.</p>

      <h2 className="text-lg font-semibold text-foreground mt-6">5. Cookies</h2>
      <p>We use cookies and similar technologies to maintain sessions, remember preferences, and analyse usage patterns. You can control cookie settings through your browser.</p>

      <h2 className="text-lg font-semibold text-foreground mt-6">6. Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data by contacting us. You may also deactivate your account at any time through your account settings.</p>

      <h2 className="text-lg font-semibold text-foreground mt-6">7. Data Retention</h2>
      <p>We retain your data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for up to 90 days for legal and security purposes.</p>

      <h2 className="text-lg font-semibold text-foreground mt-6">8. Contact</h2>
      <p>For privacy-related enquiries, please contact us at <span className="text-primary">privacy@lankalust.lk</span></p>
    </div>
  </div>
);

export default PrivacyPage;
