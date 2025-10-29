import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Secure360
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Complete
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Security Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Monitor your digital security with breach detection, file scanning, website vulnerability analysis, and comprehensive session management.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
          >
            Start Protecting Your Data
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Email Breach Checker"
            description="Check if your email or phone has been compromised in known data breaches"
            icon="🔍"
          />
          <FeatureCard
            title="File Virus Scanner"
            description="Upload and scan files for malware, trojans, and other security threats"
            icon="🛡️"
          />
          <FeatureCard
            title="Website Vulnerability Scanner"
            description="Analyze websites for security vulnerabilities, SSL issues, and missing headers"
            icon="🌐"
          />
          <FeatureCard
            title="Active Session Management"
            description="Track and manage all devices logged into your account with remote logout"
            icon="📱"
          />
          <FeatureCard
            title="Login History & Audit"
            description="Monitor all login attempts with detailed IP tracking and location data"
            icon="📊"
          />
          <FeatureCard
            title="Security Analytics"
            description="Get comprehensive reports and security scores based on your activity"
            icon="📈"
          />
        </div>

        {/* Security Features */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Enterprise-Grade Security
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <SecurityFeature
              title="Password Encryption"
              description="Military-grade bcrypt hashing for password storage"
            />
            <SecurityFeature
              title="JWT Authentication"
              description="Secure token-based authentication system"
            />
            <SecurityFeature
              title="Rate Limiting"
              description="Protection against brute force and DDoS attacks"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Secure360. All rights reserved. Built with Next.js and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function SecurityFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
