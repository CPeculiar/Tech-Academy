import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram,  X, Phone, Mail, CheckCircle } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa'; 
import emailjs from "emailjs-com";
import '../styles/Home.css';
import Header from '../components/Header';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('ContactForm');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    // return errors;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (validateForm()) {
      try {
        const response = await emailjs.send(
          "service_qpmm229",
          "template_mpaslmz",
          {
            to_email: "chukwudipeculiar@gmail.com",
            from_name: formData.name,
            from_phone: formData.phone,
            from_email: formData.email,
            address: formData.address,
            message: formData.message,
          },
          "MsKdu3pdoxmwdF031"
        );

        if (response.status === 200) {
          setIsSuccess(true);

          alert("Message sent successfully!");
          setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
            message: "",
          });
          setIsLoading(false);
        } else {
          alert("Failed to send message. Please try again.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Form submission failed:", error);
        alert("Form submission failed. Please try again.");
        setFormErrors({ form: `Form submission failed: ${error.message}` });
      }
    } else {
      setFormErrors(errors);
      setIsLoading(false);
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
               {/* Institute Name in Hero - NEW ADDITION */}
                <div className="mb-4">
                  <span className="bg-red-500 text-white px-4 py-1 rounded-lg inline-block mt-5 text-xl md:text-2xl font-bold tracking-wide mb-3">
                    FUTURE AFRICA LEADERSHIP AND TECH ACADEMY
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Become a Visionary Leader or a Digital Trailblazer 
                </h1>
                <p className="text-sm md:text-base text-white mb-4">
                Whether you're passionate about transforming lives through leadership or driving innovation through technology, 
            our academy offers the training, mentorship, and tools you need to lead and thrive in Africa's future.
                </p>

                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <a 
              href="/apply" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg inline-flex items-center justify-center w-full md:w-auto transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4-2h-4V7a1 1 0 00-2 0v3H7a1 1 0 000 2h3v4h1m2 0v-4h3a1 1 0 000-2h-3V7a1 1 0 00-2 0v3h-3a1 1 0 000 2h3v4" />
              </svg>
              Explore Tech Track
            </a>
            
            <a 
              href="/register" 
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg inline-flex items-center justify-center w-full md:w-auto transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
              </svg>
              Explore Leadership Track
                  </a> 
                  </div>

                  <p className="text-sm md:text-base text-white text-center md:text-left"> 
                    Application Deadline: 25th May, 2025
                  </p>
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
               <span className='font-bold'> FUTURE AFRICA LEADERSHIP AND TECH ACADEMY </span> is an institute under the Pastor Elochukwu Udegbunam Foundation (P.E.F). 
                We are committed to equipping individuals with the essential leadership and digital skills needed to thrive in today's world.
                
                <p className="mb-4 text-justify mt-2">
                The leadership arm of this institute is saddled with the responsibility of raising leaders who will become trailblazers in their world and in Africa at 
                large. At the heart of our leadership program is a vision to develop responsible, visionary, and transformational leaders who will shape the future
                 of Africa through innovation, ethics, and service. Our curriculum is centered on character building, strategic thinking, emotional intelligence, 
                effective communication and other qualities essential for impactful leadership in any sphere of life.

                <p className="mb-4 text-justify mt-2">
                Through structured leadership workshops, mentoring sessions with accomplished leaders, and community-based projects, we provide participants with real-world 
                exposure that fosters courage, creativity, and influence. We are deeply committed to raising a new breed of leaders who will solve Africa's challenges, 
                empower others, and lead with integrity.
                </p>

                <p className="mb-4 text-justify mt-2">
                From students and young professionals to aspiring public servants and community builders, our leadership track welcomes individuals who desire to be 
                catalysts for positive change — equipped not just with knowledge, but with purpose and vision.
                </p>

               </p>
                The Tech Academy is focused on equipping individuals with the essential digital skills needed to thrive in today's technology-driven world. 
                With a focus on practical, hands-on training, the Tech Academy empowers students to excel in various digital fields.

              </p>
                <p className="mb-4 text-justify">
                Whether you're a beginner looking to start your tech journey or a professional seeking to upskill, our structured programs are designed to help
                you achieve your goals.

                </p>
                <p className="mb-4 text-justify">
                Join us and gain the expertise needed to compete in the global digital economy while contributing to technological advancements in your community.

                </p>
                <h4 className="text-3xl md:text-3xl font-bold mb-4 mt-6 text-center md:text-left">Our Ability</h4>
                <p className="mb-4 text-justify">
                We specialize in delivering high-quality training in both leadership and technology. In the leadership arm, we empower individuals to become 
                value-driven leaders equipped with the mindset and capacity to influence their communities and nations. Our leadership training covers
                personal development, strategic leadership, ethical governance, and social impact initiatives.
                </p>

                <p className="mb-4 text-justify mt-2">
                In the tech arm, we provide robust training in web development, software engineering, data analytics, cybersecurity, digital marketing,
                Graphics designing, Video editing, and other in-demand skills. <br/> Our aim is to bridge the leadership and digital skill gap across Africa 
                by making these transformative programs accessible to everyone with the passion to grow and lead.
                </p>

                <h4 className="text-3xl md:text-3xl font-bold mb-4 mt-6 text-center md:text-left">Our Uniqueness</h4>
                <p className='text-justify'>
                What sets us apart is our holistic approach to development. We don't just teach skills — we build people. Through our leadership track, 
                participants engage in practical leadership labs, mentorship from experienced leaders, and community-based assignments that encourage 
                real-world impact. 
              </p>

              <p className='text-justify mt-2'>
              Our tech programs combine hands-on, project-based learning with mentorship from industry professionals and a curriculum tailored to market 
              relevance. Both arms emphasize collaboration, personal growth, critical thinking, and innovation — ensuring our graduates are not only 
              technically sound but also visionary, ethical, and resilient leaders for Africa’s future.
              </p>
              </div>
            </div>

  <div className="lg:w-1/2 relative overflow-hidden">
  <img 
    src="/image4.jpg" 
    alt="About TLBC" 
    className="w-full h-auto object-cover rounded-lg" 
  />
 <div className="bottom-0 left-0 right-0 bg-white/75 backdrop-blur-sm hidden sm:block p-4 sm:p-8 mt-3">
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
                "Age range: 12-45 years old",
                "A demonstrable interest in technology and digital innovation",
                "A demonstrable passion for leadership, influence, and societal impact",
                "Full-time availability for the duration of the training program",
                "Openness to new concepts, and continuous self-improvement and growth",
                "Ability to keep up with coursework, assignments, and deadlines",               
                "Access to a smartphone (and preferably a laptop) capable of running basic computer programs",
                "Reliable internet access for virtual sessions, exercises, and group projects",
                "Must have a team-oriented mindset and a willingness to collaborate on projects",
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
          
          {/* <div className="text-center md:text-left">
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
          </div> */}
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
                        name="address"
                        placeholder="Address"
                        className="w-full border rounded-lg px-4 py-2"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
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
                    <button type="submit" 
                    disabled={isLoading}
                    className={`bg-gray-900 text-white px-8 py-2 rounded-lg hover:bg-gray-500 transition duration-300
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                      {isLoading ? 'Submitting...' : 'Submit Application'}
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
            Copyright © 2025 || FUTURE AFRICA LEADERSHIP AND TECH ACADEMY
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
