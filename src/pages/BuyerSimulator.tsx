import React, { useMemo, useState } from 'react';
import { Localized } from '../context/Localized';
import { useLanguage } from '../context/LanguageContext';
import { useProduct } from '../context/ProductContext';
import { MessageSquare, User, Bot, ArrowRight, Pencil, Check, X, Plus, RotateCcw } from 'lucide-react';

interface BuyerSimulatorProps {
  onNext: () => void;
}

type Simulation = {
  id: number;
  typeEn: string;
  typeTa: string;
  qEn: string;
  qTa: string;
  aEn: string;
  aTa: string;
};

function getSimulations(category: string, material: string, titleEn: string, titleTa: string): Simulation[] {
  const cat = category?.toLowerCase() || '';
  const mat = material?.trim() || 'the material used';
  const nameEn = titleEn || 'this handcrafted item';
  const nameTa = titleTa || 'இந்தக் கைவினைப் பொருள்';
  const pottery = cat.includes('pottery') || cat.includes('terracotta') || mat.toLowerCase().includes('clay');
  const wood = cat.includes('wood') || mat.toLowerCase().includes('wood') || mat.toLowerCase().includes('teak');

  const firstQuestion: Simulation = pottery
    ? {
        id: 1, typeEn: 'Durability', typeTa: 'நீடித்த தன்மை',
        qEn: `Is ${nameEn} easy to break? How will you pack it for delivery?`,
        qTa: `${nameTa} எளிதில் உடைந்துவிடுமா? டெலிவரிக்காக எப்படிப் பாதுகாப்பாகப் பேக் செய்வீர்கள்?`,
        aEn: 'I will pack the item carefully with suitable cushioning and a sturdy outer box. I can share the packing method before dispatch.',
        aTa: 'இந்தப் பொருளைத் தகுந்த பாதுகாப்புப் பொருட்களுடன் வலுவான பெட்டியில் கவனமாகப் பேக் செய்து அனுப்புவேன். அனுப்புவதற்கு முன் பேக்கிங் முறையையும் பகிர முடியும்.'
      }
    : wood
    ? {
        id: 1, typeEn: 'Material & Quality', typeTa: 'பொருள் மற்றும் தரம்',
        qEn: `Is ${nameEn} made from solid wood? How can I check the quality?`,
        qTa: `${nameTa} முழு மரத்தால் செய்யப்பட்டதா? அதன் தரத்தை நான் எப்படி அறிந்துகொள்வது?`,
        aEn: `The material used is ${mat}. I can share close-up photos and the available details so you can check the finish and craftsmanship before buying.`,
        aTa: `இதில் பயன்படுத்திய பொருள் ${mat}. வாங்குவதற்கு முன் வேலைப்பாடு மற்றும் முடிப்புத் தரத்தைப் பார்க்க நெருக்கமான புகைப்படங்களையும் கிடைக்கும் விவரங்களையும் பகிர முடியும்.`
      }
    : {
        id: 1, typeEn: 'Authenticity', typeTa: 'உண்மைத்தன்மை',
        qEn: `Was ${nameEn} genuinely handmade by an artisan?`,
        qTa: `${nameTa} உண்மையிலேயே ஒரு கைவினைஞரால் கைகளால் செய்யப்பட்டதா?`,
        aEn: 'I can explain the making process and share photos of the craftsmanship. I will only claim details that I can verify about this product.',
        aTa: 'இந்தப் பொருளை உருவாக்கும் முறையை விளக்கி, கைவினை வேலைப்பாட்டின் புகைப்படங்களைப் பகிர முடியும். உறுதிப்படுத்தக்கூடிய விவரங்களை மட்டுமே கூறுவேன்.'
      };

  const items: Simulation[] = [
    firstQuestion,
    {
      id: 2, typeEn: 'Price & Value', typeTa: 'விலை மற்றும் மதிப்பு',
      qEn: `Why does ${nameEn} cost this much compared with a factory-made product?`,
      qTa: `தொழிற்சாலையில் தயாரிக்கும் பொருளுடன் ஒப்பிடும்போது ${nameTa} விலை ஏன் அதிகமாக இருக்கிறது?`,
      aEn: 'The price reflects the material, time, handwork and finishing involved. I can explain the work that goes into this particular item so you can compare its value.',
      aTa: 'இந்த விலையில் பயன்படுத்திய பொருள், தயாரிக்க எடுத்த நேரம், கைவினை உழைப்பு மற்றும் இறுதிப் பூச்சு ஆகியவை அடங்கும். இந்தப் பொருளுக்காகச் செய்யப்பட்ட வேலையை விளக்க முடியும்.'
    },
    {
      id: 3, typeEn: 'Size & Fit', typeTa: 'அளவு மற்றும் பொருத்தம்',
      qEn: 'What are the exact dimensions and weight? Will it fit the space I have?',
      qTa: 'இதன் சரியான நீளம், அகலம், உயரம் மற்றும் எடை என்ன? நான் வைத்திருக்கும் இடத்திற்குப் பொருந்துமா?',
      aEn: 'Please check the listed measurements before ordering. If a measurement is missing, ask me and I will measure the item and confirm it before dispatch.',
      aTa: 'ஆர்டர் செய்வதற்கு முன் குறிப்பிடப்பட்ட அளவுகளைச் சரிபார்க்கவும். ஏதேனும் அளவு குறிப்பிடப்படவில்லை என்றால் கேளுங்கள்; அனுப்புவதற்கு முன் அளந்து உறுதிப்படுத்துகிறேன்.'
    },
    {
      id: 4, typeEn: 'Care Instructions', typeTa: 'பராமரிப்பு முறை',
      qEn: 'How should I clean and maintain this product? Can I use it every day?',
      qTa: 'இந்தப் பொருளை எப்படிச் சுத்தம் செய்து பராமரிக்க வேண்டும்? தினமும் பயன்படுத்தலாமா?',
      aEn: 'Care depends on the material and intended use. I will share the appropriate cleaning and storage instructions for this item rather than suggest a method that could damage it.',
      aTa: 'பராமரிப்பு முறை பொருளின் வகை மற்றும் பயன்பாட்டைப் பொறுத்தது. சேதம் ஏற்படுத்தக்கூடிய முறையைச் சொல்லாமல், இந்தப் பொருளுக்குப் பொருத்தமான சுத்தம் மற்றும் சேமிப்பு வழிமுறைகளைப் பகிர்வேன்.'
    },
    {
      id: 5, typeEn: 'Delivery', typeTa: 'டெலிவரி',
      qEn: 'How many days will delivery take, and can I track my order?',
      qTa: 'டெலிவரி வர எத்தனை நாட்கள் ஆகும்? ஆர்டரைத் தொடர்ந்து கண்காணிக்க முடியுமா?',
      aEn: 'The delivery time depends on your location and the courier service. I will confirm the expected timeline and share tracking details when they are available.',
      aTa: 'டெலிவரி நேரம் உங்கள் இடம் மற்றும் கூரியர் சேவையைப் பொறுத்தது. எதிர்பார்க்கப்படும் நேரத்தை உறுதிப்படுத்தி, கிடைத்ததும் கண்காணிப்பு விவரங்களைப் பகிர்வேன்.'
    },
    {
      id: 6, typeEn: 'Returns & Damage', typeTa: 'திருப்பி அனுப்புதல் மற்றும் சேதம்',
      qEn: 'What should I do if the product arrives damaged or is different from the photos?',
      qTa: 'பொருள் சேதமடைந்து வந்தாலோ அல்லது புகைப்படத்தில் இருப்பதிலிருந்து மாறுபட்டிருந்தாலோ என்ன செய்ய வேண்டும்?',
      aEn: 'Please take clear photos of the item and packaging as soon as it arrives and contact me. I will follow the agreed store or marketplace return and damage policy.',
      aTa: 'பொருள் வந்தவுடன் அதையும் பேக்கிங்கையும் தெளிவாகப் புகைப்படம் எடுத்து என்னைத் தொடர்புகொள்ளுங்கள். கடை அல்லது விற்பனைத் தளத்தின் திரும்பப் பெறுதல் மற்றும் சேதக் கொள்கைப்படி உதவுவேன்.'
    },
    {
      id: 7, typeEn: 'Customization', typeTa: 'விருப்பத்திற்கேற்ப மாற்றம்',
      qEn: 'Can you make this in another colour, design or size?',
      qTa: 'இதை வேறு நிறம், வடிவம் அல்லது அளவில் செய்து தர முடியுமா?',
      aEn: 'Customization may be possible depending on the material, design and time required. Tell me your preference and I will confirm what I can make before accepting the order.',
      aTa: 'பொருள், வடிவம் மற்றும் தேவைப்படும் நேரத்தைப் பொறுத்து மாற்றம் செய்து தர முடியும். உங்கள் விருப்பத்தைச் சொல்லுங்கள்; ஆர்டரை ஏற்கும் முன் செய்ய முடியுமா என்பதை உறுதிப்படுத்துவேன்.'
    },
    {
      id: 8, typeEn: 'Availability', typeTa: 'இருப்பு விவரம்',
      qEn: 'Is this item ready to ship, or will it be made after I place an order?',
      qTa: 'இந்தப் பொருள் உடனே அனுப்பத் தயாராக உள்ளதா, அல்லது ஆர்டர் செய்த பிறகுதான் தயாரிக்கப்படுமா?',
      aEn: 'I will confirm whether this particular item is ready to ship or needs production time before you place the order.',
      aTa: 'ஆர்டர் செய்வதற்கு முன் இந்தப் பொருள் உடனே அனுப்பத் தயாராக உள்ளதா அல்லது தயாரிக்க கூடுதல் நேரம் தேவையா என்பதை உறுதிப்படுத்துவேன்.'
    }
  ];

  return items;
}

