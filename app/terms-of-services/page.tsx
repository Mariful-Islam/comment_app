// pages/terms.tsx

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-4">Last Updated: October 9, 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Overview</h2>
        <p>
          Social Bee is a social analytics and engagement tool that helps users interact with their Facebook data. The App
          is built using Next.js and styled with Tailwind CSS for a responsive and modern experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. Facebook Integration</h2>
        <p>
          By using the App, you grant us access to certain Facebook data in accordance with Facebook’s Platform Terms.
          We only request permissions necessary to deliver core features (such as reading posts, comments, or pages
          you manage), and you can revoke access at any time via your Facebook settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Eligibility</h2>
        <p>
          You must be at least 13 years old or the minimum age required in your country to use this App. If you are under
          18, you must have your parent or guardian’s permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. User Data & Privacy</h2>
        <p>
          We respect your privacy. Please refer to our Privacy Policy to understand how we collect, use, and store your data.
          <br /><br />
          - We do <strong>not</strong> sell or share your data with third parties without your consent. <br />
          - You can request data deletion at any time by contacting <a href="mailto:support@socialbee.com" className="text-blue-600 underline">support@socialbee.com</a>. <br />
          - Any data pulled from Facebook is handled securely and only used for features you activate within the app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Acceptable Use</h2>
        <p>
          You agree <strong>not</strong> to: <br />
          - Use the App for any unlawful purposes. <br />
          - Interfere with or disrupt the integrity of the App or its services. <br />
          - Attempt to gain unauthorized access to systems or data. <br />
          - Use automation tools (bots, scripts) to access the App in violation of Facebook's terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Intellectual Property</h2>
        <p>
          All content, branding, design, and code used in this App (including Next.js and TailwindCSS implementations)
          are the intellectual property of <strong>Social Bee</strong>, unless otherwise stated.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the App at any time, without notice, if you
          violate these Terms or misuse the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">8. Disclaimer</h2>
        <p>
          The App is provided <strong>"as is"</strong> without warranties of any kind, either express or implied. We do not guarantee:
          <br />
          - That the App will always be available or bug-free. <br />
          - The accuracy of Facebook data retrieved via the API.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Social Bee will not be liable for any indirect, incidental, special,
          or consequential damages arising from your use of the App.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">10. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. We'll notify you of significant changes, but it's your
          responsibility to review these Terms periodically.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">11. Contact</h2>
        <p>
          If you have any questions or concerns about these Terms, contact us at: <br />
          📧 <a href="mailto:hello@brandify.digital" className="text-blue-600 underline">hello@brandify.digital​</a> <br />
          🌐 <a href="https://brandify.digital/" className="text-blue-600 underline">http://esolver.io/</a>
        </p>
      </section>
    </div>
  );
}
