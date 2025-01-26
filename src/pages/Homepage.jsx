import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram,  X, Phone, Mail, CheckCircle } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa'; 
import '../styles/Home.css';
import Header from '../components/Header';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ContactForm');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    church: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const [timeRemaining, setTimeRemaining] = useState({
    days: 25,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateTimeRemaining = () => {
    const now = new Date().getTime();
    const countdownDate = now + 25 * 24 * 60 * 60 * 1000; // 25 days from now

    const distance = countdownDate - now;

    if (distance < 0) {
      setTimeRemaining({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    setTimeRemaining({
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    });
  };




  const handleChange = (e) => {
    setFormErrors({});
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.church.trim()) errors.church = 'Name of Church is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      // Handle form submission logic here
      alert('Form submitted successfully!');
    } else {
      setFormErrors(errors);
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gray-900 text-white  md:pr-0">

    <Header />
      {/* Hero Section */}
      <section className="text-white pt-20 md:pt-0 mt-4">
        <div className="relative  bg-[url('/image2.jpeg')] bg-cover bg-center flex items-center mt-6">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="flex flex-col-reverse md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Kickstart Your Tech Journey – Enroll in Our First Digital Skills Training! 
                </h1>
                <p className="text-sm md:text-base text-white mb-4">
                Gain hands-on experience in essential digital career paths and unlock new opportunities. 
                Join our first training session and take the first step toward a successful tech career today!
                </p>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <a 
                    href="/apply" 
                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg inline-flex items-center justify-center w-full md:w-auto"
                  >
                    Register Now
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 md:h-5 md:w-5 ml-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </a> 
                  <p className="text-sm md:text-base text-white text-center md:text-left"> 
                    Application Deadline: 23rd February, 2025
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0 heroimage">
                <img 
                  src="/image13.png" 
                  alt="Hero" 
                  className="max-w-full md:max-w-2xl h-auto object-contain heroimage"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-300 text-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 flex items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">About Us</h2>
                <p className="mb-4 text-justify">
                Our Tech Academy is committed to equipping individuals with the essential digital skills needed to thrive in today's technology-driven world.
                With a focus on practical, hands-on training, we empower students to excel in various digital fields, from programming to UI/UX design and beyond.
              </p>
                <p className="mb-4 text-justify">
                Whether you're a beginner looking to start your tech journey or a professional seeking to upskill, our structured programs are designed to help
                you achieve your goals.
                </p>
                <p className="mb-4 text-justify">
                Join us and gain the expertise needed to compete in the global digital economy while contributing to technological advancements in our community.
                </p>
                <h4 className="text-3xl md:text-3xl font-bold mb-4 mt-6 text-center md:text-left">Our Ability</h4>
                <p className="mb-4 text-justify">
                We specialize in providing high-quality training in key digital skills, including web development, data analytics, cybersecurity, cloud computing,
                digital marketing, and more. Our goal is to bridge the digital divide by making tech education accessible to everyone.
              </p>
                <h4 className="text-3xl md:text-3xl font-bold mb-4 mt-6 text-center md:text-left">Our Uniqueness</h4>
                <p className='text-justify'>
                We believe in a hands-on, project-based approach to learning. Our academy provides mentorship from industry experts, real-world projects, and a
                supportive learning environment to ensure our students gain both technical and soft skills needed to excel in the tech industry.
              </p>
              </div>
            </div>

            <div className="lg:w-1/2 relative overflow-hidden">
  <img 
    src="/image4.jpg" 
    alt="About TLBC" 
    className="w-full h-auto object-cover rounded-lg" 
  />
 <div className="absolute bottom-0 left-0 right-0 bg-white/75 backdrop-blur-sm hidden sm:block p-4 sm:p-8">
    <div className="flex items-center max-w-md mx-auto">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white">
        👥
      </div>
      <div>
        <h4 className="text-lg sm:text-xl font-bold text-gray-900">Our People</h4>
        <p className="text-sm sm:text-base text-gray-700">
          Passionate, Innovative, and Driven by Excellence
        </p>
      </div>
    </div>
</div>
</div>

          </div>
        </div>
      </section>


<section className='py-16 bg-gray-800' id='eligibility'>
      <div className="container mx-auto px-4 flex items-start flex-col md:flex-row">
        {/* Image Section - Hidden on mobile, visible on desktop */}
        <div className="w-full md:w-1/2 mr-0 md:mr-8 hidden md:block">
          <div className="relative group overflow-hidden rounded-lg shadow-lg">
            <img 
              src="/imagemix1.png" 
              alt="Programme Eligibility" 
              className="w-full h-[680px] object-cover object-center transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
        </div>

        {/* Text Content Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left text-white">
              Eligibility Requirements
            </h2>
            
            <ul className="space-y-4 text-white">
              {[
                "Age range: 25-35 years old",
                "Bachelor's degree in health-related, IT, or social sciences",
                "Demonstrable interest/experience in public health, NGO work, or community leadership projects",
                "Full-time availability for the fellowship programme",
                "State indigeneity for the applied region",
                "Smartphone with data capabilities (WhatsApp, Zoom, etc.)",
                "Recommendation from University Dean, NYSC, or respected organization",
                "Strong analytical skills and entrepreneurial drive"
              ].map((requirement, index) => (
                <li 
                  key={index} 
                  className="flex items-start space-x-3 text-base"
                >
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <a 
              href="/apply" 
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center justify-center transition-colors duration-300"
            >
              Apply Now
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-300 text-black" id="contact">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Have any questions? Let's talk</h2>
            
            <div className="border p-6 rounded-lg shadow-xl bg-white">
              <h2 className='mt-0 mb-3 text-center font-bold text-xl'>Contact Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6 text-gray-900 border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        className="w-full border  rounded-lg px-4 py-2"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        className="w-full border rounded-lg px-4 py-2"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        className="w-full border rounded-lg px-4 py-2"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="church"
                        placeholder="Address"
                        className="w-full border rounded-lg px-4 py-2"
                        value={formData.church}
                        onChange={handleChange}
                      />
                      {formErrors.church && <p className="text-red-500 text-sm mt-1">{formErrors.church}</p>}
                    </div>
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows="3"
                      className="w-full border rounded-lg px-4 py-2"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                    {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
                  </div>
                  <div className="text-center">
                    <button type="submit" className="bg-gray-900 text-white px-8 py-2 rounded-lg hover:bg-gray-500 transition duration-300">
                      Send message
                    </button>
                  </div>
                </form>
             
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-6 md:space-y-0">
          {/* Logo */}
          <div className="w-32 md:w-24 h-20 flex justify-center md:justify-start">
          <a href="/">
            <img 
              src="/PEF-TECH-Logo-noBg2.png" 
              alt="CJ ART Logo" 
              className="object-contain w-full h-full"
            />
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6 justify-center">
            <SocialIcon 
              href="https://www.facebook.com/thelordsbrethrenchurchintl" 
              icon={<Facebook size={24} />} 
            />
            <SocialIcon 
              href="https://www.instagram.com/thelordsbrethrenchurchintl" 
              icon={<Instagram size={24} />} 
            />
            <SocialIcon 
              href="https://www.youtube.com/channel/UCcdBHIYqSBIktXvHimyPkaw" 
              icon={<FaYoutube size={24} />} 
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <h5 className="text-lg font-semibold mb-4 text-white">Have any questions?</h5>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="tel:0913-444-5037" 
                className="flex items-center justify-center text-white hover:text-teal-400 transition-colors"
              >
                <Phone size={18} className="mr-2" />
                0913-444-5037
              </a>
              <a 
                href="mailto:info@thelordsbrethrenchurch.org" 
                className="flex items-center justify-center text-white hover:text-teal-400 transition-colors"
              >
                <Mail size={18} className="mr-2" />
                info@thelordsbrethrenchurch.org
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-center text-sm text-white">
            Copyright © 2025 || TECH ACADEMY
          </p>
        </div>
      </div>
    </footer>

    </div>
  );
}

// Utility Components
const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors"
  >
    {icon}
  </a>
);

const ExpectCard = ({ image, title }) => (
  <div className="relative group overflow-hidden rounded-lg">
    <img src={image} alt={title} className="w-full h-64 object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-xl font-bold">{title}</p>
    </div>
  </div>
);

const EligibilityCard = ({ image, title, description }) => (
  <div className="relative group overflow-hidden rounded-lg">
    <img src={image} alt={title} className="w-full h-64 object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white">{description}</p>
    </div>
  </div>
);
