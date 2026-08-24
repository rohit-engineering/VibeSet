import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Zap,
  CreditCard,
  Building2,
  Wallet,
  QrCode,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadDigitalAsset, generateDigitalInvoice } from '../utils/watermark';

export const RazorpayModal: React.FC = () => {
  const {
    razorpayCheckout,
    closeRazorpay,
    completePurchase,
    user,
    showToast,
    setActivePage
  } = useApp();

  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('892');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  // Processing & completion states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedPaymentId, setCompletedPaymentId] = useState('');
  const [invoiceText, setInvoiceText] = useState('');

  if (!razorpayCheckout?.isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setProcessingStep('Connecting to Razorpay Banking Gateway...');

    const simulatedPaymentId = `pay_RPZ_${Math.floor(10000000 + Math.random() * 90000000)}`;
    setCompletedPaymentId(simulatedPaymentId);

    setTimeout(() => {
      setProcessingStep('Authorizing 256-Bit SSL Payment...');
    }, 600);

    setTimeout(() => {
      setProcessingStep('Generating Digital License & Unlocking 4K Asset...');
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Generate invoice
      const invoice = generateDigitalInvoice(
        Math.floor(100000 + Math.random() * 900000).toString(),
        razorpayCheckout.itemTitle,
        razorpayCheckout.amount,
        simulatedPaymentId,
        user?.email || 'customer@digivault.in'
      );
      setInvoiceText(invoice);

      // Save order in context
      const methodMap = {
        upi: 'razorpay_upi',
        card: 'razorpay_card',
        netbanking: 'razorpay_netbanking',
        wallet: 'razorpay_wallet'
      } as const;

      completePurchase(simulatedPaymentId, methodMap[paymentTab]);
    }, 1800);
  };

  const handleDownloadInvoice = () => {
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DigiVault_Invoice_${completedPaymentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Invoice Downloaded 📄', 'Official tax invoice saved to your files.');
  };

  const handleInstantDownloadAsset = async () => {
    if (razorpayCheckout.targetProduct) {
      showToast('Downloading High-Res Asset', 'Saving clean 4K files to your device...', 'info');
      await downloadDigitalAsset(razorpayCheckout.targetProduct);
      showToast('Downloaded! 📥', 'File saved successfully.');
    } else {
      setActivePage('profile');
      closeRazorpay();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl border border-[#EEEEEE] overflow-hidden flex flex-col">
        {/* Razorpay Top Header Bar */}
        <div className="bg-[#1A1A1A] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFE5D9] text-[#7A4B3A] flex items-center justify-center font-serif font-bold text-lg">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base tracking-tight">DigiVault Digital Services</span>
                <span className="bg-white/10 text-[#FFE5D9] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/10">
                  Razorpay Verified
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">Order: {razorpayCheckout.itemTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-400 block">Amount Payable</span>
              <span className="text-lg sm:text-xl font-serif font-bold text-[#FFE5D9]">
                ₹{razorpayCheckout.amount.toFixed(2)}
              </span>
            </div>

            {!isProcessing && (
              <button
                onClick={closeRazorpay}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close Razorpay checkout"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          /* Payment Success & Instant Unlock Screen */
          <div className="p-6 sm:p-8 text-center space-y-5 bg-[#FAFAFA]">
            <div className="w-16 h-16 bg-[#D8E2DC] text-[#2C4A3E] rounded-full flex items-center justify-center mx-auto border border-[#C2D4C8] animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-[#2C4A3E] bg-[#D8E2DC] px-3 py-1 rounded-full uppercase tracking-wider">
                Payment Successful
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
                Instant Digital Delivery Unlocked!
              </h2>
              <p className="text-xs font-mono text-neutral-500 mt-1 max-w-md mx-auto">
                Your payment of <strong>₹{razorpayCheckout.amount}</strong> was confirmed via Razorpay. Reference ID: <code className="text-[#1A1A1A]">{completedPaymentId}</code>
              </p>
            </div>

            {/* Instant Action Cards */}
            <div className="p-5 bg-white rounded-2xl border border-[#EEEEEE] text-left space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Asset Title:</span>
                <span className="font-bold text-[#1A1A1A] font-serif">{razorpayCheckout.itemTitle}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Commercial License:</span>
                <span className="font-bold text-[#2C4A3E]">Active & Included (Lifetime)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Cloud CDN Delivery:</span>
                <span className="font-medium text-neutral-700">Stored in Your Digital Vault</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={handleInstantDownloadAsset}
                className="flex-1 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm py-3 rounded-full shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Download className="w-4 h-4 text-[#FFE5D9]" />
                <span>Download Clean 4K File Now</span>
              </button>

              <button
                onClick={handleDownloadInvoice}
                className="bg-white hover:bg-[#FAFAFA] text-neutral-700 font-mono font-medium text-xs py-3 px-4 rounded-full border border-[#EEEEEE] flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#1A1A1A]" />
                <span>Tax Invoice</span>
              </button>
            </div>

            <button
              onClick={() => {
                setActivePage('profile');
                closeRazorpay();
              }}
              className="text-xs font-mono text-neutral-600 hover:text-black inline-flex items-center gap-1"
            >
              <span>Go to My Digital Library</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : isProcessing ? (
          /* Processing Spinner Screen */
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-neutral-200 border-t-[#1A1A1A] rounded-full animate-spin mx-auto" />
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Processing Your Payment</h3>
            <p className="text-xs font-mono text-neutral-500 animate-pulse">{processingStep}</p>
            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-neutral-400 pt-4">
              <Lock className="w-3.5 h-3.5 text-[#2C4A3E]" />
              <span>Secured by Razorpay 256-Bit Bank Level Encryption</span>
            </div>
          </div>
        ) : (
          /* Main Payment Options Interface */
          <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[360px]">
            {/* Left Tabs (4 cols) */}
            <div className="sm:col-span-4 bg-[#FAFAFA] border-r border-[#EEEEEE] p-2 sm:p-3 flex sm:flex-col gap-1 overflow-x-auto">
              <button
                onClick={() => setPaymentTab('upi')}
                className={`w-full text-left px-3 py-2 rounded-full text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
                  paymentTab === 'upi'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-[#EEEEEE]'
                }`}
              >
                <QrCode className="w-4 h-4 shrink-0" />
                <span>UPI / QR Code</span>
              </button>

              <button
                onClick={() => setPaymentTab('card')}
                className={`w-full text-left px-3 py-2 rounded-full text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
                  paymentTab === 'card'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-[#EEEEEE]'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setPaymentTab('netbanking')}
                className={`w-full text-left px-3 py-2 rounded-full text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
                  paymentTab === 'netbanking'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-[#EEEEEE]'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>NetBanking</span>
              </button>

              <button
                onClick={() => setPaymentTab('wallet')}
                className={`w-full text-left px-3 py-2 rounded-full text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
                  paymentTab === 'wallet'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-[#EEEEEE]'
                }`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <span>Wallets</span>
              </button>
            </div>

            {/* Right Tab Content (8 cols) */}
            <div className="sm:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-4">
              {/* UPI Tab */}
              {paymentTab === 'upi' && (
                <div className="space-y-4">
                  <p className="text-xs font-serif font-bold text-neutral-800">Scan QR Code or Select UPI App</p>

                  {/* Simulated QR Code */}
                  <div className="bg-[#FAFAFA] p-3 rounded-2xl border border-[#EEEEEE] flex items-center gap-4">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-[#EEEEEE] flex items-center justify-center shrink-0 shadow-xs">
                      {/* SVG QR Code Simulation */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900 fill-current">
                        <rect width="30" height="30" />
                        <rect x="70" width="30" height="30" />
                        <rect y="70" width="30" height="30" />
                        <rect x="8" y="8" width="14" height="14" fill="#FFFFFF" />
                        <rect x="78" y="8" width="14" height="14" fill="#FFFFFF" />
                        <rect x="8" y="78" width="14" height="14" fill="#FFFFFF" />
                        <rect x="12" y="12" width="6" height="6" />
                        <rect x="82" y="12" width="6" height="6" />
                        <rect x="12" y="82" width="6" height="6" />
                        <rect x="40" y="20" width="10" height="20" />
                        <rect x="50" y="40" width="20" height="10" />
                        <rect x="40" y="70" width="15" height="15" />
                        <rect x="60" y="65" width="20" height="20" />
                      </svg>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-mono font-bold text-neutral-900 block">Instant 0-Fee UPI QR</span>
                      <p className="text-neutral-500 text-[11px]">
                        Scan with Google Pay, PhonePe, Paytm, or any BHIM UPI app on your phone.
                      </p>
                      <span className="text-[10px] font-mono font-bold text-[#2C4A3E] bg-[#D8E2DC] px-2 py-0.5 rounded-full inline-block">
                        ⚡ Instant 4K Unlock
                      </span>
                    </div>
                  </div>

                  {/* UPI Apps Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', name: 'GPay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm' },
                      { id: 'bhim', name: 'BHIM' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2 rounded-full border text-center transition-all ${
                          selectedUpiApp === app.id
                            ? 'border-black bg-black text-white'
                            : 'border-[#EEEEEE] hover:border-black/30 text-neutral-700 bg-[#FAFAFA]'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold block">{app.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom UPI ID */}
                  <div>
                    <input
                      type="text"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="Or enter UPI ID (e.g. yourname@okhdfcbank)"
                      className="w-full text-xs p-2.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-full focus:outline-none focus:border-black px-3.5 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Cards Tab */}
              {paymentTab === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-mono font-bold text-neutral-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-full font-mono text-neutral-800 px-3.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-mono font-bold text-neutral-700 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-full font-mono text-neutral-800 px-3.5"
                      />
                    </div>
                    <div>
                      <label className="font-mono font-bold text-neutral-700 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full p-2.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-full font-mono text-neutral-800 px-3.5"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-neutral-500 flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2C4A3E]" />
                    <span>Supports Visa, Mastercard, RuPay, Maestro & Amex</span>
                  </p>
                </div>
              )}

              {/* NetBanking Tab */}
              {paymentTab === 'netbanking' && (
                <div className="space-y-3">
                  <p className="text-xs font-serif font-bold text-neutral-800">Select Your Bank</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(
                      (bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-2xl border text-left text-xs font-mono transition-all ${
                            selectedBank === bank
                              ? 'border-black bg-black text-white font-bold'
                              : 'border-[#EEEEEE] hover:bg-[#FAFAFA] text-neutral-700'
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Wallets Tab */}
              {paymentTab === 'wallet' && (
                <div className="space-y-3">
                  <p className="text-xs font-serif font-bold text-neutral-800">Select Digital Wallet</p>
                  <div className="space-y-2">
                    {['Paytm Wallet', 'PhonePe Wallet', 'Mobikwik Wallet', 'Amazon Pay'].map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWallet(w)}
                        className={`w-full p-2.5 rounded-2xl border text-left text-xs flex items-center justify-between transition-all font-mono ${
                          selectedWallet === w
                            ? 'border-black bg-black text-white font-bold'
                            : 'border-[#EEEEEE] hover:bg-[#FAFAFA] text-neutral-700'
                        }`}
                      >
                        <span>{w}</span>
                        {selectedWallet === w && <CheckCircle2 className="w-4 h-4 text-[#FFE5D9]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Pay Button & Trust Footer */}
              <div className="pt-2 border-t border-[#EEEEEE] space-y-2">
                <button
                  onClick={handlePayNow}
                  className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm py-3 rounded-full shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-[#FFE5D9] fill-[#FFE5D9]" />
                  <span>Pay ₹{razorpayCheckout.amount.toFixed(2)} via Razorpay</span>
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#2C4A3E]" />
                    256-Bit SSL
                  </span>
                  <span>•</span>
                  <span>PCI-DSS Certified</span>
                  <span>•</span>
                  <span>Instant Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
