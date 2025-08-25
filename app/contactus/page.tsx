'use client'
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Users, Headphones } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // You can add your form submission logic here
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+91 98765 43210", "+91 87654 32109"],
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["hello@janvaani.com", "support@janvaani.com"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      details: ["Tech Hub, Sector 18", "Gurugram, Haryana 122015"],
      description: "Visit us for in-person meetings"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 2:00 PM"],
      description: "Sunday: Closed"
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'demo', label: 'Request Demo', icon: <Users className="w-4 h-4" /> },
    { value: 'support', label: 'Technical Support', icon: <Headphones className="w-4 h-4" /> },
    { value: 'partnership', label: 'Partnership', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100 leading-relaxed">
              Ready to revolutionize your municipal services? Let's discuss how Janvaani can help your city
            </p>
            <div className="w-24 h-1 bg-teal-300 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-gray-50 -mt-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {info.title}
                </h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-teal-700 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Form */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Have questions about implementing Janvaani in your municipality? 
                Our team is here to help you get started.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    placeholder="What can we help you with?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column - Additional Info */}
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-teal-800">
                  Why Choose Janvaani?
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>24/7 AI-powered assistance for citizens</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Multilingual support for inclusive access</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Easy integration with existing systems</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Reduced workload for municipal staff</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-teal-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Quick Response Guarantee
                </h3>
                <p className="text-gray-600 mb-4">
                  We understand the urgency of municipal service delivery. Our team commits to:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm text-gray-700">Email responses within 4 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm text-gray-700">Phone consultations within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm text-gray-700">Demo scheduling within 48 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-xl mb-8 text-teal-100">
            For urgent technical support or system outages, contact our emergency hotline
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:+919876543210"
              className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-colors duration-300 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              +91 98765 43210
            </a>
            <span className="text-teal-200">Available 24/7 for critical issues</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;