export const BuyerSimulator: React.FC<BuyerSimulatorProps> = ({ onNext }) => {
  const { product } = useProduct();
  const { language, t } = useLanguage();
  const sims = useMemo(
    () => getSimulations(product.category, product.material, product.titleEnglish, product.titleTamil),
    [product.category, product.material, product.titleEnglish, product.titleTamil]
  );
  const [visibleCount, setVisibleCount] = useState(4);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [editedAnswers, setEditedAnswers] = useState<Record<number, string>>({});
  const isTamil = language === 'ta';

  const getOriginalAnswer = (sim: Simulation) => isTamil ? sim.aTa : sim.aEn;
  const getAnswer = (sim: Simulation) => editedAnswers[sim.id] ?? getOriginalAnswer(sim);
  const startEditing = (sim: Simulation) => {
    setEditingId(sim.id);
    setDraft(getAnswer(sim));
  };
  const saveAnswer = (id: number) => {
    setEditedAnswers((previous) => ({ ...previous, [id]: draft.trim() }));
    setEditingId(null);
  };
  const resetAnswer = (sim: Simulation) => {
    setEditedAnswers((previous) => {
      const next = { ...previous };
      delete next[sim.id];
      return next;
    });
    setEditingId(null);
  };

  return (
    <Localized>
      <div className="cl-container" style={{ padding: '48px 24px' }}>
        <div className="mb-8">
          <span className="cl-section-label">{t('Step 5 of 7', 'படி 5 / 7')}</span>
          <h1 className="cl-h1 mt-1 flex items-center gap-3">
            <MessageSquare className="w-8 h-8" style={{ color: 'var(--cl-terra)' }} />
            {t('Buyer Simulator', 'வாங்குபவர் கேள்விகள்')}
          </h1>
          <p className="cl-body mt-1">
            {t('Practice realistic buyer questions about ', 'உங்கள் பொருளைப் பற்றி வாங்குபவர்கள் கேட்கக்கூடிய கேள்விகளுக்குப் பயிற்சி செய்யுங்கள்: ')}
            <strong style={{ color: 'var(--cl-charcoal)' }}>{isTamil ? (product.titleTamil || product.category) : (product.titleEnglish || product.category)}</strong>
            {t('. Review or edit each suggested answer before using it with a customer.', '. ஒவ்வொரு பதிலையும் வாடிக்கையாளரிடம் பயன்படுத்துவதற்கு முன் சரிபார்த்து திருத்தலாம்.')}
          </p>
          <p className="cl-caption mt-2">{t('Answers are editable examples. Confirm product facts, delivery times and store policies before promising them to buyers.', 'இவை திருத்தக்கூடிய மாதிரிப் பதில்கள். வாங்குபவர்களுக்கு உறுதி அளிப்பதற்கு முன் பொருள் விவரங்கள், டெலிவரி நேரம் மற்றும் கடைக் கொள்கைகளைச் சரிபார்க்கவும்.')}</p>
        </div>

        <div className="space-y-6">
          {sims.slice(0, visibleCount).map((sim) => (
            <div key={sim.id} className="cl-card p-6 space-y-5" style={{ background: 'var(--cl-white)', border: '1px solid var(--cl-border)' }}>
              <div className="flex items-center justify-between gap-3">
                <span className="cl-badge cl-badge-terra">{isTamil ? sim.typeTa : sim.typeEn}</span>
                <span className="cl-caption">✦ {t('Buyer question', 'வாங்குபவரின் கேள்வி')}</span>
              </div>

              <div className="p-5 rounded-2xl flex items-start gap-4" style={{ background: 'var(--cl-cream)', border: '1px solid var(--cl-border)', borderRadius: '4px 16px 16px 16px' }}>
                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--cl-parchment)', border: '1px solid var(--cl-tan)' }}>
                  <User className="w-4 h-4" style={{ color: 'var(--cl-coffee)' }} />
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="cl-caption" style={{ color: 'var(--cl-gray-mid)' }}>{t('Potential buyer asks', 'வாங்குபவர் கேட்கலாம்')}</p>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--cl-charcoal)' }}>
                    “{isTamil ? sim.qTa : sim.qEn}”
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl flex items-start gap-4" style={{ background: 'var(--cl-terra-pale)', border: '1px solid rgba(184,115,42,0.3)', borderRadius: '16px 4px 16px 16px' }}>
                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--cl-coffee)', color: 'var(--cl-parchment)' }}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="cl-caption" style={{ color: 'var(--cl-terra-dark)' }}>✦ {t('Suggested artisan answer', 'கைவினைஞருக்கான மாதிரிப் பதில்')}</p>
                    {editingId !== sim.id && (
                      <button type="button" onClick={() => startEditing(sim)} className="cl-btn-ghost flex items-center gap-1.5" style={{ padding: '6px 10px', fontSize: '0.8125rem' }}>
                        <Pencil className="w-3.5 h-3.5" /> {t('Edit Answer', 'பதிலைத் திருத்து')}
                      </button>
                    )}
                  </div>

                  {editingId === sim.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={4}
                        className="w-full rounded-xl p-3 text-sm"
                        style={{ background: 'var(--cl-white)', color: 'var(--cl-charcoal)', border: '1px solid var(--cl-border)', resize: 'vertical', lineHeight: 1.6 }}
                        aria-label={t('Edit suggested answer', 'மாதிரிப் பதிலைத் திருத்து')}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => saveAnswer(sim.id)} disabled={!draft.trim()} className="cl-btn-primary flex items-center gap-1.5" style={{ padding: '7px 12px', fontSize: '0.8125rem', opacity: draft.trim() ? 1 : 0.55 }}>
                          <Check className="w-4 h-4" /> {t('Save Answer', 'பதிலைச் சேமி')}
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="cl-btn-ghost flex items-center gap-1.5" style={{ padding: '7px 12px', fontSize: '0.8125rem' }}>
                          <X className="w-4 h-4" /> {t('Cancel', 'ரத்து செய்')}
                        </button>
                        {editedAnswers[sim.id] !== undefined && (
                          <button type="button" onClick={() => resetAnswer(sim)} className="cl-btn-ghost flex items-center gap-1.5" style={{ padding: '7px 12px', fontSize: '0.8125rem' }}>
                            <RotateCcw className="w-3.5 h-3.5" /> {t('Reset', 'மீட்டமை')}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: 'var(--cl-charcoal)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                      {getAnswer(sim)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-8">
          <div>
            {visibleCount < sims.length && (
              <button type="button" onClick={() => setVisibleCount((count) => Math.min(count + 4, sims.length))} className="cl-btn-ghost flex items-center gap-2" style={{ padding: '11px 16px' }}>
                <Plus className="w-4 h-4" /> {t('Generate More Buyer Questions', 'மேலும் வாங்குபவர் கேள்விகளைக் காட்டு')} ({sims.length - visibleCount})
              </button>
            )}
            {visibleCount >= sims.length && <p className="cl-caption">{t('All sample questions are shown.', 'அனைத்து மாதிரிக் கேள்விகளும் காட்டப்பட்டுள்ளன.')}</p>}
          </div>
          <button id="view-coach-score-btn" onClick={onNext} className="cl-btn-primary flex items-center gap-2" style={{ padding: '13px 28px', fontSize: '1rem' }}>
            {t('View AI Sell Coach Score', 'AI விற்பனை வழிகாட்டி மதிப்பெண்ணைப் பார்')} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Localized>
  );
};
