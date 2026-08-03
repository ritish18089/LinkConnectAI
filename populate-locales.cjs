const fs = require('fs');
const path = require('path');

const locales = ['en', 'hi', 'kn', 'te', 'ta', 'ml', 'mr', 'bn', 'gu', 'pa'];

const translations = {
  en: {
    dashboard: { overview: "Overview" },
    nav: {
      browse_templates: "Browse Templates",
      ai_assistant: "AI Assistant",
      resume_templates: "Resume Templates",
      placement_support: "Placement Support",
      mock_interview: "Mock Interview",
      resume_analyzer: "Resume Analyzer",
      readme_generator: "README Generator",
      cover_letter_generator: "Cover Letter Generator",
      saved_templates: "Saved Templates",
      profile: "Profile",
      settings: "Settings"
    }
  },
  hi: {
    dashboard: { overview: "अवलोकन" },
    nav: {
      browse_templates: "टेम्पलेट्स ब्राउज़ करें",
      ai_assistant: "एआई असिस्टेंट",
      resume_templates: "रेज़्यूमे टेम्पलेट्स",
      placement_support: "प्लेसमेंट सपोर्ट",
      mock_interview: "मॉक इंटरव्यू",
      resume_analyzer: "रेज़्यूमे विश्लेषक",
      readme_generator: "README जनरेटर",
      cover_letter_generator: "कवर लेटर जनरेटर",
      saved_templates: "सहेजे गए टेम्पलेट्स",
      profile: "प्रोफ़ाइल",
      settings: "सेटिंग्स"
    }
  },
  kn: {
    dashboard: { overview: "ಅವಲೋಕನ" },
    nav: {
      browse_templates: "ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
      ai_assistant: "AI ಸಹಾಯಕ",
      resume_templates: "ರೆಸ್ಯೂಮೆ ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
      placement_support: "ಉದ್ಯೋಗ ಬೆಂಬಲ",
      mock_interview: "ಮಣಕು ಸಂದರ್ಶನ",
      resume_analyzer: "ರೆಸ್ಯೂಮೆ ವಿಶ್ಲೇಷಕ",
      readme_generator: "README ಜನರೇಟರ್",
      cover_letter_generator: "ಕವರ್ ಲೆಟರ್ ಜನರೇಟರ್",
      saved_templates: "ಉಳಿಸಿದ ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
      profile: "ಪ್ರೊಫೈಲ್",
      settings: "ಸೆಟ್ಟಿಂಗ್ಸ್"
    }
  },
  te: {
    dashboard: { overview: "స్థూలదృష్టి" },
    nav: {
      browse_templates: "టెంప్లేట్లను బ్రౌజ్ చేయండి",
      ai_assistant: "AI సహాయకుడు",
      resume_templates: "రెజ్యూమె టెంప్లేట్లు",
      placement_support: "ప్లేస్‌మెంట్ మద్దతు",
      mock_interview: "మాక్ ఇంటర్వ్యూ",
      resume_analyzer: "రెజ్యూమె విశ్లేషకుడు",
      readme_generator: "README జనరేటర్",
      cover_letter_generator: "కవర్ లెటర్ జనరేటర్",
      saved_templates: "సేవ్ చేయబడిన టెంప్లేట్లు",
      profile: "ప్రొఫైల్",
      settings: "సెట్టింగులు"
    }
  },
  ta: {
    dashboard: { overview: "மேலோட்டம்" },
    nav: {
      browse_templates: "வார்ப்புருக்களை உலாவுக",
      ai_assistant: "AI உதவியாளர்",
      resume_templates: "ரெஸ்யூம் வார்ப்புருக்கள்",
      placement_support: "வேலை வாய்ப்பு ஆதரவு",
      mock_interview: "மாதிரி நேர்காணல்",
      resume_analyzer: "ரெஸ்யூம் பகுப்பாய்வி",
      readme_generator: "README ஜெனரேட்டர்",
      cover_letter_generator: "கடித ஜெனரேட்டர்",
      saved_templates: "சேமிக்கப்பட்ட வார்ப்புருக்கள்",
      profile: "சுயவிவரம்",
      settings: "அமைப்புகள்"
    }
  },
  ml: {
    dashboard: { overview: "അവലോകനം" },
    nav: {
      browse_templates: "ടെംപ്ലേറ്റുകൾ ബ്രൗസ് ചെയ്യുക",
      ai_assistant: "AI അസിസ്റ്റന്റ്",
      resume_templates: "റെസ്യൂമെ ടെംപ്ലേറ്റുകൾ",
      placement_support: "പ്ലേസ്മെന്റ് പിന്തുണ",
      mock_interview: "മോക്ക് ഇന്റർവ്യൂ",
      resume_analyzer: "റെസ്യൂമെ അനലൈസർ",
      readme_generator: "README ജനറേറ്റർ",
      cover_letter_generator: "കവർ ലെറ്റർ ജനറേറ്റർ",
      saved_templates: "സേവ് ചെയ്ത ടെംപ്ലേറ്റുകൾ",
      profile: "പ്രൊഫൈൽ",
      settings: "സെറ്റിങ്സ്"
    }
  },
  mr: {
    dashboard: { overview: "आढावा" },
    nav: {
      browse_templates: "टेम्प्लेट्स ब्राउझ करा",
      ai_assistant: "AI असिस्टंट",
      resume_templates: "रेझ्युमे टेम्प्लेट्स",
      placement_support: "प्लेसमेंट सपोर्ट",
      mock_interview: "मॉक इंटरव्ह्यू",
      resume_analyzer: "रेझ्युमे विश्लेषक",
      readme_generator: "README जनरेटर",
      cover_letter_generator: "कव्हर लेटर जनरेटर",
      saved_templates: "सेव्ह केलेले टेम्प्लेट्स",
      profile: "प्रोफाइल",
      settings: "सेटिंग्ज"
    }
  },
  bn: {
    dashboard: { overview: "ওভারভিউ" },
    nav: {
      browse_templates: "টেমপ্লেট ব্রাউজ করুন",
      ai_assistant: "এআই সহকারী",
      resume_templates: "রেজুমে টেমপ্লেট",
      placement_support: "প্লেসমেন্ট সাপোর্ট",
      mock_interview: "মক ইন্টারভিউ",
      resume_analyzer: "রেজুমে বিশ্লেষক",
      readme_generator: "README জেনারেটর",
      cover_letter_generator: "কভার লেটার জেনারেটর",
      saved_templates: "সংরক্ষিত টেমপ্লেট",
      profile: "প্রোফাইল",
      settings: "সেটিংস"
    }
  },
  gu: {
    dashboard: { overview: "ઝાંખી" },
    nav: {
      browse_templates: "ટેમ્પ્લેટ્સ બ્રાઉઝ કરો",
      ai_assistant: "AI સહાયક",
      resume_templates: "રેઝ્યૂમે ટેમ્પ્લેટ્સ",
      placement_support: "પ્લેસમેન્ટ સપોર્ટ",
      mock_interview: "મોક ઇન્ટરવ્યુ",
      resume_analyzer: "રેઝ્યૂમે વિશ્લેષક",
      readme_generator: "README જનરેટર",
      cover_letter_generator: "કવર લેટર જનરેટર",
      saved_templates: "સાચવેલા ટેમ્પ્લેટ્સ",
      profile: "પ્રોફાઇલ",
      settings: "સેટિંગ્સ"
    }
  },
  pa: {
    dashboard: { overview: "ਸੰਖੇਪ ਜਾਣਕਾਰੀ" },
    nav: {
      browse_templates: "ਟੈਂਪਲੇਟਸ ਬ੍ਰਾਊਜ਼ ਕਰੋ",
      ai_assistant: "AI ਸਹਾਇਕ",
      resume_templates: "ਰੈਜ਼ਿਊਮੇ ਟੈਂਪਲੇਟਸ",
      placement_support: "ਪਲੇਸਮੈਂਟ ਸਹਾਇਤਾ",
      mock_interview: "ਮੌਕ ਇੰਟਰਵਿਊ",
      resume_analyzer: "ਰੈਜ਼ਿਊਮੇ ਵਿਸ਼ਲੇਸ਼ਕ",
      readme_generator: "README ਜਨਰੇਟਰ",
      cover_letter_generator: "ਕਵਰ ਲੈਟਰ ਜਨਰੇਟਰ",
      saved_templates: "ਸੇਵ ਕੀਤੇ ਟੈਂਪਲੇਟਸ",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      settings: "ਸੈਟਿੰਗਜ਼"
    }
  }
};

locales.forEach(lang => {
  const dirPath = path.join(__dirname, 'public', 'locales', lang);
  const filePath = path.join(dirPath, 'translation.json');
  fs.writeFileSync(filePath, JSON.stringify(translations[lang], null, 2), 'utf-8');
  console.log(`Generated ${lang}/translation.json`);
});
