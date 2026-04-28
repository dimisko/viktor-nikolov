
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LEVELS } from './levels.ts';
import { GameState, Level, NPC, DialogueNode, Clue, Location } from './types.ts';

// --- STYLED COMPONENTS ---

const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  disabled?: boolean; 
  variant?: 'primary' | 'danger' | 'ghost' | 'success' | 'dossier' | 'paper';
  className?: string;
}> = ({ onClick, children, disabled, variant = 'primary', className = "" }) => {
  const baseStyles = "px-3 py-2 sm:px-4 sm:py-2 font-mono text-[10px] sm:text-xs transition-all duration-200 uppercase tracking-tighter border flex items-center gap-2 justify-center leading-tight";
  const variants = {
    primary: "bg-amber-900/20 text-amber-500 border-amber-900/50 hover:bg-amber-900/40",
    danger: "bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40",
    success: "bg-green-900/20 text-green-500 border-green-900/50 hover:bg-green-900/40",
    ghost: "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-800",
    dossier: "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700",
    paper: "bg-[#d9c5a3] text-black border-[#b09b78] hover:bg-[#c9b593]"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-20 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// --- PERSISTENT IMAGE ASSETS ---

const DB_NAME = "viktor_nikolov_assets";
const DB_VERSION = 1;
const STORE_NAME = "images";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getAsset = async (key: string): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
};

const setAsset = async (key: string, value: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const PersistentImage: React.FC<{ 
  assetKey: string; 
  source: string; 
  className?: string; 
  aspectRatio?: '1:1' | '16:9' | '4:3' | '9:16'
}> = ({ assetKey, source, className = "", aspectRatio = "1:1" }) => {
  return (
    <div className={`relative group ${className}`}>
      <img src={source} className={`w-full h-full object-cover grayscale brightness-75 contrast-125 group-hover:brightness-90 transition-all duration-700`} alt="Evidence" />
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 border border-white/10 pointer-events-none" />
    </div>
  );
};

// --- APP UI ---

const DossierHeader: React.FC<{ level: Level; migraine: number }> = ({ level, migraine }) => {
  const viktor = level.npcs['viktor'];
  return (
    <header className="bg-[#e6dcc5] text-zinc-900 border-b-2 border-[#b09b78] shadow-lg sticky top-0 z-[60] w-full">
      <div className="p-3 md:p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex gap-3 items-center min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-black/20 border border-black/10 overflow-hidden shadow-inner">
               <PersistentImage assetKey="npc_viktor" source={viktor.imageSource} className="w-full h-full" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 bg-red-800 text-white text-[8px] font-bold shrink-0">СТРОГО ДОВЕРЛИВО</span>
                <h1 className="text-sm md:text-xl font-bold tracking-tighter uppercase truncate leading-tight">{level.title}</h1>
              </div>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">ДОДЕЛЕНО: ИНСПЕКТОР ВИКТОР НИКОЛОВ</p>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-end">
            <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5 whitespace-nowrap">МИГРЕНАТА НА ВИКТОР</p>
            <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-black/10 border border-black/20 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${migraine > 75 ? 'bg-red-700' : 'bg-amber-800'}`} 
                style={{ width: `${migraine}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-black/10 pt-1.5">
          <p className="text-[10px] md:text-[11px] font-mono font-bold leading-snug opacity-80 text-zinc-800">
            {level.caseFile}
          </p>
        </div>
      </div>
    </header>
  );
};

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-4 sm:p-8 space-y-8 animate-in fade-in duration-1000 overflow-y-auto">
    <div className="max-w-2xl w-full border border-zinc-800 p-6 sm:p-8 bg-zinc-900/30 space-y-6 my-auto">
      <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tighter">ДОВЕРЛИВО</h2>
          <p className="text-[8px] sm:text-[10px] text-amber-600 uppercase tracking-widest">Одд. Тешки Кривични Дела</p>
        </div>
        <span className="text-zinc-600 font-mono text-[10px] sm:text-xs">
          LOG_{String(new Date().getMonth() + 1).padStart(2, '0')}-{new Date().getFullYear()}
        </span>
      </div>
      
      <div className="space-y-4 font-mono text-[10px] sm:text-xs text-zinc-400 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
        <p><span className="text-zinc-100 font-bold uppercase">ПРОЛОГОТ:</span> Ти си Млад Детектив префрлен од Битола. Скопје е понасилно и мириса на стар пепел од цигари.</p>
        <p>Доделен си на <span className="text-zinc-100">Главниот Инспектор Виктор Николов</span>. Тој е легенда, но корупцијата му дала трајна, оневозможувачка мигрена.</p>
        <p><span className="text-red-600 font-bold uppercase">СЛУЧАЈОТ:</span> Петар Стојанов, претприемач, бил пронајден мртов во 3:00 наутро на Камен Мост. Оставен да го земе Вардар. Без сведоци.</p>
        <p>Виктор чека. Пази глава. <span className="text-zinc-100 font-bold uppercase underline">ВАЖНО:</span> Ако си заглавен или ти треба насока за докази, врати се во станицата и <span className="text-zinc-100 font-bold">РАЗГОВАРАЈ СО ВИКТОР</span> директно. Тој знае како дише овој град.</p>
      </div>

      <div className="pt-4">
        <Button onClick={onStart} variant="primary" className="w-full py-4 text-xs sm:text-sm font-bold tracking-[0.2em]">ЗАПОЧНИ ИСТРАГА</Button>
      </div>
    </div>
  </div>
);

const WALKMAN_TRACKS = [
  { title: "I was made for lovin' you - KISS", context: "Виктор тапка со прстите на воланот. 'Класика за еден нереден град.'" },
  { title: "Can't Fight the Moonlight - LeAnn Rimes", context: "Гледа кон Камен Мост. 'Некои работи не можеш да ги победиш, партнер.'" },
  { title: "In the army now - Status Quo", context: "Му потсетува на задолжителната служба во 90-тите. Тежок воздух, тешки чизми." },
  { title: "Va Va Voom - Nicki Minaj", context: "Потиснува ретка насмевка. 'Младите во станицата го пуштаат ова. Е... заразно е.'" },
  { title: "Running up that hill - Placebo", context: "Виктор воздивнува. 'Секогаш се качуваш, никогаш не стигнуваш до врвот.'" },
  { title: "It's no good - Depeche Mode", context: "Нотите му помагаат да го блокира ѕвонењето во черепот." },
  { title: "A hard day's night - Les Crossaders", context: "Секоја ноќ во Скопје е тежок работен ден." },
  { title: "Ante Up - M.O.P.", context: "Битот паѓа. Очите на Виктор се заоструваат. 'Време е да притиснеме на осомничените.'" },
  { title: "Skandal - Toni Zen", context: "Локален скопски вајб. 'Тони го познава овој град подобро од повеќето од нас.'" },
  { title: "The Temple of The King - Rainbow", context: "Ги затвора очите. Овој секогаш го намалува болот." },
  { title: "The best is yet to come - Sinatra", context: "Чиста иронија. Во овој оддел, најдоброто обично е затворено досие." },
  { title: "Mother - Danzig", context: "Мисли за мајките кои никогаш не добиле правда. Тоа го поттикнува." },
  { title: "Say you will - Foreigner", context: "Виктор мрмори по мелодијата. 'Рок од 80-тите... единственото нешто кое не се менува.'" },
  { title: "Safari song - Greta van Fleet", context: "Енергија. Сурова сила. Ја чувствува мигрената дека малку се повлекува." },
  { title: "Lust for life - Iggy Pop", context: "И покрај корупцијата, Виктор сè уште има малку од ова останато." },
  { title: "Ace of Spades - Motorhead", context: "Го засилува звукот. 'Лими го разбираше коцкањето во овој тип на професија.'" },
  { title: "Brave new world - Iron maiden", context: "Гледа кон новите стаклени згради. 'Нема ништо храбро во тоа, Стив.'" },
  { title: "My one and only love - John Coltrane", context: "Саксофонот ја смирува бурата во главата. Совршенство." },
  { title: "Take a look around - Limp Bizkit", context: "Темата на Невозможна Мисија за мисија која изгледа невозможна." },
  { title: "Back in black - AC/DC", context: "Последното враќање. 'Назад на работа,' мрмори тој." },
  { title: "Ain't talkin' bout love - Van Halen", context: "Виктор се сеќава на неговата прва кожна јакна. Некаде е во кутија." },
  { title: "In Walks Barbarella - Clutch", context: "Грув. Чудно. Исто како ноќта во Дебар Маало." },
  { title: "O Children - Nick Cave", context: "Темнината на нумерата одговара на длабочината на Вардар." },
  { title: "Bella Stella - Highland", context: "Малку опера за да се облагороди местото на злосторство." },
  { title: "Caught out in the rain - Beth Hart", context: "Секој детектив во Скопје бил тука. Буквално и преносно." },
  { title: "Sound of da police - KRS-One", context: "Се смее тивко. 'Вуп-вуп... тоа сме ние, партнер.'" },
  { title: "Bella Ciao", context: "Химна за оние кои продолжуваат да се борат за доброто." },
  { title: "Movin' On - Tom Meighan", context: "Виктор го проверува часовникот. Мораме да продолжуваме да се движиме." },
  { title: "Hells Bells - AC/DC", context: "Ѕвоното што бие. Или за жртвата или за убиецот." },
  { title: "Don't Stop Belivin' - Journey", context: "'Верувај во доказите,' вели Виктор. 'Останатото е само шум.'" }
];

// --- PWA INSTALL PROMPT ---

const PWAInstallPrompt: React.FC<{ onInstall: () => void; onNo: () => void }> = ({ onInstall, onNo }) => (
  <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="w-full max-w-xs border border-zinc-800 bg-[#0a0a0a] p-6 space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl">
      <p className="text-xs text-zinc-300 font-mono leading-relaxed">
        Инсталирај ја апликацијата на телефонот?
      </p>
      <div className="flex gap-3">
        <Button onClick={onInstall} variant="primary" className="flex-1 py-3">ДА</Button>
        <Button onClick={onNo} variant="ghost" className="flex-1 py-3">НЕ</Button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (isStandalone || dismissed) return;

    const show = () => setShowInstallPrompt(true);

    if ((window as any).__pwaInstallPrompt) {
      setInstallPrompt((window as any).__pwaInstallPrompt);
      show();
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      show();
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstall = async () => {
    setShowInstallPrompt(false);
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
    }
  };

  const handleNo = () => {
    localStorage.setItem('pwa_install_dismissed', '1');
    setShowInstallPrompt(false);
  };

  const getInitialGameState = (): GameState => {
    const initialLevel = LEVELS[1];
    const initialUnlocked = Object.values(initialLevel.locations)
      .filter(l => l.isInitial)
      .map(l => l.id);
    
    return {
      currentLevelId: 1,
      currentLocationId: "police_station",
      discoveredClues: [],
      discoveredSuspects: [],
      unlockedLocations: initialUnlocked,
      witnessInteractions: {},
      migraineLevel: 20,
      isGameOver: false,
      gameWon: null
    };
  };

  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isAccusing, setIsAccusing] = useState(false);
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [walkmanTrackIndex, setWalkmanTrackIndex] = useState(-1);

  const currentLevel = useMemo(() => LEVELS[gameState.currentLevelId], [gameState.currentLevelId]);
  const currentLocation = useMemo(() => currentLevel.locations[gameState.currentLocationId], [currentLevel, gameState.currentLocationId]);

  useEffect(() => {
    const handleDiscoverClue = (e: any) => {
      const clueId = e.detail;
      if (clueId && !gameState.discoveredClues.includes(clueId)) {
        setGameState(prev => ({
          ...prev,
          discoveredClues: [...prev.discoveredClues, clueId]
        }));
        setFlavorText(`НОВ ДОКАЗ: ${currentLevel.clues[clueId]?.name || clueId}`);
        setTimeout(() => setFlavorText(null), 3000);
      }
    };

    window.addEventListener('discover_clue', handleDiscoverClue);
    return () => window.removeEventListener('discover_clue', handleDiscoverClue);
  }, [gameState.discoveredClues, currentLevel]);

  useEffect(() => {
    const newUnlocked = [...gameState.unlockedLocations];
    const clues = gameState.discoveredClues;
    
    if (clues.includes('receipt') && !newUnlocked.includes('debar_maalo')) newUnlocked.push('debar_maalo');
    if (clues.includes('hotel_card') && !newUnlocked.includes('hotel_arka')) newUnlocked.push('hotel_arka');
    if (clues.includes('tire_track') && !newUnlocked.includes('vardar_galleys')) newUnlocked.push('vardar_galleys');
    if (clues.includes('cufflink') && !newUnlocked.includes('markov_residence')) newUnlocked.push('markov_residence');

    if (newUnlocked.length !== gameState.unlockedLocations.length) {
      setGameState(prev => ({ ...prev, unlockedLocations: newUnlocked }));
      setFlavorText("КАРТАТА АЖУРИРАНА: НОВА ЛОКАЦИЈА ИДЕНТИФИКУВАНА");
      setTimeout(() => setFlavorText(null), 3000);
    }
  }, [gameState.discoveredClues]);

  const resetGame = () => {
    setGameState(getInitialGameState());
    setShowIntro(true);
    setActiveNPC(null);
    setCurrentDialogue(null);
    setIsAccusing(false);
    setWalkmanTrackIndex(-1);
    setFlavorText(null);
  };

  const getPartnerHint = () => {
    const clues = gameState.discoveredClues;
    const loc = gameState.currentLocationId;

    if (loc === 'stone_bridge' && !clues.includes('receipt')) return "Пребарај кај контејнерот за отпад, партнер.";
    if (loc === 'debar_maalo' && !clues.includes('hotel_card')) return "Лазо крие нешто. Пребарај кај менијата.";
    if (loc === 'hotel_arka' && (!clues.includes('cufflink') || !clues.includes('blackmail_docs'))) return "Провери го сефот и пребарај под мебелот.";
    if (loc === 'vardar_galleys' && !clues.includes('guard_logbook')) return "Провери го чуварскиот пост. Дневникот може да има нешто.";
    if (loc === 'markov_residence' && !clues.includes('missing_statuette')) return "Провери ја кутијата за изложба во ходникот.";
    if (loc === 'markov_residence' && !clues.includes('murder_weapon')) return "Мора да го скрие некаде на имотот. Продолжи да пребаруваш.";

    if (!clues.includes('receipt')) return "Назад на Камен Мост. Пропуштивме нешто.";
    if (!clues.includes('hotel_card')) return "Оди во Дебар Маало.";
    if (!clues.includes('cufflink')) return "Арка. Соба 402. Трагата поинаку се лади.";
    if (!clues.includes('blackmail_docs')) return "Има уште нешто во таа хотелска соба. Провери го сефот.";
    if (!clues.includes('guard_logbook')) return "Некој на галиите бил на дежурство минатата ноќ. Оди да прашаш.";
    if (!clues.includes('missing_statuette')) return "Оди до имотот на Маркови.";
    if (!clues.includes('murder_weapon')) return "Темелно пребарај го имотот на Маркови. Не отишла далеку со него.";
    if (!clues.includes('fingerprints')) return "Однеси ја мистријата кај Д-р Павлов во станицата.";

    return "Го имаме сè. Оди во Станицата за налогот.";
  };

  const currentStatus = useMemo(() => getPartnerHint(), [gameState.discoveredClues, gameState.currentLocationId]);

  const handleSearch = () => {
    const locSearches = currentLocation.searches;
    const undiscovered = locSearches.filter(s => s.clueId && !gameState.discoveredClues.includes(s.clueId));
    
    if (undiscovered.length > 0) {
      const result = undiscovered[0];
      const migraineDelta = result.clueId === 'migraine_relief' ? -50 : 4;
      
      setGameState(prev => ({
        ...prev,
        discoveredClues: [...prev.discoveredClues, result.clueId!],
        migraineLevel: Math.max(0, Math.min(100, prev.migraineLevel + migraineDelta))
      }));
      setFlavorText(result.description);
    } else {
      setFlavorText("Пребарувањето завршено. Нема нови докази.");
    }
    setTimeout(() => setFlavorText(null), 4000);
  };

  const startDialogue = (npcId: string) => {
    const npc = currentLevel.npcs[npcId];
    setActiveNPC(npc);
    if (!gameState.discoveredSuspects.includes(npcId)) {
      setGameState(prev => ({ ...prev, discoveredSuspects: [...prev.discoveredSuspects, npcId] }));
    }
    
    if (npcId === 'viktor' && gameState.migraineLevel >= 100) {
      setCurrentDialogue({
        id: "v_incapacitated",
        speaker: "Viktor",
        text: "Виктор ја стега главата, очите цврсто затворени. Те погледнува само за миг, се свиткува, и го свртува погледот. Притисокот во черепот е преголем; не може да се фокусира ни на твоите зборови.",
        options: []
      });
    } else {
      setCurrentDialogue(npc.dialogue[npc.initialNode]);
    }
  };

  const handleDialogueOption = (nextId: string, onSelect?: () => void) => {
    if (!activeNPC) return;
    
    if (onSelect) {
      onSelect();
    }

    if (!nextId || !activeNPC.dialogue[nextId]) {
      setActiveNPC(null);
      setCurrentDialogue(null);
      return;
    }

    let nextNode = activeNPC.dialogue[nextId];
    if (nextId === 'v_help') {
      nextNode = { ...nextNode, text: currentStatus };
      setGameState(prev => ({ ...prev, migraineLevel: Math.min(100, prev.migraineLevel + 8) }));
    }

    setCurrentDialogue(nextNode);
  };

  const handleAccusation = (killerId: string, motive: string, evidenceId: string) => {
    const isCorrect = 
      killerId === currentLevel.solution.killerId && 
      motive === currentLevel.solution.motive && 
      evidenceId === currentLevel.solution.evidenceId;

    setGameState(prev => ({ ...prev, isGameOver: true, gameWon: isCorrect }));
    setIsAccusing(false);
  };

  const toggleWalkman = () => {
    const nextIndex = (walkmanTrackIndex + 1) % WALKMAN_TRACKS.length;
    setWalkmanTrackIndex(nextIndex);
    const track = WALKMAN_TRACKS[nextIndex];
    
    setGameState(prev => ({
      ...prev,
      migraineLevel: Math.max(0, prev.migraineLevel - 5)
    }));

    setFlavorText(`📻 СЕ ПУШТА: ${track.title} -- ${track.context} (МИГРЕНАТА НАМАЛЕНА)`);
    setTimeout(() => setFlavorText(null), 6000);
  };

  const availableDialogueOptions = useMemo(() => {
    if (!currentDialogue) return [];
    return currentDialogue.options.filter(opt => 
      !opt.requirement || (opt.requirement.clueId && gameState.discoveredClues.includes(opt.requirement.clueId))
    );
  }, [currentDialogue, gameState.discoveredClues]);

  if (showIntro) return <IntroScreen onStart={() => setShowIntro(false)} />;

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 font-mono text-zinc-100 grainy overflow-y-auto">
        <div className="max-w-xl w-full border-2 border-zinc-800 p-6 sm:p-8 text-center space-y-6 bg-zinc-900/40 shadow-[0_0_50px_rgba(0,0,0,1)] my-auto">
          <h2 className={`text-3xl sm:text-5xl font-bold tracking-tighter ${gameState.gameWon ? 'text-green-500' : 'text-red-500'}`}>
            {gameState.gameWon ? "СЛУЧАЈ РЕШЕН" : "СЛУЧАЈОТ ОЛАДИ"}
          </h2>
          <div className="h-0.5 bg-zinc-800 w-full" />
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {gameState.gameWon 
              ? `Марија Маркова беше приведена. Сребрената мистрија беше клучниот доказ. Виктор гледа кон светлините на градот: 'Добра работа, партнер. Кафето е од мене.'`
              : "Налогот беше одбиен. Маркови побегнаа во Грција. Виктор ја предаде значката. Скопје останува тивко."}
          </p>
          <Button onClick={resetGame} variant="primary" className="w-full sm:w-auto mx-auto py-4">ПОВТОРНО ОТВОРИ ДОСИЕ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto flex flex-col border-x border-zinc-800 bg-[#0a0a0a] shadow-2xl relative grainy font-mono">
      <DossierHeader level={currentLevel} migraine={gameState.migraineLevel} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 pb-32">
        {flavorText && (
          <div className="fixed top-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-amber-950 text-amber-100 p-3 sm:p-4 border-2 border-amber-600 text-[9px] sm:text-xs z-[70] animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl uppercase text-center border-double">
            {flavorText}
          </div>
        )}

        {activeNPC && currentDialogue ? (
          <div className="border border-amber-900/30 bg-zinc-900/50 p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex gap-4 sm:gap-6 items-start">
               <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 bg-black/40 border border-zinc-800 shadow-2xl rotate-1">
                  <PersistentImage assetKey={`npc_${activeNPC.id}`} source={activeNPC.imageSource} className="w-full h-full" />
               </div>
               <div>
                  <p className="text-[8px] sm:text-[10px] text-amber-500 uppercase tracking-[0.3em] mb-1">{activeNPC.role}</p>
                  <h3 className="text-lg sm:text-2xl font-bold text-zinc-100">{activeNPC.name}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">{activeNPC.description}</p>
               </div>
            </div>
            <div className="py-3 sm:py-4 border-y border-zinc-800">
              <p className="text-zinc-300 leading-relaxed font-serif text-sm sm:text-lg">"{currentDialogue.text}"</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {availableDialogueOptions.map((opt, i) => (
                <Button key={i} onClick={() => handleDialogueOption(opt.nextId, opt.onSelect)} className="text-left justify-start">
                  {opt.text}
                </Button>
              ))}
              {availableDialogueOptions.length === 0 && (
                <Button variant="success" onClick={() => { setActiveNPC(null); setCurrentDialogue(null); }}>ЗАВРШИ РАЗГОВОР</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            <section className="space-y-4 sm:space-y-6">
              <div className="relative w-full aspect-video bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
                 <PersistentImage assetKey={`loc_${currentLocation.id}`} source={currentLocation.imageSource} aspectRatio="16:9" className="w-full h-full" />
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 text-[8px] text-zinc-400 tracking-widest uppercase">
                    FILE_LOC_{currentLocation.id.toUpperCase()}
                 </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 sm:w-1.5 sm:h-8 bg-amber-600" />
                  <h2 className="text-xl sm:text-3xl font-bold text-zinc-100 tracking-tight uppercase">{currentLocation.name}</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm md:text-base border-l border-zinc-800 pl-4 sm:pl-6">
                  {currentLocation.description}
                </p>
              </div>
            </section>

            <section className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSearch} variant="primary" className="flex-1 py-4 text-xs font-bold border-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                ПРЕБАРАЈ ОБЛАСТ
              </Button>
              {currentLocation.npcs.map(nId => {
                const npc = currentLevel.npcs[nId];
                let label = nId === 'viktor' ? "РАЗГОВАРАЈ СО ВИКТОР" : nId === 'kiril' ? "РАЗГОВАРАЈ СО Д-Р ПАВЛОВ" : `ИСПРАШАЈ ${npc.name.split(' ')[0]}`;
                return (
                  <Button key={nId} onClick={() => startDialogue(nId)} variant="dossier" className="flex-1 py-4 text-xs font-bold border-2">
                    {label}
                  </Button>
                );
              })}
            </section>

            <section className="space-y-3 sm:space-y-4 border-t border-zinc-900 pt-6">
              <h4 className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Истражи локации</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gameState.unlockedLocations.map(locId => (
                  <Button 
                    key={locId} 
                    variant={gameState.currentLocationId === locId ? 'success' : 'ghost'}
                    className={`text-[8px] sm:text-[9px] py-2 sm:py-3 ${gameState.currentLocationId === locId ? 'border-2' : ''}`}
                    onClick={() => {
                      setGameState(prev => ({ ...prev, currentLocationId: locId, migraineLevel: Math.min(100, prev.migraineLevel + 1) }));
                      setActiveNPC(null); 
                      setCurrentDialogue(null);
                    }}
                  >
                    {currentLevel.locations[locId].name}
                  </Button>
                ))}
              </div>
            </section>

            <section className="border-t border-zinc-900 pt-6 sm:pt-8">
              <h4 className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold mb-4">Трезор за докази</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameState.discoveredClues.map(cId => {
                  const clue = currentLevel.clues[cId];
                  return (
                    <div key={cId} className="p-2 sm:p-3 border border-zinc-800 bg-zinc-900/30 rounded-sm flex items-start gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-black/40 border border-zinc-800 overflow-hidden shadow-md">
                         <PersistentImage assetKey={`clue_${cId}`} source={clue.imageSource} className="w-full h-full" />
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <h5 className="text-[10px] sm:text-[11px] font-bold text-amber-500 uppercase mb-0.5 truncate">{clue.name}</h5>
                        <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-tight line-clamp-2">"{clue.description}"</p>
                      </div>
                    </div>
                  );
                })}
                {gameState.discoveredClues.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 text-center py-6 sm:py-8 border border-dashed border-zinc-800 opacity-20 text-[8px] sm:text-[10px] uppercase tracking-widest">Нема собрани докази</div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky bottom-0 z-50 flex justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            className="text-[8px] sm:text-[9px] text-amber-500/80 p-2 sm:px-4 border-amber-900/30" 
            onClick={toggleWalkman}
          >
            <span>📻 WALKMAN</span>
          </Button>
        </div>
        
        {gameState.currentLocationId === 'police_station' && !activeNPC && (
          <Button variant="danger" className="px-4 sm:px-8 font-bold border-2 animate-pulse text-[10px] sm:text-xs" onClick={() => setIsAccusing(true)}>
            ПОДНЕСИ НАЛОГ
          </Button>
        )}
      </footer>

      {showInstallPrompt && (
        <PWAInstallPrompt onInstall={handleInstall} onNo={handleNo} />
      )}

      {isAccusing && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="max-w-xl w-full border-2 border-red-900/50 bg-[#050505] p-6 sm:p-8 space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl my-auto">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-3xl font-bold text-red-600 uppercase tracking-tighter">ФИНАЛНО ДОСИЕ ЗА АПСЕЊЕ</h2>
              <p className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Избери осомничен, мотив и оружје.</p>
            </div>
            
            <AccusationForm 
              level={currentLevel} 
              onClose={() => setIsAccusing(false)} 
              onAccuse={handleAccusation}
              clues={gameState.discoveredClues}
              discoveredSuspects={gameState.discoveredSuspects}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AccusationForm: React.FC<{
  level: Level;
  onClose: () => void;
  onAccuse: (killer: string, motive: string, evidence: string) => void;
  clues: string[];
  discoveredSuspects: string[];
}> = ({ level, onClose, onAccuse, clues, discoveredSuspects }) => {
  const [killer, setKiller] = useState("");
  const [motive, setMotive] = useState("");
  const [evidence, setEvidence] = useState("");

  const motives = ["Лична освета", "Деловна ривалност", "Злосторство од страст", "Случајна смрт"];

  return (
    <div className="space-y-4 sm:space-y-6 font-mono">
      <div className="space-y-1 sm:space-y-2">
        <label className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold">ID НА ОСОМНИЧЕН</label>
        <select value={killer} onChange={e => setKiller(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 sm:p-3 text-[10px] sm:text-xs uppercase outline-none focus:border-red-600 appearance-none rounded-none">
          <option value="">-- ИЗБЕРИ --</option>
          {discoveredSuspects.filter(id => id !== 'viktor' && id !== 'kiril' && id !== 'waiter' && id !== 'guard').map(id => (
            <option key={id} value={id}>{level.npcs[id].name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1 sm:space-y-2">
        <label className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold">МОТИВ</label>
        <select value={motive} onChange={e => setMotive(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 sm:p-3 text-[10px] sm:text-xs uppercase outline-none focus:border-red-600 appearance-none rounded-none">
          <option value="">-- ИЗБЕРИ --</option>
          {motives.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="space-y-1 sm:space-y-2">
        <label className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold">ДОКАЗ (ОРУЖЈЕ)</label>
        <select value={evidence} onChange={e => setEvidence(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 sm:p-3 text-[10px] sm:text-xs uppercase outline-none focus:border-red-600 appearance-none rounded-none">
          <option value="">-- ИЗБЕРИ --</option>
          {clues.map(cId => <option key={cId} value={cId}>{level.clues[cId].name}</option>)}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
        <Button variant="ghost" onClick={onClose} className="w-full py-3">ОТКАЖИ</Button>
        {killer && motive && evidence && (
          <Button
            variant="danger"
            className="w-full py-3"
            onClick={() => onAccuse(killer, motive, evidence)}
          >
            ИЗВРШИ НАЛОГ
          </Button>
        )}
      </div>
    </div>
  );
};

export default App;
