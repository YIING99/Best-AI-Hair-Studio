
import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { generateHairstyle, extractHairstyleDescription, analyzeFaceAndSuggestStyles } from './services/geminiService';
import { PRESET_STYLES, HAIR_COLORS, PARTING_OPTIONS, BANGS_OPTIONS, TRANSLATIONS } from './constants';
import { HairStyle, ProcessingState, GenerationConfig, Gender, SavedConfig, HistoryItem, Language, AnalysisResult } from './types';

// Icons
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-7.5-7.5M12 12.75l7.5-7.5M12 12.75V3" />
  </svg>
);
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);
const MagicWandIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

// HSL to Hex Helper
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const App: React.FC = () => {
  // --- State ---
  const [language, setLanguage] = useState<Language>('zh');
  const t = TRANSLATIONS[language];

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Configuration State
  const [selectedGenderTab, setSelectedGenderTab] = useState<Gender>(Gender.FEMALE);
  const [selectedStyle, setSelectedStyle] = useState<HairStyle | null>(null);
  
  // Custom Color State (HSL)
  const [customHSL, setCustomHSL] = useState({ h: 30, s: 70, l: 50 });
  const [isCustomColorMode, setIsCustomColorMode] = useState(false);

  // Persistent States
  const [customStyles, setCustomStyles] = useState<HairStyle[]>(() => {
    const saved = localStorage.getItem('customStyles');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>(() => {
    const saved = localStorage.getItem('savedConfigs');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<GenerationConfig>({
    hairColor: '',
    length: 50,
    curl: 30,
    volume: 50,
    parting: 'auto',
    bangs: 'auto',
    age: 50,
    beard: false
  });

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('customStyles', JSON.stringify(customStyles));
  }, [customStyles]);

  useEffect(() => {
    localStorage.setItem('savedConfigs', JSON.stringify(savedConfigs));
  }, [savedConfigs]);

  // Sync HSL to config.hairColor when in custom mode
  useEffect(() => {
    if (isCustomColorMode) {
        const hex = hslToHex(customHSL.h, customHSL.s, customHSL.l);
        setConfig(prev => ({ ...prev, hairColor: hex }));
    }
  }, [customHSL, isCustomColorMode]);

  // Derived state
  const stylesToShow = [...PRESET_STYLES.filter(s => s.gender === selectedGenderTab), ...customStyles];
  const activeImage = selectedHistoryId ? history.find(h => h.id === selectedHistoryId)?.imageUrl : originalImage;

  // --- Handlers ---

  const handleImageUpload = (base64: string) => {
    setOriginalImage(base64);
    setHistory([]);
    setSelectedHistoryId(null);
    setProcessingState('idle');
    setAnalysisResult(null);
    
    // Trigger Analysis
    if (base64) {
      performAnalysis(base64);
    }
  };

  const performAnalysis = async (image: string) => {
    setProcessingState('analyzing');
    try {
      const result = await analyzeFaceAndSuggestStyles(image, PRESET_STYLES);
      setAnalysisResult(result);
      
      if (result.recommendedStyleIds.length > 0) {
        const firstRec = PRESET_STYLES.find(s => s.id === result.recommendedStyleIds[0]);
        if (firstRec) {
           setSelectedGenderTab(firstRec.gender);
        }
      }
    } catch (e) {
      console.warn("Analysis failed", e);
    } finally {
      setProcessingState('idle');
    }
  };

  const handleTemplateUpload = async (base64: string) => {
    setProcessingState('analyzing');
    try {
      const description = await extractHairstyleDescription(base64);
      const newStyle: HairStyle = {
        id: `custom-${Date.now()}`,
        name: t.custom_template_name,
        nameZh: t.custom_template_name,
        description: description,
        descriptionZh: description, 
        gender: Gender.UNISEX,
        imageUrl: base64,
        isCustom: true
      };
      setCustomStyles(prev => [...prev, newStyle]);
      setSelectedGenderTab(Gender.FEMALE); 
    } catch (e) {
      setErrorMessage(t.failed_analyze);
    } finally {
      setProcessingState('idle');
    }
  };

  const handleDeleteCustomStyle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCustomStyles(prev => prev.filter(s => s.id !== id));
    if (selectedStyle?.id === id) setSelectedStyle(null);
  };

  const handleGenerate = async () => {
    if (!originalImage || !selectedStyle) return;

    setProcessingState('generating');
    setErrorMessage(null);

    try {
      // Use English description for generation logic
      const result = await generateHairstyle(
        originalImage, 
        selectedStyle.description, 
        config
      );

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        imageUrl: result,
        styleName: language === 'zh' ? (selectedStyle.nameZh || selectedStyle.name) : selectedStyle.name,
        timestamp: Date.now(),
        config: { ...config }
      };

      setHistory(prev => [newItem, ...prev]);
      setSelectedHistoryId(newItem.id);
      setProcessingState('success');
    } catch (err: any) {
      setErrorMessage(err.message || t.failed_generate);
      setProcessingState('error');
    } finally {
        if (processingState === 'error') setProcessingState('idle');
    }
  };

  const handleSaveConfig = () => {
    const name = prompt(t.config_name, `Config ${savedConfigs.length + 1}`);
    if (name) {
      const newConfig: SavedConfig = {
        id: Date.now().toString(),
        name,
        config: { ...config }
      };
      setSavedConfigs(prev => [...prev, newConfig]);
    }
  };

  const handleLoadConfig = (saved: SavedConfig) => {
    setConfig(saved.config);
  };

  const handleDeleteConfig = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
  };

  const downloadImage = () => {
    if (activeImage && activeImage !== originalImage) {
      const link = document.createElement('a');
      link.href = activeImage;
      link.download = 'ai-hairstyle.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareImage = async () => {
    if (!activeImage) return;
    try {
      const response = await fetch(activeImage);
      const blob = await response.blob();
      const file = new File([blob], 'hairstyle.png', { type: blob.type });
      
      if (navigator.share) {
        await navigator.share({
          title: t.app_title,
          text: 'Check out my new look!',
          files: [file]
        });
      } else {
        alert(t.share_fail);
      }
    } catch (error) {
      console.error('Sharing failed', error);
      alert(t.share_fail);
    }
  };

  // Helper to get localized name
  const getStyleName = (style: HairStyle) => {
    return language === 'zh' ? (style.nameZh || style.name) : style.name;
  };

  const handlePresetColorClick = (colorValue: string) => {
    setIsCustomColorMode(false);
    setConfig({...config, hairColor: colorValue});
  };

  const handleCustomColorClick = () => {
    setIsCustomColorMode(true);
    // Don't necessarily reset config.hairColor yet, wait for slider movement, or set to current HSL
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <span className="font-bold text-white">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {t.app_title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-slate-800 rounded-lg p-1 flex text-xs font-medium">
                <button 
                  onClick={() => setLanguage('zh')} 
                  className={`px-3 py-1 rounded ${language === 'zh' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  中
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-3 py-1 rounded ${language === 'en' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  EN
                </button>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Controls & Library */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
          
          {/* Analysis Result Banner */}
          {analysisResult && (
            <div className="bg-slate-800/80 rounded-lg p-3 border border-brand-500/30 flex items-start gap-3 animate-pulse-slow">
               <div className="text-xl">✨</div>
               <div>
                  <h4 className="text-sm font-bold text-brand-300">{t.face_shape_label} {language === 'zh' ? analysisResult.faceShapeZh : analysisResult.faceShape}</h4>
                  <p className="text-xs text-slate-400 mt-1">{analysisResult.reasoning}</p>
               </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex p-1 bg-slate-800 rounded-lg">
            {[Gender.FEMALE, Gender.MALE].map(g => (
              <button
                key={g}
                onClick={() => setSelectedGenderTab(g)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedGenderTab === g 
                    ? 'bg-slate-700 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g === Gender.FEMALE ? t.tab_female : t.tab_male}
              </button>
            ))}
          </div>

          {/* Style Grid */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex-1 overflow-y-auto min-h-[300px] max-h-[500px]">
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">{t.library}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Add Custom Upload Card */}
              <div className="col-span-1">
                <ImageUploader 
                    onImageSelect={handleTemplateUpload} 
                    compact={true} 
                    label={t.add_template}
                />
              </div>

              {stylesToShow.map(style => {
                const isRecommended = analysisResult?.recommendedStyleIds.includes(style.id);
                return (
                  <div 
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`
                      relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                      ${selectedStyle?.id === style.id ? 'border-brand-500 ring-2 ring-brand-500/20' : isRecommended ? 'border-brand-500/50' : 'border-transparent hover:border-slate-600'}
                    `}
                  >
                    <img 
                        src={style.imageUrl} 
                        alt={style.name} 
                        className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity bg-slate-900" 
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/400x400/1e293b/cbd5e1?text=${encodeURIComponent(style.name.substring(0,6))}`;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-2">
                      <span className="text-xs font-medium text-white truncate w-full text-center">{getStyleName(style)}</span>
                    </div>
                    {isRecommended && (
                       <div className="absolute top-0 right-0 bg-brand-600 text-white text-[9px] px-1.5 py-0.5 rounded-bl font-bold shadow-sm">
                          {t.recommended_badge}
                       </div>
                    )}
                    {style.isCustom && (
                      <button 
                          onClick={(e) => handleDeleteCustomStyle(e, style.id)}
                          className="absolute top-1 right-1 bg-red-600/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      >
                          <TrashIcon />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advanced Customization Controls */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>{t.fine_tune}</span>
                </h3>
                <button onClick={handleSaveConfig} className="text-xs text-brand-400 hover:text-brand-300 font-medium">
                    {t.save_config}
                </button>
            </div>
            
            {/* Saved Configs List */}
            {savedConfigs.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {savedConfigs.map(sc => (
                        <div key={sc.id} onClick={() => handleLoadConfig(sc)} className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer hover:bg-slate-600 border border-slate-600 hover:border-brand-500">
                            <span>{sc.name}</span>
                            <span onClick={(e) => handleDeleteConfig(e, sc.id)} className="text-slate-400 hover:text-red-400 ml-1">&times;</span>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Color Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-slate-500 font-semibold">{t.hair_color}</label>
                <div className="flex items-center gap-2">
                    {isCustomColorMode && (
                         <div 
                             className="w-4 h-4 rounded-full border border-slate-500" 
                             style={{ backgroundColor: config.hairColor }} 
                         />
                    )}
                    <span className="text-xs text-slate-400">
                        {isCustomColorMode 
                            ? t.color_custom 
                            : (config.hairColor ? (HAIR_COLORS.find(c => c.value === config.hairColor)?.name || t.color_custom) : t.color_natural)
                        }
                    </span>
                </div>
              </div>
              
              {/* Presets */}
              <div className="flex flex-wrap gap-2 items-center mb-3">
                {HAIR_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handlePresetColorClick(c.value)}
                    className={`
                      w-7 h-7 rounded-full border-2 transition-transform hover:scale-110
                      ${!isCustomColorMode && config.hairColor === c.value ? 'border-white scale-110 ring-2 ring-white/20' : 'border-transparent'}
                    `}
                    style={{ 
                        backgroundColor: c.value === '#000000' ? '#1a1a1a' : (c.value || '#334155'),
                        backgroundImage: !c.value ? 'linear-gradient(45deg, #334155 25%, transparent 25%, transparent 75%, #334155 75%, #334155), linear-gradient(45deg, #334155 25%, transparent 25%, transparent 75%, #334155 75%, #334155)' : 'none'
                    }}
                    title={c.name}
                  />
                ))}
                {/* Custom Color Trigger */}
                <button
                    onClick={handleCustomColorClick}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 transition-transform ${isCustomColorMode ? 'border-white ring-2 ring-white/20 scale-110' : 'border-transparent'}`}
                >
                    <span className="text-[10px] font-bold text-white drop-shadow-md">+</span>
                </button>
              </div>

              {/* HSL Sliders (Visible if Custom Mode) */}
              {isCustomColorMode && (
                  <div className="bg-slate-900/50 p-3 rounded-lg space-y-2 border border-slate-700">
                      <div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                              <span>{t.hue}</span>
                              <span>{customHSL.h}°</span>
                          </div>
                          <input 
                            type="range" min="0" max="360" value={customHSL.h}
                            onChange={(e) => setCustomHSL({...customHSL, h: Number(e.target.value)})}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                            style={{ background: `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)` }}
                          />
                      </div>
                      <div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                              <span>{t.saturation}</span>
                              <span>{customHSL.s}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={customHSL.s}
                            onChange={(e) => setCustomHSL({...customHSL, s: Number(e.target.value)})}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400"
                          />
                      </div>
                      <div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                              <span>{t.lightness}</span>
                              <span>{customHSL.l}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={customHSL.l}
                            onChange={(e) => setCustomHSL({...customHSL, l: Number(e.target.value)})}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                          />
                      </div>
                  </div>
              )}
            </div>

            {/* Config Sliders Section */}
            <div className="space-y-4 pt-2 border-t border-slate-700/50">
                {[
                    { label: t.length, key: 'length', minLabel: t.short, maxLabel: t.long },
                    { label: t.curl, key: 'curl', minLabel: t.straight, maxLabel: t.coily },
                    { label: t.volume, key: 'volume', minLabel: t.flat, maxLabel: t.full },
                    { label: t.age_label, key: 'age', minLabel: t.age_young, maxLabel: t.age_old },
                ].map((item) => (
                    <div key={item.key}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="text-slate-600">{config[item.key as keyof GenerationConfig]}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                             <span className="text-[10px] text-slate-600 w-8 text-right">{item.minLabel}</span>
                             <input
                                type="range"
                                min="0"
                                max="100"
                                value={config[item.key as keyof GenerationConfig] as number}
                                onChange={(e) => setConfig({...config, [item.key]: parseInt(e.target.value)})}
                                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:accent-brand-400"
                             />
                             <span className="text-[10px] text-slate-600 w-8">{item.maxLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selectors Section */}
            <div className="grid grid-cols-2 gap-4">
                 {/* Parting */}
                 <div>
                    <label className="text-xs text-slate-500 font-semibold block mb-2">{t.parting}</label>
                    <div className="relative">
                         <select 
                            value={config.parting}
                            onChange={(e) => setConfig({...config, parting: e.target.value as any})}
                            className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-md p-2 appearance-none hover:border-brand-500 focus:border-brand-500 outline-none transition-colors"
                         >
                            {PARTING_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                         </select>
                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                 </div>

                 {/* Bangs */}
                 <div>
                    <label className="text-xs text-slate-500 font-semibold block mb-2">{t.bangs}</label>
                    <div className="relative">
                         <select 
                            value={config.bangs}
                            onChange={(e) => setConfig({...config, bangs: e.target.value as any})}
                            className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-md p-2 appearance-none hover:border-brand-500 focus:border-brand-500 outline-none transition-colors"
                         >
                            {BANGS_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                         </select>
                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Beard Toggle (Male Only) */}
            {selectedGenderTab === Gender.MALE && (
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg border border-slate-700">
                    <span className="text-xs text-slate-400 font-semibold">{t.beard_label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={config.beard}
                            onChange={(e) => setConfig({...config, beard: e.target.checked})} 
                        />
                        <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                </div>
            )}

          </div>

        </div>

        {/* Right Panel: Workspace */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 order-1 lg:order-2">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between">
                {originalImage && (
                    <Button variant="outline" onClick={handleImageUpload.bind(null, '')} className="text-sm px-3 py-1">
                        <ChevronLeftIcon /> {t.new_photo}
                    </Button>
                )}
                <div className="flex gap-2 ml-auto">
                    {activeImage && activeImage !== originalImage && (
                        <>
                            <Button variant="secondary" onClick={shareImage} className="text-sm px-3 py-1">
                                <ShareIcon /> {t.share_image}
                            </Button>
                            <Button variant="secondary" onClick={downloadImage} className="text-sm px-3 py-1">
                                <DownloadIcon /> {t.save_image}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[500px] flex flex-col">
                
                <div className="flex-1 relative flex items-center justify-center p-4">
                    {!originalImage ? (
                        <div className="max-w-md w-full">
                            <ImageUploader 
                                onImageSelect={handleImageUpload} 
                                label={t.upload_label}
                                hint={t.upload_hint}
                            />
                            <p className="text-center text-slate-500 mt-4 text-sm">{t.upload_tip}</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center gap-4">
                            {/* Comparison View */}
                            <div className={`relative transition-all duration-500 ${selectedHistoryId ? 'w-1/2 hidden md:block opacity-50' : 'w-full'}`}>
                                <img src={originalImage} alt="Original" className="max-h-[600px] w-full object-contain rounded-lg" />
                                <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{t.original}</span>
                            </div>

                            {selectedHistoryId && activeImage && (
                                <div className="relative w-full md:w-1/2">
                                    <img src={activeImage} alt="Generated" className="max-h-[600px] w-full object-contain rounded-lg shadow-2xl shadow-brand-500/20" />
                                    <span className="absolute top-2 left-2 bg-brand-600/80 text-white text-xs px-2 py-1 rounded">{t.new_style}</span>
                                </div>
                            )}

                            {/* Processing Overlay */}
                            {(processingState === 'generating' || processingState === 'analyzing') && (
                                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-brand-400 font-medium animate-pulse">
                                        {processingState === 'analyzing' ? t.analyzing : t.generating}
                                    </p>
                                </div>
                            )}

                            {/* Error Overlay */}
                            {errorMessage && (
                                <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">!</div>
                                    <p className="text-white mb-4">{errorMessage}</p>
                                    <Button onClick={() => setErrorMessage(null)}>Try Again</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* History Strip */}
                {history.length > 0 && (
                    <div className="bg-slate-900 border-t border-slate-800 p-4 overflow-x-auto">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.history}</h4>
                        <div className="flex gap-3">
                            <div 
                                onClick={() => setSelectedHistoryId(null)}
                                className={`
                                    relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                                    ${selectedHistoryId === null ? 'border-brand-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}
                                `}
                            >
                                <img src={originalImage || ''} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 w-full bg-black/60 text-[10px] text-white text-center py-0.5">{t.original}</span>
                            </div>

                            {history.map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => setSelectedHistoryId(item.id)}
                                    className={`
                                        relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                                        ${selectedHistoryId === item.id ? 'border-brand-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}
                                    `}
                                >
                                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-1">
                                        <div className="text-[9px] text-white truncate text-center leading-tight">{item.styleName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Floating Action Button */}
            {originalImage && (
                <div className="sticky bottom-6 z-40 mx-auto">
                    <Button 
                        onClick={handleGenerate} 
                        disabled={!selectedStyle} 
                        isLoading={processingState === 'generating'}
                        className="w-full md:w-auto px-8 py-3 text-lg rounded-full shadow-xl shadow-brand-500/30 transform hover:scale-105 active:scale-95 transition-all"
                    >
                        <MagicWandIcon /> 
                        {history.length > 0 ? t.regenerate_btn : t.generate_btn}
                    </Button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
