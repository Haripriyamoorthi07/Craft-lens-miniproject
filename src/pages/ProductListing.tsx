import React, { useState } from 'react';
import { Localized } from '../context/Localized';
import { useLanguage } from '../context/LanguageContext';
import { useProduct } from '../context/ProductContext';
import { Languages, Copy, ArrowRight, Check } from 'lucide-react';

interface ProductListingProps {
  onNext: () => void;
}


export const ProductListing: React.FC<ProductListingProps> = ({ onNext }) => {
  const { product } = useProduct();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = language === 'ta' ? `${product.titleTamil}\n\n${product.descriptionTamil}` : `${product.titleEnglish}\n\n${product.descriptionEnglish}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showEn = language === 'en';
  const showTa = language === 'ta';

  return (
    <Localized>
    
    <div className="cl-container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div className="mb-8">
        <span className="cl-section-label">Step 3 of 7</span>
        <h1 className="cl-h1 mt-1 flex items-center gap-3">
          <Languages className="w-7 h-7" style={{ color: 'var(--cl-terra)' }} />
          {language === 'ta' ? 'தமிழ் தயாரிப்புப் பட்டியல்' : 'Product Listing'}
        </h1>
        <p className="cl-body mt-1">
          {language === 'ta'
            ? 'உங்கள் கைவினைப் பொருளுக்கான விற்பனை விளக்கம் தமிழில் தானாக உருவாக்கப்பட்டது.'
            : 'Your product listing is automatically prepared in English for buyers and online marketplaces.'}
        </p>
      </div>

      <div className="cl-card overflow-hidden">
        {/* Tab Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            background: 'var(--cl-ivory)',
            borderBottom: '1px solid var(--cl-border)',
          }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--cl-terra)' }}>
            {language === 'ta' ? 'தமிழ் பட்டியல்' : 'English Listing'}
          </span>

          <button
            onClick={handleCopy}
            className="cl-btn-ghost flex items-center gap-1.5"
            style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
          >
            {copied
              ? <><Check className="w-3.5 h-3.5" style={{ color: 'var(--cl-success)' }} /> Copied!</>
              : <><Copy className="w-3.5 h-3.5" /> Copy Text</>
            }
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-1">
            {showEn && (
              <h2 className="cl-h2">{product.titleEnglish}</h2>
            )}
            {showTa && (
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--cl-terra)' }}>
                {product.titleTamil}
              </h3>
            )}
          </div>

          {/* Category Badge */}
          {product.category && (
            <span className="cl-badge cl-badge-terra">{product.category}</span>
          )}

          {/* Descriptions Grid */}
          <div className={`grid grid-cols-1 ${showEn && showTa ? 'md:grid-cols-2' : ''} gap-6`}>
            {showEn && (
              <div className="cl-card p-5 space-y-2" style={{ background: 'var(--cl-ivory)' }}>
                <p className="cl-caption" style={{ color: 'var(--cl-terra)' }}>English Description</p>
                <p className="cl-body text-sm leading-relaxed">{product.descriptionEnglish}</p>
              </div>
            )}
            {showTa && (
              <div className="cl-card p-5 space-y-2" style={{ background: 'var(--cl-ivory)' }}>
                <p className="cl-caption" style={{ color: 'var(--cl-terra)' }}>தமிழ் விவரிப்பு</p>
                <p className="cl-body text-sm leading-relaxed">{product.descriptionTamil}</p>
              </div>
            )}
          </div>

          {/* Meta strip */}
          <div
            className="flex flex-wrap gap-4 pt-4 text-xs"
            style={{ borderTop: '1px solid var(--cl-border)', color: 'var(--cl-gray-mid)' }}
          >
            {product.material   && <span>🧱 {product.material}</span>}
            {product.dimensions && <span>📐 {product.dimensions}</span>}
            {product.origin     && <span>📍 {product.origin}</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button onClick={onNext} className="cl-btn-primary" style={{ padding: '12px 26px', fontSize: '0.9375rem', background: 'var(--cl-terra)', borderColor: 'var(--cl-terra-dark)' }}>
          Recommend Fair Price <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    </Localized>
  );
};
