
import React from 'react';
import { Shield, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { View } from '../types';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  setView: (view: View) => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, setView }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in duration-700">
      <button 
        onClick={() => setView(View.HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-3 rounded-2xl text-slate-900">
              {isPrivacy ? <Shield size={32} /> : <FileText size={32} />}
            </div>
            <div>
              <h1 className="text-4xl font-bebas tracking-wide leading-tight">
                {isPrivacy ? 'Privacy' : 'Terms of'} <span className="text-amber-500">{isPrivacy ? 'Policy' : 'Service'}</span>
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Last Updated: October 2024</p>
            </div>
          </div>
        </div>

        <div className="p-10 prose prose-slate max-w-none text-slate-600 space-y-8">
          {isPrivacy ? (
            <>
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-amber-500" /> Information We Collect
                </h3>
                <p className="leading-relaxed">
                  We collect information necessary to process your block orders and partnership applications. This includes your name, factory location, contact details, and Mobile Money information for billing.
                </p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-amber-500" /> How We Use Your Data
                </h3>
                <p className="leading-relaxed">
                  Data is used to facilitate delivery within Greater Accra, verify factory certifications, and provide AI-driven construction consultation. We do not sell your personal data to third parties.
                </p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-amber-500" /> Security
                </h3>
                <p className="leading-relaxed">
                  Modegah utilizes industry-standard encryption for all transactions. User accounts (admin/modegah2024) are monitored to ensure portal integrity.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-amber-500" /> Delivery Limitations
                </h3>
                <p className="leading-relaxed font-bold text-slate-800">
                  Modegah Block Factory delivers exclusively to sites within the Greater Accra Region.
                </p>
                <p className="mt-2">
                  Orders placed for locations outside this boundary are subject to customer-arranged pickup at our Shai Hills facility.
                </p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-amber-500" /> Zero Breakage Guarantee
                </h3>
                <p className="leading-relaxed">
                  We guarantee that less than 2% of delivered blocks will arrive damaged. Breakage exceeding this threshold will be replaced free of charge by the originating partner factory.
                </p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-amber-500" /> Partnership Fees
                </h3>
                <p className="leading-relaxed">
                  Subscription fees for Standard, Premium, and Enterprise tiers are billed monthly via Mobile Money. Non-payment results in suspension from the order routing network.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-center">
          <button 
            onClick={() => setView(View.HOME)}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalView;
