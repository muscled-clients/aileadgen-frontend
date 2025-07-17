'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedCTAButton from '@/components/AnimatedCTAButton';
import ConditionalForm from '@/components/ConditionalForm';

interface LandingPageData {
  niche: {
    name: string;
    slug: string;
  };
  landing_page: {
    headline: string;
    subheadline: string;
    video_url: string;
    cta_text: string;
  };
  pain_points: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  social_proof: Array<{
    stat_number: string;
    stat_text: string;
  }>;
  testimonials: Array<{
    name: string;
    company: string;
    text: string;
    result_metric: string;
  }>;
  cta_offer: {
    offer_title: string;
    benefits: string[];
    guarantee_text: string;
    button_text: string;
  };
}

export default function LandingPage() {
  const params = useParams();
  const niche = params.niche as string;
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // For now, using mock data for Real Estate
    const mockData: LandingPageData = {
      niche: {
        name: "Real Estate",
        slug: "real-estate"
      },
      landing_page: {
        headline: "Stop Chasing Cold Leads - Get Ready-to-Buy Clients Calling You",
        subheadline: "Our AI calls 500+ prospects daily and only sends you qualified buyers with $500K+ budgets",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        cta_text: "Get My First 10 Qualified Buyers FREE"
      },
      pain_points: [
        {
          title: "Spending $3K/month on Zillow leads that never convert",
          description: "You're paying premium prices for leads that 20 other agents are also calling",
          icon: "💸"
        },
        {
          title: "Competing with 50+ agents for the same tired leads",
          description: "Every lead source is oversaturated with desperate agents fighting for scraps",
          icon: "👥"
        },
        {
          title: "Wasting hours calling prospects who aren't ready to buy",
          description: "Most leads are just browsing or won't be ready for 6-12 months",
          icon: "⏰"
        }
      ],
      social_proof: [
        {
          stat_number: "2,847",
          stat_text: "Qualified Buyers Connected This Month"
        },
        {
          stat_number: "87%",
          stat_text: "Of Our Leads Are Ready to Buy Within 30 Days"
        },
        {
          stat_number: "$2.3M",
          stat_text: "Average Commission Generated Per Agent Monthly"
        }
      ],
      testimonials: [
        {
          name: "Sarah Johnson",
          company: "Keller Williams",
          text: "I went from 2 closings per month to 8 closings per month. The AI only sends me buyers who are pre-qualified and ready to move forward.",
          result_metric: "Closed 12 deals in 60 days"
        },
        {
          name: "Mike Rodriguez",
          company: "RE/MAX",
          text: "This completely changed my business. I used to spend 4 hours daily cold calling. Now I spend that time with actual buyers viewing properties.",
          result_metric: "Increased income by 300%"
        },
        {
          name: "Jennifer Chen",
          company: "Coldwell Banker",
          text: "The best investment I've ever made. The AI brings me qualified leads while I focus on what I do best - closing deals.",
          result_metric: "Generated $1.2M in commissions"
        }
      ],
      cta_offer: {
        offer_title: "Get Your First 10 Qualified Buyers FREE",
        benefits: [
          "Custom AI trained specifically for your market area",
          "500+ calls made in first 48 hours",
          "Only pre-qualified buyers with $500K+ budgets",
          "Appointments booked directly to your calendar",
          "No setup fees or hidden costs"
        ],
        guarantee_text: "If you don't get at least 5 qualified appointments in 30 days, we'll refund everything and pay you $500 for your time",
        button_text: "Claim My 10 Free Qualified Buyers Now"
      }
    };

    setPageData(mockData);
    setLoading(false);
  }, [niche]);

  const handleCTAClick = () => {
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">Page not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {pageData.landing_page.headline}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {pageData.landing_page.subheadline}
          </motion.p>
          
          {/* Video */}
          <motion.div 
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={pageData.landing_page.video_url}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                title="AI Lead Gen Demo"
              />
            </div>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AnimatedCTAButton
              text={pageData.landing_page.cta_text}
              onClick={handleCTAClick}
              className="mb-8"
            />
          </motion.div>
          
          {/* Social Proof Numbers */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {pageData.social_proof.map((proof, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{proof.stat_number}</div>
                <div className="text-sm text-blue-200">{proof.stat_text}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stop Wasting Money on Leads That Never Close
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You're working harder than ever but getting fewer results. Here's why traditional lead generation is broken for real estate agents:
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pageData.pain_points.map((pain, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-6xl mb-4">{pain.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{pain.title}</h3>
                <p className="text-gray-600">{pain.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Your AI Real Estate Assistant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI doesn't just generate leads - it pre-qualifies them, nurtures them, and only sends you buyers who are ready to move forward.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Calls 500+ Prospects Daily</h3>
              <p className="text-gray-600">Never miss a lead again. Our AI works 24/7 to identify and contact potential buyers in your area.</p>
            </motion.div>
            
            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pre-Qualifies by Budget & Timeline</h3>
              <p className="text-gray-600">Only talk to prospects who have the budget and are ready to buy within 30-90 days.</p>
            </motion.div>
            
            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Books Appointments Directly</h3>
              <p className="text-gray-600">Qualified prospects are automatically scheduled into your calendar. No more phone tag.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Estate Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See how agents are using AI to 10X their lead generation and close more deals
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pageData.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <div className="font-semibold text-green-600 mb-2">{testimonial.result_metric}</div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-blue-600">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {pageData.cta_offer.offer_title}
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 text-blue-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Limited Time: We're onboarding only 50 agents this month
          </motion.p>
          
          <motion.div 
            className="max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4">Here's What You Get:</h3>
              <ul className="text-left space-y-2">
                {pageData.cta_offer.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4 mb-8">
              <p className="text-sm font-semibold">
                <strong>100% Risk-Free Guarantee:</strong> {pageData.cta_offer.guarantee_text}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <AnimatedCTAButton
              text={pageData.cta_offer.button_text}
              onClick={handleCTAClick}
              className="mb-4"
            />
            <p className="text-sm text-blue-200">
              ⚡ Setup takes less than 5 minutes • No credit card required
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Conditional Form Modal */}
      {showForm && (
        <ConditionalForm 
          onClose={() => setShowForm(false)}
          calendlyLink="https://calendly.com/muscled/ai-lead-gen-set-100-qualified-leads-per-month-clone"
        />
      )}
    </div>
  );
}