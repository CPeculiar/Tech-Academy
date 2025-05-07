import React, { useState } from 'react';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Facebook, Instagram,  X, Phone, Mail, CheckCircle } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa'; 
import { Country, State } from "country-state-city";
import { submitApplication } from "../services/firestore";
import { doc, setDoc } from "firebase/firestore";
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
  const [currentStep, setCurrentStep] = useState(1);
   const navigate = useNavigate();


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

  const validateStep = () => {
    let errors = {};

    switch(currentStep) {
      case 1:
        if (!formData.firstName.trim()) errors.firstName = 'First Name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last Name is required';
        if (!formData.middleName.trim()) errors.middleName = 'Middle Name is required';
        if (!formData.gender.trim()) errors.gender = 'Gender is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required';
        break;
      
      case 2:
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) 
          errors.email = 'Valid email is required';
        if (validatePhoneNumber(formData.phone)) {
          errors.phone = validatePhoneNumber(formData.phone);
        }
        if (!formData.countryOfOrigin) errors.countryOfOrigin = 'Country of Origin is required';
        if (!formData.stateOfOrigin) errors.stateOfOrigin = 'State of Origin is required';
        break;
      
      case 3:
        if (!formData.countryOfResidence) errors.countryOfResidence = 'Country of Residence is required';
        if (!formData.stateOfResidence) errors.stateOfResidence = 'State of Residence is required';
        if (!formData.cityOfResidence) errors.cityOfResidence = 'City of Residence is required';
        if (!formData.maritalStatus) errors.maritalStatus = 'Marital Status is required';
        break;
      
      case 4:
        if (!formData.occupation) errors.occupation = 'Occupation is required';
        if (!formData.learningTrack) errors.learningTrack = 'Learning Track is required';
        if (!formData.computerLiteracy) errors.computerLiteracy = 'Computer Literacy is required';
        break;
      
      case 5:
        if (!formData.motivation || formData.motivation.trim().length === 0) 
          errors.motivation = 'Motivation is required';
        if (!formData.haveLaptop) errors.haveLaptop = 'Laptop information is required';
        if (!formData.haveSmartPhone) errors.haveSmartPhone = 'Smartphone information is required';
        if (!formData.opportunitySource) errors.opportunitySource = 'Opportunity Source is required';
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsLoading(true);

    if (validateStep()) {
      try {
        const applicationId = await submitApplication(formData);
        setShowSuccessModal(true);
        // Reset form and other states
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
        setFormErrors({ form: `Registration failed: ${error.message}` });
      } finally {
        setIsLoading(false);
      }
    } else {
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

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const getStateOptions = (countryIso) => {
    if (!countryIso) return [];
    return State.getStatesOfCountry(countryIso).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.firstName && 
                  <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                }
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.lastName && 
                  <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                }
              </div>
              <div>
                <label>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.middleName && 
                  <p className="text-red-500 text-sm">{formErrors.middleName}</p>
                }
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className='w-full'>
                <label>Gender</label>
                <div className="flex space-x-4">
                <label className="inline-flex items-center border rounded-lg w-full px-4 py-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                      className="form-radio mr-2"
                    />
                    Male
                  </label>
                  <label className="inline-flex items-center border rounded-lg w-full  px-4 py-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                      className="form-radio mr-2"
                    />
                    Female
                  </label>
                </div>
                {formErrors.gender && 
                  <p className="text-red-500 text-sm">{formErrors.gender}</p>
                }
              </div>
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.dateOfBirth && 
                  <p className="text-red-500 text-sm">{formErrors.dateOfBirth}</p>
                }
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.email && 
                  <p className="text-red-500 text-sm">{formErrors.email}</p>
                }
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.phone && 
                  <p className="text-red-500 text-sm">{formErrors.phone}</p>
                }
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Country of Origin</label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(c => c.value === formData.countryOfOrigin) || null}
                  onChange={(selected) => handleCountryChange(selected, "countryOfOrigin")}
                  placeholder="Select Country"
                />
                {formErrors.countryOfOrigin && 
                  <p className="text-red-500 text-sm">{formErrors.countryOfOrigin}</p>
                }
              </div>
              <div>
                <label>State of Origin</label>
                <Select
                  options={getStateOptions(formData.countryOfOrigin)}
                  value={getStateOptions(formData.countryOfOrigin).find(s => s.label === formData.stateOfOrigin) || null}
                  onChange={(selected) => handleStateChange(selected, "stateOfOrigin")}
                  isDisabled={!formData.countryOfOrigin}
                  placeholder="Select State"
                />
                {formErrors.stateOfOrigin && 
                  <p className="text-red-500 text-sm">{formErrors.stateOfOrigin}</p>
                }
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Residence Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Country of Residence</label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(c => c.value === formData.countryOfResidence) || null}
                  onChange={(selected) => handleCountryChange(selected, "countryOfResidence")}
                  placeholder="Select Country"
                />
                {formErrors.countryOfResidence && 
                  <p className="text-red-500 text-sm">{formErrors.countryOfResidence}</p>
                }
              </div>
              <div>
                <label>State of Residence</label>
                <Select
                  options={getStateOptions(formData.countryOfResidence)}
                  value={getStateOptions(formData.countryOfResidence).find(s => s.label === formData.stateOfResidence) || null}
                  onChange={(selected) => handleStateChange(selected, "stateOfResidence")}
                  isDisabled={!formData.countryOfResidence}
                  placeholder="Select State"
                />
                {formErrors.stateOfResidence && 
                  <p className="text-red-500 text-sm">{formErrors.stateOfResidence}</p>
                }
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>City of Residence</label>
                <input
                  type="text"
                  name="cityOfResidence"
                  value={formData.cityOfResidence}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.cityOfResidence && 
                  <p className="text-red-500 text-sm">{formErrors.cityOfResidence}</p>
                }
              </div>
              <div>
                <label>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Separated">Separated</option>
                  <option value="Widowed">Widowed</option>
                </select>
                {formErrors.maritalStatus && 
                  <p className="text-red-500 text-sm">{formErrors.maritalStatus}</p>
                }
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {formErrors.occupation && 
                  <p className="text-red-500 text-sm">{formErrors.occupation}</p>
                }
              </div>
              <div>
                <label>Learning Track</label>
                <select
                  name="learningTrack"
                  value={formData.learningTrack}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="" disabled>Select Learning Track</option>
                  <option value="Frontend Web Development">Frontend Web Development</option>
                  <option value="Data Analysis">Data Analysis</option>
                  {/* <option value="WordPress Technology">WordPress Technology</option> */}
                  <option value="Graphics Designing">Graphics Designing</option>
                  <option value="Microsoft Office Applications">Microsoft Office Applications</option>
                  <option value="Virtual Assistant">Virtual Assistant</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Printing and Branding">Printing and Branding</option>

                </select>
                {formErrors.learningTrack && 
                  <p className="text-red-500 text-sm">{formErrors.learningTrack}</p>
                }
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Computer Literacy</label>
                <select
                  name="computerLiteracy"
                  value={formData.computerLiteracy}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {formErrors.computerLiteracy && 
                  <p className="text-red-500 text-sm">{formErrors.computerLiteracy}</p>
                }
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Additional Information</h3>
            <div>
              <label>Motivation (max 100 words)</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                maxLength={500}
                className="w-full border rounded-lg px-4 py-2 h-24"
                placeholder="Explain why you're interested in this learning track..."
              />
              <p className="text-sm text-gray-600">
                {motivationWordCount}/100 words
                {motivationWordCount >= 100 && " - Word limit reached"}
              </p>
              {formErrors.motivation && 
                <p className="text-red-500 text-sm">{formErrors.motivation}</p>
              }
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Do you have a laptop?</label>
                <select
                  name="haveLaptop"
                  value={formData.haveLaptop}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {formErrors.haveLaptop && 
                  <p className="text-red-500 text-sm">{formErrors.haveLaptop}</p>
                }
              </div>
              <div>
                <label>Do you have a smartphone?</label>
                <select
                  name="haveSmartPhone"
                  value={formData.haveSmartPhone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {formErrors.haveSmartPhone && 
                  <p className="text-red-500 text-sm">{formErrors.haveSmartPhone}</p>
                }
              </div>
            </div>
            <div>
              <label>How did you hear about this program?</label>
              <select
                name="opportunitySource"
                value={formData.opportunitySource}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Select</option>
                <option value="Social Media">Social Media</option>
                <option value="Friend/Referral">Friend/Referral</option>
                <option value="Website">Website</option>
                <option value="Email">Email</option>
                <option value="Flyer/Poster">Flyer/Poster</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.opportunitySource && 
                <p className="text-red-500 text-sm">{formErrors.opportunitySource}</p>
              }
              {formData.opportunitySource === "Other" && (
                <div className="mt-2">
                  <label>Please specify</label>
                  <input
                    type="text"
                    name="otherOpportunitySource"
                    value={formData.otherOpportunitySource}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Please provide details"
                  />
                </div>
              )}
            </div>
          </div>
        );

        case 6:
          return (
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold">Review Your Information</h3>
              <div className="bg-gray-100 p-6 rounded-lg text-left">
                <h4 className="text-xl font-bold mb-3">Personal Details</h4>
                <p>Name: {formData.firstName} {formData.middleName} {formData.lastName}</p>
                <p>Gender: {formData.gender}</p>
                <p>Date of Birth: {formData.dateOfBirth}</p>
  
                <h4 className="text-xl font-bold mt-4 mb-3">Contact Information</h4>
                <p>Email: {formData.email}</p>
                <p>Phone: {formData.phone}</p>
                <p>Country of Origin: {formData.countryOfOrigin}</p>
                <p>State of Origin: {formData.stateOfOrigin}</p>
  
                <h4 className="text-xl font-bold mt-4 mb-3">Residence Information</h4>
                <p>Country of Residence: {formData.countryOfResidence}</p>
                <p>State of Residence: {formData.stateOfResidence}</p>
                <p>City of Residence: {formData.cityOfResidence}</p>
                <p>Marital Status: {formData.maritalStatus}</p>
  
                <h4 className="text-xl font-bold mt-4 mb-3">Professional Details</h4>
                <p>Occupation: {formData.occupation}</p>
                <p>Learning Track: {formData.learningTrack}</p>
                <p>Computer Literacy: {formData.computerLiteracy}</p>
  
                <h4 className="text-xl font-bold mt-4 mb-3">Additional Information</h4>
                <p>Motivation: {formData.motivation}</p>
                <p>Have Laptop: {formData.haveLaptop}</p>
                <p>Have Smartphone: {formData.haveSmartPhone}</p>
                <p>Opportunity Source: {formData.opportunitySource}</p>
              </div>
            </div>
          );
        
        default:
          return null;
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        <section className="py-16 bg-gray-300 text-black">
          <div className="container mx-auto px-4 pt-32 md:pt-16 pb-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
            Application Form
          </h2>
              
              <div className="flex justify-center mb-4 md:mb-6">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div 
                    key={step} 
                    className={`w-6 h-6 md:w-10 md:h-10 mx-1 md:mx-2 flex items-center justify-center rounded-full text-xs md:text-base
                  ${currentStep === step 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-300 text-gray-700'
                  }`}
              >
                {step}
              </div>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-4 md:p-8  shadow-lg">
                {renderStep()}
                
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-6 space-y-reverse space-y-4 sm:space-y-0">
              {currentStep > 1 && currentStep < 6 && (
                    <button 
                      type="button" 
                      onClick={prevStep} 
                     className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                      Previous
                    </button>
                  )}
                  
                  {currentStep < 6 && (
                    <button 
                      type="button" 
                      onClick={nextStep} 
                     className="w-full sm:w-auto sm:ml-auto bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                 >
                      Next
                    </button>
                  )}
                  
                  {currentStep === 6 && (
                  <div className='flex justify-center w-full md:w-auto'>
                  <div></div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                       className={`w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
          
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
        </section>
  
        {showSuccessModal && (
          <SuccessModal onClose={() => {
          setShowSuccessModal(false);
          navigate('/');
           }} />
        )}
      </div>
    );
  }
  
  // SuccessModal Component (same as before)
  const SuccessModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-green-500 p-4">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Form Successfully Submitted</h2>
        <p>We will contact you shortly via email. Thank you!</p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
 
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
