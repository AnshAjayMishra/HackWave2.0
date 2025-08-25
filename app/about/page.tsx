"use client"
import React from 'react';
import { Users, Target, Lightbulb, Award, Mail, Linkedin, Github } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  github?: string;
}

const AboutUs: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Ansh Ajay Mishra",
      role: "FullStack Dev | Mern | Nextjs",
      bio: "Passionate about building scalable web applications and intuitive user experiences. Loves to solve complex problems with elegant code.",
      image: "/api/placeholder/300/300",
      linkedin: "https://linkedin.com/in/anshajaymishra",
      email: "ajayanshmishra10@gmail.com",
      github: "https://github.com/anshajaymishra"
    },
    {
      name: "Rajesh Kumar",
      role: "Frontend Developer",
      bio: "Expert in creating intuitive user interfaces with React and Next.js. Focused on delivering seamless digital experiences for public services.",
      image: "/api/placeholder/300/300",
      linkedin: "https://linkedin.com/in/rajesh-kumar",
      github: "https://github.com/rajeshkumar"
    },
    {
      name: "Anita Patel",
      role: "Backend Developer",
      bio: "Full-stack developer specializing in scalable backend systems. Ensuring robust and secure infrastructure for municipal service delivery.",
      image: "/api/placeholder/300/300",
      email: "anita@janvaani.com",
      github: "https://github.com/anitapatel"
    },
    {
      name: "Vikram Singh",
      role: "UX/UI Designer",
      bio: "Design thinking advocate with expertise in creating accessible interfaces. Committed to bridging the digital divide in public services.",
      image: "/api/placeholder/300/300",
      linkedin: "https://linkedin.com/in/vikram-singh"
    },
    {
      name: "Dr. Meera Gupta",
      role: "Municipal Affairs Consultant",
      bio: "Former municipal commissioner with 15+ years experience. Provides crucial insights into government processes and citizen needs.",
      image: "/api/placeholder/300/300",
      email: "meera@janvaani.com"
    },
    
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission-Driven",
      description: "Democratizing access to municipal services through intelligent automation"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description: "Leveraging cutting-edge AI to solve real-world civic challenges"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Citizen-Centric",
      description: "Designing solutions that put citizens at the heart of government services"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "Committed to delivering reliable, secure, and scalable solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-100">
              About Janvaani
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100 leading-relaxed">
              Revolutionizing municipal services through intelligent AI assistance
            </p>
            <div className="w-24 h-1 bg-teal-300 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              The Challenge We're Solving
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-teal-100">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-teal-700">
                    Municipal Service Accessibility Crisis
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Citizens across India face significant barriers when accessing municipal services - 
                      from long queues and complex procedures to language barriers and limited office hours.
                    </p>
                    <p>
                      Traditional systems often leave citizens frustrated, especially those who are elderly, 
                      differently-abled, or from rural areas where digital literacy is limited.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-teal-700">
                    Our AI-Powered Solution
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Janvaani Assistant breaks down these barriers with intelligent, voice-enabled 
                      AI that speaks your language and understands your needs.
                    </p>
                    <p>
                      Available 24/7, multilingual support, and intuitive interface that makes 
                      government services as easy as having a conversation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guided by principles that ensure every citizen has equal access to quality municipal services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl mb-6 group-hover:shadow-xl group-hover:shadow-teal-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A diverse group of technologists, designers, and municipal experts working together 
              to transform how citizens interact with government services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-64 bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                    <div className="w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  <div className="flex space-x-3">
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                    {member.github && (
                      <a 
                        href={member.github}
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming municipal service delivery across cities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-4">50,000+</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Citizens Served</h3>
              <p className="text-gray-600">Across multiple municipal corporations</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-4">85%</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Faster Resolution</h3>
              <p className="text-gray-600">Average time saved in service delivery</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-4">12</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Languages</h3>
              <p className="text-gray-600">Multilingual support for inclusive access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Municipal Services?
          </h2>
          <p className="text-xl mb-8 text-teal-100 max-w-2xl mx-auto">
            Join us in making government services more accessible, efficient, and citizen-friendly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-colors duration-300">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-teal-700 transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;