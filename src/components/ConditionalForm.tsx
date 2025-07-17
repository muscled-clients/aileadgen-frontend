'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '@/lib/config';

interface FormData {
  isSerious: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyRevenue: string;
  painPoint: string;
  marketingBudget: string;
}

interface LeadResponse {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  completion_status: string;
  [key: string]: any;
}

interface ConditionalFormProps {
  onClose: () => void;
  calendlyLink?: string;
}

interface ValidationErrors {
  email?: string;
  phone?: string;
}

export default function ConditionalForm({ onClose, calendlyLink = "https://calendly.com/your-calendar" }: ConditionalFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    isSerious: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    monthlyRevenue: '',
    painPoint: '',
    marketingBudget: ''
  });
  const [isRejected, setIsRejected] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [isQualified, setIsQualified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters except leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Remove + if it exists and get just the digits
    const digitsOnly = cleaned.replace(/^\+/, '');
    
    // Accept 10 digits (US) or 11 digits (US with country code)
    return digitsOnly.length === 10 || digitsOnly.length === 11;
  };

  const createLead = async (retryAttempt = 0): Promise<string | null> => {
    try {
      setApiError(null);
      const leadData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        is_serious: formData.isSerious,
        niche: "real-estate",
        completion_status: "incomplete"
      };
      
      const response = await fetch(getApiUrl('/api/leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create lead');
      }
      
      const result: LeadResponse = await response.json();
      console.log('Lead created successfully:', result);
      setRetryCount(0); // Reset retry count on success
      return result.id;
      
    } catch (error) {
      console.error('Error creating lead:', error);
      
      // Retry logic with exponential backoff
      if (retryAttempt < 3) {
        const delayMs = Math.pow(2, retryAttempt) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return createLead(retryAttempt + 1);
      }
      
      setApiError(error instanceof Error ? error.message : 'Failed to create lead');
      setRetryCount(retryAttempt);
      return null;
    }
  };

  const updateLead = async (leadId: string, updateData: any): Promise<boolean> => {
    try {
      setApiError(null);
      const response = await fetch(getApiUrl(`/api/leads/${leadId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update lead');
      }
      
      const result: LeadResponse = await response.json();
      console.log('Lead updated successfully:', result);
      return true;
      
    } catch (error) {
      console.error('Error updating lead:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to update lead');
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Validate email and phone before proceeding
      const errors: ValidationErrors = {};
      
      if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
      
      setValidationErrors({});
      
      // Create lead with contact info after step 2
      if (!leadId) {
        setIsSubmitting(true);
        const newLeadId = await createLead();
        setIsSubmitting(false);
        
        if (newLeadId) {
          setLeadId(newLeadId);
        } else {
          // Handle creation failure - show error but allow retry
          console.error('Failed to create lead, but allowing user to continue');
        }
      }
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateLeadWithStep = async (stepData: any) => {
    if (!leadId) {
      console.error('No lead ID available for update');
      return false;
    }
    
    return await updateLead(leadId, stepData);
  };

  const handleSubmit = async () => {
    if (isSubmitting || !leadId) return;
    
    setIsSubmitting(true);
    
    try {
      // Final update with completion status
      const finalUpdateData = {
        completion_status: "complete",
        qualified: isQualified
      };
      
      const success = await updateLead(leadId, finalUpdateData);
      
      if (success) {
        console.log('Lead qualification completed successfully');
      } else {
        console.error('Failed to complete lead qualification');
      }
      
    } catch (error) {
      console.error('Error completing lead qualification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkQualification = async (selectedBudget: string) => {
    if (isSubmitting || hasSubmitted) return;
    
    // Update form data first
    const updatedFormData = { ...formData, marketingBudget: selectedBudget };
    setFormData(updatedFormData);
    
    // Revenue check
    if (updatedFormData.monthlyRevenue === 'Under $20K') {
      // Update lead with rejection reason
      if (leadId) {
        await updateLeadWithStep({
          marketing_budget: selectedBudget,
          qualified: false,
          completion_status: "complete"
        });
      }
      setIsRejected(true);
      setRejectionMessage("Thanks for your interest! We'll contact you when we expand to businesses under $20K monthly revenue.");
      return;
    }
    
    // Budget check
    if (selectedBudget === 'Less than $2K') {
      // Update lead with rejection reason
      if (leadId) {
        await updateLeadWithStep({
          marketing_budget: selectedBudget,
          qualified: false,
          completion_status: "complete"
        });
      }
      setIsRejected(true);
      setRejectionMessage("Thanks for your interest! We'll contact you when we have solutions for smaller advertising budgets.");
      return;
    }
    
    // Qualified! Update lead with final data
    setIsQualified(true);
    setHasSubmitted(true); // Mark as submitted to prevent duplicates
    
    if (leadId) {
      await updateLeadWithStep({
        marketing_budget: selectedBudget,
        qualified: true,
        completion_status: "complete"
      });
    }
    
    setCurrentStep(6); // Move to Calendly step immediately
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-black">Quick Question...</h2>
            <p className="text-xl mb-8 text-gray-800">Are you serious about using our AI LEAD GEN system to set 100 appointments per month?</p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setFormData({...formData, isSerious: 'Yes'});
                  handleNext();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
              >
                Yes, I'm ready to scale my business
              </button>
              <button
                onClick={() => {
                  setIsRejected(true);
                  setRejectionMessage("Thanks for your interest! Feel free to come back when you're ready to scale.");
                }}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-4 px-6 rounded-lg transition-colors"
              >
                No, just looking around
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-black">Great! Let's get your information:</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (validationErrors.email) {
                      setValidationErrors({...validationErrors, email: undefined});
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                    validationErrors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (validationErrors.phone) {
                      setValidationErrors({...validationErrors, phone: undefined});
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                    validationErrors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="+1 (555) 123-4567"
                  required
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>
              {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              )}
              <button
                onClick={handleNext}
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-black">Revenue Qualification</h2>
            <p className="text-lg text-gray-800 mb-6">What's your monthly revenue for the last 3 months? We only work with people who can deliver services and generate at least $40,000/month.</p>
            <div className="space-y-3">
              {[
                'Under $20K',
                '$20K - $40K', 
                '$40K - $80K',
                '$80K+'
              ].map((option) => (
                <button
                  key={option}
                  onClick={async () => {
                    setFormData({...formData, monthlyRevenue: option});
                    
                    // Update lead with revenue data
                    if (leadId) {
                      await updateLeadWithStep({
                        monthly_revenue: option,
                        completion_status: "partial"
                      });
                    }
                    
                    if (option === 'Under $20K') {
                      // Update lead with rejection
                      if (leadId) {
                        await updateLeadWithStep({
                          qualified: false,
                          completion_status: "complete"
                        });
                      }
                      setIsRejected(true);
                      setRejectionMessage("Thanks for your interest! We'll contact you when we expand to businesses under $20K monthly revenue.");
                    } else {
                      handleNext();
                    }
                  }}
                  className="w-full bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-black">What's your biggest lead generation challenge?</h2>
            <div className="space-y-3">
              {[
                'Too few leads',
                'Poor quality leads',
                'Leads are too expensive',
                'Too much competition'
              ].map((option) => (
                <button
                  key={option}
                  onClick={async () => {
                    setFormData({...formData, painPoint: option});
                    
                    // Update lead with pain point data
                    if (leadId) {
                      await updateLeadWithStep({
                        pain_point: option,
                        completion_status: "partial"
                      });
                    }
                    
                    handleNext();
                  }}
                  className="w-full bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-black">How much can you spend on paid ads per month?</h2>
            <div className="space-y-3">
              {[
                'Less than $2K',
                '$2K - $5K',
                '$5K - $10K',
                '$10K - $20K',
                '$20K - $30K',
                '$30K+'
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    checkQualification(option);
                  }}
                  disabled={isSubmitting || hasSubmitted}
                  className="w-full bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-600">Congratulations! You're Qualified!</h2>
            <p className="text-gray-600 mb-6">
              Hi {formData.firstName}! You meet all our criteria. Let's schedule your strategy call to get your AI system set up.
            </p>
            
            {/* Calendly Embed */}
            <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                src={calendlyLink}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule a Call"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isRejected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          className="bg-white p-8 rounded-lg max-w-md w-full mx-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Not Quite Ready</h3>
            <p className="text-gray-600 mb-6">{rejectionMessage}</p>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of 5</span>
            <span>{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[400px] flex items-center justify-center">
          {isSubmitting ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Submitting your information...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && currentStep < 6 && !isSubmitting && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}