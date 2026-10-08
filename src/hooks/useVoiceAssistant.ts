import { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageCode } from '../types';

export interface VoiceAssistantState {
  isListening: boolean;
  isSpeaking: boolean;
  isHandsFree: boolean;
  transcript: string;
  supported: boolean;
  error: string | null;
  permissionDenied: boolean;
  permissionMessage: string | null;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
  toggleHandsFree: () => void;
  speakText: (text: string, langCode: LanguageCode) => void;
  clearError: () => void;
}

/**
 * Localized permission error messages for all AsaniBiz supported languages
 */
export const getMicPermissionErrorMessage = (lang: LanguageCode): string => {
  switch (lang) {
    case 'ur':
      return 'مائیکروفون کی اجازت درکار ہے۔ براہ کرم براؤزر ایڈریس بار کے تالا (🔒) آئیکن پر کلک کریں اور مائیکروفون کی اجازت (Allow) کریں۔';
    case 'sd':
      return 'مائيڪرو فون جي اجازت گهربل آهي. مهرباني ڪري برائوزر ايڊريس بار (🔒) تي ڪلڪ ڪري مائيڪ کي اجازت ڏيو (Allow).';
    case 'ps':
      return 'د مایکروفون اجازې ته اړتیا ده. مهرباني وکړئ په براوزر (🔒) کې مایکروفون ته اجازه ورکړئ (Allow).';
    case 'pa':
      return 'مائیکروفون دی اجازت ضروری اے۔ مہربانی کر کے براؤزر دی ایڈریس بار چ مائیک دی اجازت الاؤ (Allow) کرو۔';
    case 'ur-roman':
      return 'Microphone permission zaroori hai. Barah-e-karam browser address bar (🔒) mein microphone ko "Allow" karein.';
    case 'en':
    default:
      return 'Microphone access is required. Please click the lock icon (🔒) in your browser address bar and allow microphone access.';
  }
};

