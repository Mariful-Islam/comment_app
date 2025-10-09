// pages/privacy-policy.js

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Effective Date: September 27, 2025<br />
        Last Updated: September 27, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your WhatsApp phone number</li>
          <li>Display name and profile picture (if publicly available)</li>
          <li>Messages and media (photos, videos, files) you send to our chatbot</li>
          <li>Chat timestamps and metadata (e.g., device type, language code)</li>
          <li>Any additional data you voluntarily submit through the chat interface</li>
        </ul>
        <p className="mt-2">
          We do not collect sensitive personal data such as passwords, government-issued IDs, or financial details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To respond to your queries and provide chatbot support</li>
          <li>To personalize your user experience</li>
          <li>To analyze user interaction patterns and improve performance</li>
          <li>To ensure compliance with WhatsApp Business Platform policies</li>
        </ul>
        <p className="mt-2">We do not sell, rent, or share your data with third-party advertisers.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>With Meta (WhatsApp Business API) as part of platform requirements</li>
          <li>With our hosting or analytics providers under strict data protection terms</li>
          <li>When required by law, court order, or governmental request</li>
        </ul>
        <p className="mt-2">We never use or transfer your data for unrelated marketing or resale purposes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Data Retention and Deletion</h2>
        <p>
          We retain your chat data only as long as necessary to fulfill the service’s purpose or to meet legal obligations.
          If you do not interact with the chatbot for 90 days, your data will be automatically deleted.
        </p>
        <p className="mt-2">You can request manual data deletion at any time by contacting us.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. User Controls</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Stop communication at any time by leaving or blocking the WhatsApp chat</li>
          <li>
            Request deletion of your data by messaging <strong>“Delete My Data”</strong> or emailing us at:{" "}
            <a href="mailto:imrnayeem101325@gmail.com" className="text-blue-600 hover:underline">imrnayeem101325@gmail.com</a>
          </li>
          <li>Manage permissions directly from your WhatsApp settings</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Security</h2>
        <p>
          We follow industry-standard security measures to protect your data, including:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>WhatsApp’s built-in end-to-end encryption</li>
          <li>Secure server storage</li>
          <li>Access control and internal data access policies</li>
        </ul>
        <p className="mt-2">
          However, no internet-based service is entirely secure, so please use caution when sharing personal data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If changes occur:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>We will update the “Last Updated” date above</li>
          <li>You may be notified via WhatsApp or other official channels</li>
        </ul>
        <p className="mt-2">
          Continuing to use the chatbot after an update means you accept the revised policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or your data, feel free to contact us:
        </p>
        <ul className="list-none pl-0 mt-2 space-y-1">
          <li><strong>Email:</strong> <a href="mailto:imrnayeem101325@gmail.com" className="text-blue-600 hover:underline">imrnayeem101325@gmail.com</a></li>
          <li><strong>Phone:</strong> +8801743888093</li>
          <li><strong>Address:</strong> House 1151, Road 10, Mirpur DOHS, Dhaka, Bangladesh</li>
        </ul>
      </section>
    </div>
  );
}
