import React, { useState } from 'react';
import { Localized } from '../context/Localized';
import { useLanguage } from '../context/LanguageContext';
import { useProduct } from '../context/ProductContext';
import { CheckCircle, Share2, RefreshCw, ShoppingCart, ShieldCheck, Tag, Ruler, MapPin, Layers, X, PackageCheck } from 'lucide-react';

interface FinalListingProps {
  onRestart: () => void;
}

export const FinalListing: React.FC<FinalListingProps> = ({ onRestart }) => {
  const { product } = useProduct();
  const { language } = useLanguage();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [demoOrderId, setDemoOrderId] = useState('');

  const handleDemoBuy = () => {
    // Demo-only confirmation: no payment or real order is created.
    setDemoOrderId(`CL-DEMO-${Date.now().toString().slice(-6)}`);
    setOrderPlaced(true);
  };

  const handleShare = () => {
    const text = `${language === 'ta' ? product.titleTamil : product.titleEnglish}\n\n${language === 'ta' ? product.descriptionTamil : product.descriptionEnglish}\n\n₹${product.artisanStatedPrice || product.recommendedPrice}`;
    if (navigator.share) {
      navigator.share({ title: language === 'ta' ? product.titleTamil : product.titleEnglish, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const details = [
    { icon: Tag,    label: 'Material',      value: product.material             },
    { icon: Ruler,  label: 'Dimensions',    value: product.dimensions           },
    { icon: Layers, label: 'Craftsmanship', value: product.craftsmanshipDetails },
    { icon: MapPin, label: 'Origin',        value: product.origin               },
  ].filter((d) => d.value && !d.value.toLowerCase().includes('not provided'));

  return (
    <Localized>
    
    <div className="cl-container" style={{ padding: '40px 24px' }}>
      {/* Success banner */}
      <div className="text-center mb-8">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: 'var(--cl-success-bg)', border: '1px solid rgba(42,111,66,0.3)' }}
        >
          <CheckCircle className="w-6 h-6" style={{ color: 'var(--cl-success)' }} />
        </div>
        <h1 className="cl-h1">Marketplace Ready Listing</h1>
        <p className="cl-body mt-1" style={{ maxWidth: 480, margin: '6px auto 0' }}>
          Verified and priced for immediate publishing on e-commerce platforms.
        </p>
      </div>

      {/* Main card */}
      <div className="cl-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div style={{ background: 'var(--cl-ivory)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl ? (
              <img
                src={product.catalogueImageUrl || product.imageUrl}
                alt="Final craft product"
                style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: 420 }}
              />
            ) : (
              <div className="w-full h-72 flex items-center justify-center">
                <Layers className="w-12 h-12" style={{ color: 'var(--cl-gray-light)' }} />
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              {product.category && <span className="cl-badge cl-badge-terra">{product.category}</span>}

              <div>
                <h2 className="cl-h2">{language === 'ta' ? product.titleTamil : product.titleEnglish}</h2>
              </div>

              {/* Price Tag */}
              <div
                className="flex items-center gap-3 py-3 px-4 rounded-lg"
                style={{ background: 'var(--cl-success-bg)', border: '1px solid rgba(42,111,66,0.2)' }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: '1.75rem',
                    color: 'var(--cl-success)',
                    lineHeight: 1,
                  }}
                >
                  ₹{product.artisanStatedPrice || product.recommendedPrice}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--cl-success)' }}>
                  <ShieldCheck className="w-4 h-4" /> Fair Price Verified
                </div>
              </div>
            </div>

            {/* Spec metadata */}
            {details.length > 0 && (
              <div className="space-y-2 text-sm">
                {details.map((d) => (
                  <div key={d.label} className="flex items-start gap-2">
                    <d.icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--cl-terra)' }} />
                    <span style={{ color: 'var(--cl-gray)' }}>
                      <strong style={{ color: 'var(--cl-charcoal)' }}>{d.label}:</strong> {d.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDemoBuy}
                className="cl-btn-primary flex-1 justify-center"
                style={{ background: 'var(--cl-coffee)', borderColor: 'var(--cl-walnut)' }}
              >
                <ShoppingCart className="w-4 h-4" /> {language === 'ta' ? 'இப்போது வாங்க (செயல்விளக்கம்)' : 'Buy Now (Demo)'}
              </button>
              <button onClick={handleShare} className="cl-btn-secondary">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Descriptions footer */}
        <div className="p-6 border-t" style={{ borderColor: 'var(--cl-border)' }}>
          <p className="cl-caption" style={{ color: 'var(--cl-terra)' }}>{language === 'ta' ? 'தமிழ் பட்டியல்' : 'English Listing'}</p>
          <p className="cl-body text-sm leading-relaxed">{language === 'ta' ? product.descriptionTamil : product.descriptionEnglish}</p>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button onClick={onRestart} className="cl-btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> {language === 'ta' ? 'மற்றொரு கைவினைப் பொருளைப் பகுப்பாய்வு செய்' : 'Analyze Another Craft'}
        </button>
      </div>

      {/* Demo order confirmation modal */}
      {orderPlaced && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(5px)' }}
          role="presentation"
          onClick={(event) => { if (event.target === event.currentTarget) setOrderPlaced(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-order-title"
            className="cl-card relative w-full max-w-md p-6 md:p-8 text-center"
            style={{ background: 'var(--cl-espresso)', border: '1px solid rgba(42,111,66,0.55)', boxShadow: '0 24px 80px rgba(0,0,0,0.45)' }}
          >
            <button
              type="button"
              onClick={() => setOrderPlaced(false)}
              aria-label={language === 'ta' ? 'மூடு' : 'Close'}
              className="absolute top-3 right-3 p-2 rounded-lg"
              style={{ color: 'var(--cl-gray)' }}
            >
              <X className="w-5 h-5" />
            </button>
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'var(--cl-success-bg)', border: '1px solid rgba(42,111,66,0.35)' }}
            >
              <PackageCheck className="h-8 w-8" style={{ color: 'var(--cl-success)' }} />
            </div>
            <p className="cl-caption mb-2" style={{ color: 'var(--cl-success)' }}>
              {language === 'ta' ? 'செயல்விளக்க ஆர்டர்' : 'DEMO ORDER'}
            </p>
            <h2 id="demo-order-title" className="cl-h2 mb-3">
              {language === 'ta' ? 'ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Order Placed Successfully!'}
            </h2>
            <p className="cl-body text-sm leading-relaxed mb-5">
              {language === 'ta'
                ? 'நன்றி! இது ஒரு மாதிரி செயல்முறை மட்டுமே. உண்மையான ஆர்டர் செய்யப்படவில்லை; பணமும் வசூலிக்கப்படவில்லை.'
                : 'Thank you! This is a demo confirmation only. No real order has been placed and no payment has been collected.'}
            </p>
            <div className="rounded-lg p-4 mb-5 text-left" style={{ background: 'var(--cl-ivory)', border: '1px solid var(--cl-border)' }}>
              <p className="cl-caption mb-1">{language === 'ta' ? 'மாதிரி ஆர்டர் எண்' : 'Demo Order ID'}</p>
              <p className="font-semibold tracking-wide" style={{ color: 'var(--cl-terra)' }}>{demoOrderId}</p>
              <div className="flex items-start justify-between gap-3 mt-3 text-sm">
                <span style={{ color: 'var(--cl-gray)' }}>{language === 'ta' ? 'பொருள்' : 'Product'}</span>
                <span className="text-right font-medium">{language === 'ta' ? product.titleTamil : product.titleEnglish}</span>
              </div>
              <div className="flex items-center justify-between gap-3 mt-2 text-sm">
                <span style={{ color: 'var(--cl-gray)' }}>{language === 'ta' ? 'மாதிரி விலை' : 'Demo price'}</span>
                <span className="font-bold" style={{ color: 'var(--cl-success)' }}>₹{product.artisanStatedPrice || product.recommendedPrice}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOrderPlaced(false)}
              className="cl-btn-primary w-full justify-center"
              style={{ background: 'var(--cl-terra)', borderColor: 'var(--cl-terra-dark)' }}
            >
              <CheckCircle className="w-4 h-4" /> {language === 'ta' ? 'சரி, புரிந்தது' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
    </Localized>
  );
};