export function useVoiceAssistant(
  language: LanguageCode,
  onSpeechResult: (text: string) => void
): VoiceAssistantState {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const isHandsFreeRef = useRef(false);
  const onSpeechResultRef = useRef(onSpeechResult);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const lastProcessedTextRef = useRef<string>('');
  const lastProcessedTimeRef = useRef<number>(0);

  // Keep references fresh without tearing down SpeechRecognition
  onSpeechResultRef.current = onSpeechResult;
  isHandsFreeRef.current = isHandsFree;
  isListeningRef.current = isListening;
  isSpeakingRef.current = isSpeaking;

  // Load available system voices for natural pronunciation
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      } catch (e) {
        // ignore
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setPermissionDenied(false);
    setPermissionMessage(null);
  }, []);

  // Initialize SpeechRecognition instance
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        // Select speech language code for 5 core languages + roman
        let speechLang = 'ur-PK';
        if (language === 'en') speechLang = 'en-US';
        else if (language === 'pa') speechLang = 'pa-PK'; // Punjabi (Pakistan)
        else if (language === 'sd') speechLang = 'sd-PK'; // Sindhi (Pakistan)
        else if (language === 'ps') speechLang = 'ps-AF'; // Pashto
        else if (language === 'ur-roman') speechLang = 'ur-PK';
        else speechLang = 'ur-PK'; // Urdu default

        recognition.lang = speechLang;

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
          setError(null);
          setPermissionDenied(false);
          setPermissionMessage(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          if (event && event.results) {
            for (let i = event.resultIndex || 0; i < event.results.length; i++) {
              const resItem = event.results[i];
              if (resItem && resItem[0] && resItem[0].transcript) {
                currentTranscript += resItem[0].transcript;
              }
            }
            setTranscript(currentTranscript);

            // If finalized
            const lastResult = event.results[event.results.length - 1];
            if (lastResult && lastResult.isFinal) {
              const finalText = currentTranscript.trim();
              const now = Date.now();
              // Prevent duplicate triggers if final result repeats within 1000ms
              if (
                finalText &&
                (finalText !== lastProcessedTextRef.current || now - lastProcessedTimeRef.current > 1000)
              ) {
                lastProcessedTextRef.current = finalText;
                lastProcessedTimeRef.current = now;
                onSpeechResultRef.current?.(finalText);
              }
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setPermissionDenied(true);
            const msg = getMicPermissionErrorMessage(language);
            setPermissionMessage(msg);
            setError(msg);
          } else if (event.error === 'audio-capture') {
            const msg = language === 'ur'
              ? 'مائیکروفون دستیاب نہیں ہے۔ براہ کرم مائیک چیک کریں۔'
              : 'Microphone is not available. Please check mic settings.';
            setError(msg);
            setPermissionMessage(msg);
          } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setError(event.error);
          }
          setIsListening(false);
          isListeningRef.current = false;
        };

        recognition.onend = () => {
          setIsListening(false);
          isListeningRef.current = false;
          // If hands-free is enabled and we are NOT speaking, resume listening safely after a brief pause
          if (isHandsFreeRef.current && !isSpeakingRef.current) {
            setTimeout(() => {
              if (isHandsFreeRef.current && !isSpeakingRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (e) {
                  // already active or stopping
                }
              }
            }, 600);
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Could not initialize SpeechRecognition:', err);
      }
    } else {
      setSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [language]);

  /**
   * Start listening with explicit microphone permission check and request
   */
  const startListening = useCallback(async (): Promise<boolean> => {
    // 1. Check secure context for mobile PWA/HTTPS
    if (
      typeof window !== 'undefined' &&
      !window.isSecureContext &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      const msg = 'براؤزر میں مائیکروفون کے لیے محفوظ کنکشن (HTTPS) ضروری ہے۔';
      setError(msg);
      setPermissionMessage(msg);
      setPermissionDenied(true);
      return false;
    }

    // 2. Request native microphone permission explicitly to trigger mobile prompt
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release tracks so SpeechRecognition can acquire the hardware mic
        stream.getTracks().forEach((track) => track.stop());
        setPermissionDenied(false);
        setPermissionMessage(null);
        setError(null);
      } catch (mediaErr: any) {
        console.warn('Microphone permission request failed:', mediaErr);
        if (
          mediaErr.name === 'NotAllowedError' ||
          mediaErr.name === 'PermissionDeniedError' ||
          mediaErr.name === 'SecurityError'
        ) {
          const msg = getMicPermissionErrorMessage(language);
          setPermissionDenied(true);
          setPermissionMessage(msg);
          setError(msg);
          setIsListening(false);
          return false;
        }
      }
    }

    // 3. Start SpeechRecognition
    if (!recognitionRef.current) {
      const msg = 'آپ کے براؤزر میں وائس اسپیچ سپورٹ موجود نہیں ہے۔ گوگل کروم استعمال کریں۔';
      setError(msg);
      return false;
    }

    try {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      return true;
    } catch (e: any) {
      // If already started, that's fine
      if (e.name === 'InvalidStateError') {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (inner) {
              // ignore
            }
          }, 200);
        } catch (stopErr) {
          // ignore
        }
      } else {
        console.warn('Recognition start error:', e);
      }
      return false;
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setIsHandsFree(false);
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // ignore
    }
    setIsListening(false);
  }, []);

  const toggleHandsFree = useCallback(() => {
    setIsHandsFree((prev) => {
      const next = !prev;
      if (next) {
        startListening();
      } else {
        stopListening();
      }
      return next;
    });
  }, [startListening, stopListening]);

  const speakText = useCallback((text: string, langCode: LanguageCode) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();

      // Clean markdown tags, stars, and bullets for smooth spoken natural pronunciation
      const cleanedText = text
        .replace(/[*#_`~]/g, '')
        .replace(/[•-]\s+/g, ', ')
        .replace(/\n+/g, '. ')
        .trim();

      if (!cleanedText) return;

      const utterance = new SpeechSynthesisUtterance(cleanedText);

      // Map language code to BCP 47 tag
      let bcpLang = 'ur-PK';
      if (langCode === 'en') bcpLang = 'en-US';
      else if (langCode === 'pa') bcpLang = 'pa-PK';
      else if (langCode === 'sd') bcpLang = 'sd-PK';
      else if (langCode === 'ps') bcpLang = 'ps-AF';
      else if (langCode === 'ur-roman') bcpLang = 'ur-PK';
      else bcpLang = 'ur-PK';

      utterance.lang = bcpLang;

      // Try finding the best available system voice for the language
      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const langPrefix = bcpLang.split('-')[0].toLowerCase();

      // 1. Exact match
      let matchingVoice = voices.find((v) => v.lang.toLowerCase() === bcpLang.toLowerCase());

      // 2. Prefix match (e.g. 'ur', 'pa', 'sd', 'ps', 'en')
      if (!matchingVoice) {
        matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      }

      // 3. Fallback for regional Pakistani languages (sd, ps, pa) when device lacks dedicated pack
      if (!matchingVoice && (langCode === 'sd' || langCode === 'ps' || langCode === 'pa')) {
        matchingVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('ur') ||
            v.lang.toLowerCase().startsWith('hi') ||
            v.lang.toLowerCase().startsWith('ar')
        );
      }

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      // Natural speech cadence & pitch
      utterance.rate = 0.94;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
        // Pause microphone while assistant speaks through phone speaker
        if (recognitionRef.current && isListeningRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (e) {
            // ignore
          }
        }
      };

      const handleSpeechFinished = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        // If Hands-Free is active, resume listening after speaking ends
        if (isHandsFreeRef.current) {
          setTimeout(() => {
            if (isHandsFreeRef.current && !isSpeakingRef.current) {
              startListening();
            }
          }, 350);
        }
      };

      utterance.onend = handleSpeechFinished;
      utterance.onerror = handleSpeechFinished;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
  }, [availableVoices, startListening]);

  return {
    isListening,
    isSpeaking,
    isHandsFree,
    transcript,
    supported,
    error,
    permissionDenied,
    permissionMessage,
    startListening,
    stopListening,
    toggleHandsFree,
    speakText,
    clearError,
  };
}
