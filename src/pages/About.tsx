
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-vulnscribe-dark text-white py-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-6">About VulnScribe</h1>
            <p className="text-lg max-w-2xl opacity-90">
              Dedicated to simplifying complex security vulnerabilities through clear explanations,
              practical examples, and actionable prevention techniques.
            </p>
          </div>
        </section>
        
        {/* Mission */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-vulnscribe-dark">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  At VulnScribe, we believe that security knowledge should be accessible to everyone.
                  Our mission is to bridge the gap between complex security concepts and practical implementation.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  We create comprehensive guides that explain vulnerabilities in plain language,
                  providing real-world examples and concrete prevention strategies that developers
                  can immediately apply to their projects.
                </p>
                <p className="text-lg text-gray-700">
                  Whether you're a seasoned security professional or just starting your journey in
                  web security, our content is designed to help you understand and address common
                  security challenges in modern web applications.
                </p>
              </div>
              
              <div className="md:w-1/2 bg-vulnscribe-softpurple rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-vulnscribe-dark">What We Cover</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Shield className="h-6 w-6 text-vulnscribe-purple mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Vulnerability Explanations</h4>
                      <p className="text-gray-700">Clear and concise descriptions of how security vulnerabilities work</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Shield className="h-6 w-6 text-vulnscribe-purple mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Code Examples</h4>
                      <p className="text-gray-700">Practical code samples showing vulnerable code and secure implementations</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Shield className="h-6 w-6 text-vulnscribe-purple mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Prevention Techniques</h4>
                      <p className="text-gray-700">Actionable strategies to secure your applications against common attacks</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Shield className="h-6 w-6 text-vulnscribe-purple mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Security Best Practices</h4>
                      <p className="text-gray-700">Industry standards and recommendations for building secure applications</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center text-vulnscribe-dark">Meet Our Contributors</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg text-center">
                <img src="https://i.pravatar.cc/100?img=1" alt="Alex Johnson" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-1">Alex Johnson</h3>
                <p className="text-vulnscribe-purple font-medium mb-3">Senior Security Researcher</p>
                <p className="text-gray-600 text-sm">
                  Specializes in XSS vulnerabilities and client-side security issues.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <img src="https://i.pravatar.cc/100?img=2" alt="Sarah Chen" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-1">Sarah Chen</h3>
                <p className="text-vulnscribe-purple font-medium mb-3">Database Security Expert</p>
                <p className="text-gray-600 text-sm">
                  Focuses on SQL injection prevention and secure database design.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <img src="https://i.pravatar.cc/100?img=3" alt="Marcus Thompson" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-1">Marcus Thompson</h3>
                <p className="text-vulnscribe-purple font-medium mb-3">Application Security Lead</p>
                <p className="text-gray-600 text-sm">
                  Expert in CSRF protections and secure session management.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <img src="https://i.pravatar.cc/100?img=4" alt="Priya Sharma" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-1">Priya Sharma</h3>
                <p className="text-vulnscribe-purple font-medium mb-3">Security Consultant</p>
                <p className="text-gray-600 text-sm">
                  Specializes in authorization issues and IDOR vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-vulnscribe-dark">Get In Touch</h2>
              <p className="text-lg text-gray-700 mb-8">
                Have questions, suggestions, or want to contribute to VulnScribe?
                We'd love to hear from you!
              </p>
              
              <div className="bg-white border rounded-lg p-8">
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vulnscribe-purple"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vulnscribe-purple"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vulnscribe-purple"
                      placeholder="Message subject"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vulnscribe-purple"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-vulnscribe-purple text-white rounded-md font-medium hover:bg-vulnscribe-lightpurple transition-colors w-full"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
