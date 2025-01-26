import React, { useState } from 'react';
import Select from "react-select";
import { Facebook, Instagram,  X, Phone, Mail, CheckCircle } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa'; 
import { Country, State } from "country-state-city";
import { submitApplication } from "../services/firestore";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../services/firebaseConfig";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Header from '../components/Header';

export default function RegistrationPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [motivationWordCount, setMotivationWordCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    countryOfOrigin: '',
    stateOfOrigin: '',
    countryOfResidence: '',
    stateOfResidence: '',
    cityOfResidence: '',
    maritalStatus: '',
    occupation: '',
    learningTrack: '',
    computerLiteracy: '',  
    motivation: '',
    haveLaptop: '',
    haveSmartPhone: '',
    opportunitySource: '',
    otherOpportunitySource: ""
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'motivation') {
      // Calculate word count
      const words = value.trim().split(/\s+/);
      const wordCount = value.trim() === '' ? 0 : words.length;
      
      // Limit to 100 words
      if (wordCount <= 100) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        setMotivationWordCount(wordCount);
      }
    } else {
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }
    
    // Clear specific error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) return "Enter a valid phone number";

    // Set a default country if no country code is provided (e.g., Nigeria "NG")
    const phoneNumber = parsePhoneNumberFromString(phone, "NG");
  
  // Validate if the phone number is real and correctly formatted
  if (!phoneNumber || !phoneNumber.isValid()) {
    return "Enter a valid phone number";
  }
    return "";
  };

  const validateForm = () => {
    let errors = {};
  
    if (!formData.firstName.trim()) formErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) formErrors.lastName = 'Last Name is required';
    if (!formData.middleName.trim()) formErrors.middleName = 'Middle Name is required';
    if (!formData.gender.trim()) formErrors.gender = 'Gender is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) 
      formErrors.email = 'Valid email is required';
    // if (!formData.phone.trim() || !/^\+?[0-9\s\-()]+$/.test(formData.phone))
    //   errors.phone = "Enter a valid phone number";
    if (validatePhoneNumber(formData.phone)) {
      formErrors.phone = validatePhoneNumber(formData.phone);
    }

    if (!formData.dateOfBirth) formErrors.dateOfBirth = 'Date of Biirth is required'; 
    if (!formData.countryOfOrigin) formErrors.countryOfOrigin = 'Country of Origin is required';
    if (!formData.stateOfOrigin) formErrors.stateOfOrigin = 'State of Origin is required';
    if (!formData.countryOfResidence) formErrors.countryOfResidence = 'Country of Residence is required';
    if (!formData.stateOfResidence) formErrors.stateOfResidence = 'State of Residence is required';
    if (!formData.cityOfResidence) formErrors.cityOfResidence = 'City of Residence is required';
    if (!formData.maritalStatus) formErrors.maritalStatus = 'Marital Status is required';
    if (!formData.occupation || formData.occupation.trim()) formErrors.occupation = 'Occupation is required';
    if (!formData.learningTrack) formErrors.learningTrack = 'Learning Track is required';
    if (!formData.computerLiteracy) formErrors.computerLiteracy = 'Computer Literacy is required';
    if (!formData.motivation || formData.motivation.trim()) formErrors.motivation = 'This field is required';
    if (!formData.haveLaptop) formErrors.haveLaptop = 'This field is required';
    if (!formData.haveSmartPhone) formErrors.haveSmartPhone = 'This field is required';
    if (!formData.opportunitySource) formErrors.opportunitySource = 'This field is required';
    
    return errors;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsLoading(true);
    
      // Call validateForm and check for errors
  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setFormErrors(validationErrors); // Set errors to state
    setIsLoading(false);
    return; // Stop submission if errors exist
  }

    try {

      // Submit application to Firebase
      const applicationId = await submitApplication(formData);
      
      // Show success message
      setShowSuccessModal(true);
      

      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        countryOfOrigin: '',
        stateOfOrigin: '',
        countryOfResidence: '',
        stateOfResidence: '',
        cityOfResidence: '',
        maritalStatus: '',
        occupation: '',
        learningTrack: '',
        computerLiteracy: '',  
        motivation: '',
        haveLaptop: '',
        haveSmartPhone: '',
        opportunitySource: '',
        otherOpportunitySource: ""
      });
      setMotivationWordCount(0); 

      } catch (error) {
        console.error("Submission failed", error);
        const errorMessage = error.code ? error.code : error.message;
      setFormErrors({ form: `Registration failed: ${errorMessage}` });
      alert(`Submission failed: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };


    const handleCountryChange = (selectedOption, field) => {
      setFormData((prev) => ({
        ...prev,
        [field]: selectedOption ? selectedOption.value : "", // Store country ISO code
        ...(field === "countryOfOrigin" ? { stateOfOrigin: "" } : { stateOfResidence: "" }),
      }));
    };
  
    const handleStateChange = (selectedOption, field) => {
      setFormData((prev) => ({
        ...prev,
        [field]: selectedOption ? selectedOption.label : "",
      }));
    };


  const countries = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const statesOptions = states.map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));


// Get all countries
const countryOptions = Country.getAllCountries().map((country) => ({
  value: country.isoCode,  // Use isoCode for retrieving states later
  label: country.name,
}));

// Get states based on selected country
const getStateOptions = (countryIso) => {
  if (!countryIso) return []; // If no country selected, return empty array
  return State.getStatesOfCountry(countryIso).map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));
};

  // Success Modal Component
  const SuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-green-500 p-4">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Application Submitted Successfully</h2>
        <p>We will contact you shortly via email. Thank you!</p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-gray-900 text-white px-4 py-2     rounded-lg hover:bg-gray-500 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="text-white pt-20 md:pt-0">
        <div className="relative bg-[url('/image2.jpeg')] bg-cover bg-center flex items-center mt-6">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Tech Skills Training Program
              </h1>
              <p className="text-sm md:text-base text-white mb-4 mt-4">
                Join our comprehensive digital skills training and unlock your potential in the technology sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 bg-gray-300 text-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Application Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-xl">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                    {formErrors.firstName && 
                      <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                    }
                  </div>
                  <div>
                    <label className="block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className='w-full'>
                    <label className="block mb-2">Gender</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center border rounded-lg w-full px-4 py-2">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          onChange={handleChange}
                          className="form-radio mr-2"
                          required
                        />
                        <span className="ml-2">Male</span>
                      </label>
                      <label className="inline-flex items-center border rounded-lg w-full  px-4 py-2">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          onChange={handleChange}
                          className="form-radio"
                          required
                        />
                        <span className="ml-2">Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                    {formErrors.email && 
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    }
                  </div>

                  <div>
                    <label className="block mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded-r-lg px-4 py-2"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor='countryOfOrigin' className="block mb-2">Country of origin</label>
                    <Select
                      id="countryOfOrigin"
                      name="countryOfOrigin"
                      options={countryOptions} 
                      value={countryOptions.find(c => c.value === formData.countryOfOrigin) || null}
                      onChange={(selected) => handleCountryChange(selected, "countryOfOrigin")}
                      placeholder='Select your Country'
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                      // className="w-full border rounded-lg px-4 py-2"
                    />
                    {formErrors.countryOfOrigin && 
                      <p className="text-red-500 text-sm mt-1">{formErrors.countryOfOrigin}</p>
                    }
                  </div>

                  <div>
                    <label htmlFor="stateOfOrigin"  className="block mb-2">State of origin</label>
                    <Select
                      id="stateOfOrigin"
                      name="stateOfOrigin"
                      options={getStateOptions(formData.countryOfOrigin)} 
                      value={getStateOptions(formData.countryOfOrigin).find(s => s.label === formData.stateOfOrigin) || null}
                      onChange={(selected) => handleStateChange(selected, "stateOfOrigin")}
                      isDisabled={!formData.countryOfOrigin} // Disable if no country selected
                      className="react-select-container w-full"
                      classNamePrefix="react-select"
                      placeholder="Select your state"
                      isClearable
                      required
                    />
                    {formErrors.stateOfOrigin && 
                      <p className="text-red-500 text-sm mt-1">{formErrors.stateOfOrigin}</p>
                    }
                  </div>

                  <div>
                    <label htmlFor='countryOfResidence' className="block mb-2">Country of residence</label>
                    <Select
                      id="countryOfResidence"
                      name="countryOfResidence"
                      options={countryOptions} 
                      value={countryOptions.find(c => c.value === formData.countryOfResidence) || null}
                      onChange={(selected) => handleCountryChange(selected, "countryOfResidence")}
                      placeholder='Select your Country'
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                      // className="w-full border rounded-lg px-4 py-2"
                    />
                    {formErrors.countryOfResidence && 
                      <p className="text-red-500 text-sm mt-1">{formErrors.countryOfResidence}</p>
                    }
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="stateOfResidence"  className="block mb-2">State of residence</label>
                    <Select
                      id="stateOfResidence"
                      name="stateOfResidence"
                      options={getStateOptions(formData.countryOfResidence)} 
                      value={getStateOptions(formData.countryOfResidence).find(s => s.label === formData.stateOfResidence) || null}
                      onChange={(selected) => handleStateChange(selected, "stateOfResidence")}
                      isDisabled={!formData.countryOfResidence}
                      className="react-select-container w-full"
                      classNamePrefix="react-select"
                      placeholder="Select your state"
                      isClearable
                      required
                    />
                    {formErrors.stateOfResidence && 
                      <p className="text-red-500 text-sm mt-1">{formErrors.stateOfResidence}</p>
                    }
                  </div>

                  <div>
                    <label htmlFor='cityOfResidence' className="block mb-2">City of residence</label>
                    <input
                      type='text'
                      id='cityOfResidence'
                      name="cityOfResidence"
                      value={formData.cityOfResidence}
                      onChange={handleChange}
                      placeholder='Enter your city of residence'
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                    {error.cityOfResidence && <span className="text-red-500 text-sm mt-1">{error.cityOfResidence}</span>}
                  </div>
                  
                  <div>
                    <label htmlFor="maritalStatus"  className="block mb-2">Marital status</label>
                    <select
                      id='maritalStatus'
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    >
                  <option value="" disabled>Select your Marital status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Separated">Separated</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                    {error.maritalStatus && <span className="text-red-500 text-sm mt-1">{error.maritalStatus}</span>}
                  </div>
                 
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  <div>
                    <label htmlFor='occupation' className="block mb-2">Occupation</label>
                    <input
                      id='occupation'
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder='Enter your occupation'
                      required
                    />
                    {error.occupation && <span className="text-red-500 text-sm mt-1">{error.occupation}</span>}
                  </div>

                  <div>
                    <label htmlFor='learningTrack' className="block mb-2">Choose your Learning track</label>
                    <select
                      id='learningTrack'
                      name="learningTrack"
                      value={formData.learningTrack}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    >
                  <option value="" disabled>Choose a Learning track</option>
                  <option value="Frontend Web Development">Frontend Web Development</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="WordPress Technology">WordPress Technology</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Graphics Designing">Graphics Designing</option>
                  <option value="Microsoft Office Applications">Microsoft Office Applications</option>
                  <option value="Virtual Assistant">Virtual Assistant</option>
                  <option value="Customer Support">Customer Support</option>
                    </select>
                    {error.learningTrack && <span className="text-red-500 text-sm mt-1">{error.learningTrack}</span>}
                  </div>

                  <div>
                    <label htmlFor="computerLiteracy"  className="block mb-2">Computer literacy level</label>
                    <select
                      id='computerLiteracy'
                      name="computerLiteracy"
                      value={formData.computerLiteracy}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    >
                  <option value="" disabled>Select</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    {error.computerLiteracy && <span className="text-red-500 text-sm mt-1">{error.computerLiteracy}</span>}
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 
                  {/* Laptop Ownership */}
                  <div>
                    <label htmlFor='haveLaptop' className="block mb-2">Do you have a laptop for this training?</label>
                    <select
                      id='haveLaptop'
                      name="haveLaptop"
                      value={formData.haveLaptop}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    >
                      <option value="" disabled>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Smartphone Ownership */}
                  <div>
                    <label htmlFor='haveSmartPhone' className="block mb-2">Do you have access to a smartphone and internet data for the training?</label>
                    <select
                      id='haveSmartPhone'
                      name="haveSmartPhone"
                      value={formData.haveSmartPhone}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    >
                      <option value="" disabled>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                     {/* Opportunity Source */}
                     <div>
                    <label htmlFor='opportunitySource' className="block mb-2">How did you hear about this programme?</label>
                    <select
                      id='opportunitySource'
                      name="opportunitySource"
                      value={formData.opportunitySource}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    >
                      <option value="" disabled>Select</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friend/Referral">Friend/Referral</option>
                      <option value="Website">Website</option>
                      <option value="Email">Email</option>
                      <option value="Flyer/Poster">Flyer/Poster</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formData.opportunitySource === "Other" && (
                      <div>
                    <label htmlFor='otherOpportunitySource' className="block mb-2">Please tell us below</label>
                    <input
                      id='otherOpportunitySource'
                      type="text"
                      name="otherOpportunitySource"
                      value={formData.otherOpportunitySource}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="Please specify"
                      required
                    />
                    {error.otherOpportunitySource && <span className="text-red-500 text-sm mt-1">{error.otherOpportunitySource}</span>}
                  </div>
                   )}
                </div>

                  {/* Motivation */}
                  <div>
                    <label htmlFor='motivation' className="block mb-2">Write your motivation for choosing this learning track (max 100 words)</label>
                    <textarea
                      id='motivation'
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      maxLength={500} // Increased to allow typing while tracking
                      className="w-full border rounded-lg px-4 py-2 h-24"
                      placeholder="Explain why you're interested in this learning track..."
                      required
                      disabled={motivationWordCount >= 100}
                    />
                    <p className="text-sm text-gray-600">
                      {motivationWordCount}/100 words
                      {motivationWordCount >= 100 && " - Word limit reached"}
                    </p>
                  </div>           
              </div>
              

              {/* Submit Button */}
              <div className="text-center mt-8">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`bg-red-500 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
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

    {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}

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

// Success Modal Component
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Form Successfully Submitted</h2>
      <p>We will contact you shortly via email. Thank you!</p>
      <button 
        onClick={onClose} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
);