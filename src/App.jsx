import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as Lucide from 'lucide-react';
const { Bell, Settings, Search, Play, Pause, Download, Check, X, Volume2, VolumeX, Mic, MicOff, Users, MessageSquare, Trophy, ShoppingBag, Heart, Wifi, Power, Eye, Sparkles, ChevronRight, ChevronLeft, MoreHorizontal, HardDrive, Gamepad2, Headphones, Tv, Send, Maximize2, Award, Flame, Clock, RotateCcw, Radio, CheckCircle2, Layers } = Lucide;
const Sliders = Lucide.Sliders || Lucide.SlidersHorizontal || Lucide.SlidersVertical || Lucide.Settings2 || Lucide.Settings;

/**
 * ============================================================================
 * ÖG PLAY — SISTEMA OPERATIVO VISUAL DE CONSOLA DE NUEVA GENERACIÓN (ÖG5)
 * ============================================================================
 * Arquitectura modular en un solo archivo con:
 * - Motor de sonido táctil cristalino (Web Audio API)
 * - Iluminación ambiental dinámica reactiva al título seleccionado
 * - Arte cinematográfico multicapa SVG/CSS de alta definición (cero fallos de red)
 * - 6 Secciones completas: Inicio, Explorar, Biblioteca, Tienda, Amigos, Perfil
 * - Centro de Control flotante con 7 módulos funcionales
 * - Accesibilidad en tiempo real (Alto contraste, Texto grande, Reducir movimiento, Daltonismo)
 * - Soporte completo de teclado (← →, Enter, Esc, C) y gestos táctiles/ratón
 */

/* ============================================================================
 * 1. MOTOR DE AUDIO TÁCTIL CRISTALINO (WEB AUDIO API)
 * ============================================================================ */
const createSoundEngine = () => {
  let ctx = null;

  const getContext = () => {
    if (!ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  };

  const playTone = ({
    freq = 880,
    endFreq = null,
    duration = 0.09,
    type = 'sine',
    volume = 0.08,
    delay = 0
  }) => {
    try {
      const audioCtx = getContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Ignorar restricciones de autoplay si aún no hubo interacción
    }
  };

  return {
    navigate: (enabled, masterVol) => {
      if (!enabled || masterVol <= 0) return;
      const v = (masterVol / 100) * 0.06;
      playTone({ freq: 920, endFreq: 1280, duration: 0.065, type: 'sine', volume: v });
    },
    select: (enabled, masterVol) => {
      if (!enabled || masterVol <= 0) return;
      const v = (masterVol / 100) * 0.09;
      playTone({ freq: 587.33, duration: 0.14, type: 'sine', volume: v });
      playTone({ freq: 880, duration: 0.22, type: 'triangle', volume: v * 0.7, delay: 0.045 });
    },
    back: (enabled, masterVol) => {
      if (!enabled || masterVol <= 0) return;
      const v = (masterVol / 100) * 0.07;
      playTone({ freq: 660, endFreq: 420, duration: 0.11, type: 'sine', volume: v });
    },
    openPanel: (enabled, masterVol) => {
      if (!enabled || masterVol <= 0) return;
      const v = (masterVol / 100) * 0.075;
      playTone({ freq: 392, endFreq: 587.33, duration: 0.16, type: 'sine', volume: v });
      playTone({ freq: 783.99, duration: 0.24, type: 'sine', volume: v * 0.5, delay: 0.04 });
    },
    notification: (enabled, masterVol) => {
      if (!enabled || masterVol <= 0) return;
      const v = (masterVol / 100) * 0.08;
      playTone({ freq: 1046.5, duration: 0.12, type: 'sine', volume: v });
      playTone({ freq: 1318.5, duration: 0.2, type: 'sine', volume: v * 0.85, delay: 0.08 });
    },
    boot: (enabled, masterVol) => {
      if (!enabled || masterVol <= 0) return;
      const v = (masterVol / 100) * 0.11;
      playTone({ freq: 130.81, duration: 1.4, type: 'sine', volume: v });
      playTone({ freq: 261.63, duration: 1.2, type: 'triangle', volume: v * 0.5, delay: 0.1 });
      playTone({ freq: 392.0, duration: 1.3, type: 'sine', volume: v * 0.45, delay: 0.2 });
      playTone({ freq: 587.33, duration: 1.5, type: 'sine', volume: v * 0.35, delay: 0.32 });
    }
  };
};

const soundEngine = createSoundEngine();

/* ============================================================================
 * 2. CATÁLOGO DE VIDEOJUEGOS Y DATOS DEL SISTEMA ÖG PLAY
 * ============================================================================ */
const GAMES_DATA = [
  {
    id: 'aetheria',
    title: 'AETHERIA: ECLIPSE OF SOULS',
    shortTitle: 'AETHERIA',
    subtitle: 'ECLIPSE OF SOULS',
    genre: 'RPG de Acción • Fantasía Oscura',
    developer: 'Vanguard Obsidian Studios',
    releaseYear: '2026',
    rating: 'PEGI 18',
    sizeGB: 94.6,
    installed: true,
    inCollection: true,
    ogPass: false,
    progress: 72,
    trophiesEarned: 38,
    trophiesTotal: 52,
    hoursPlayed: 86.5,
    lastPlayed: 'Hoy',
    price: 79.99,
    deluxePrice: 99.99,
    discount: 0,
    ambientPrimary: '#e11d48',
    ambientSecondary: '#f59e0b',
    ambientGlow: 'rgba(225, 29, 72, 0.42)',
    themeKey: 'aetheria',
    description:
      'Adéntrate en el reino fracturado de Solis-Vael bajo un eclipse eterno. Domina el acero alquímico y las artes umbrías en combates viscerales a 120 FPS con trazado de rayos en tiempo real.',
    activities: [
      {
        id: 'act-ae-1',
        type: 'Misión en curso',
        title: 'Capítulo IV: El Trono de Ceniza',
        detail: '72% completado • ~35 min restantes',
        progress: 72,
        badge: 'Historia Principal'
      },
      {
        id: 'act-ae-2',
        type: 'Próximo trofeo sugerido',
        title: 'Heredero del Eclipse',
        detail: 'Oro • Derrota al Guardián Solar sin recibir daño (4.2%)',
        progress: 45,
        badge: 'Trofeo Oro'
      },
      {
        id: 'act-ae-3',
        type: 'Captura reciente',
        title: 'Catedral Carmesí — Modo Foto 4K HDR',
        detail: 'Capturado ayer a las 23:14',
        progress: null,
        badge: 'Galería'
      },
      {
        id: 'act-ae-4',
        type: 'Amigos jugando ahora',
        title: 'Kira_Nyx y Drako_99',
        detail: 'En modo Cooperativo Abisal • Unirse',
        progress: null,
        badge: 'En vivo'
      }
    ]
  },
  {
    id: 'neon-drift',
    title: 'NEON DRIFT: TOKYO 2099',
    shortTitle: 'NEON DRIFT',
    subtitle: 'TOKYO 2099',
    genre: 'Carreras Cyberpunk • Alta Velocidad',
    developer: 'Kurogane Interactive',
    releaseYear: '2026',
    rating: 'PEGI 12',
    sizeGB: 68.2,
    installed: true,
    inCollection: true,
    ogPass: true,
    progress: 88,
    trophiesEarned: 44,
    trophiesTotal: 48,
    hoursPlayed: 112.0,
    lastPlayed: 'Ayer',
    price: 69.99,
    deluxePrice: 89.99,
    discount: 25,
    ambientPrimary: '#06b6d4',
    ambientSecondary: '#d946ef',
    ambientGlow: 'rgba(6, 182, 212, 0.42)',
    themeKey: 'neondrift',
    description:
      'Derrapa a más de 480 km/h por las autopistas elevadas de Neo-Shibuya bajo tormentas de neón. Personaliza motores de plasma y siente cada vibración del asfalto húmedo.',
    activities: [
      {
        id: 'act-nd-1',
        type: 'Misión en curso',
        title: 'Copa Suprema Circuito Shuto',
        detail: 'Final Nocturna • 88% de temporada completada',
        progress: 88,
        badge: 'Campeonato'
      },
      {
        id: 'act-nd-2',
        type: 'Próximo trofeo sugerido',
        title: 'Relámpago de Neón',
        detail: 'Platino • Consigue 3 estrellas en todos los sectores',
        progress: 91,
        badge: 'Casi desbloqueado'
      },
      {
        id: 'act-nd-3',
        type: 'Captura reciente',
        title: 'Distrito Holográfico — Salto Orbital',
        detail: 'Capturado hace 2 días',
        progress: null,
        badge: 'Galería'
      },
      {
        id: 'act-nd-4',
        type: 'Amigos jugando ahora',
        title: 'Sora_Valkyrie está en pista',
        detail: 'Récord de vuelta: 01:42.18 • Desafiar',
        progress: null,
        badge: 'Contrarreloj'
      }
    ]
  },
  {
    id: 'orbital-zero',
    title: 'ORBITAL ZERO',
    shortTitle: 'ORBITAL ZERO',
    subtitle: 'GRAVITY PROTOCOL',
    genre: 'Shooter Táctico Sci-Fi • Gravedad Cero',
    developer: 'Aegis Aerospace Games',
    releaseYear: '2026',
    rating: 'PEGI 16',
    sizeGB: 82.4,
    installed: true,
    inCollection: true,
    ogPass: true,
    progress: 54,
    trophiesEarned: 27,
    trophiesTotal: 50,
    hoursPlayed: 64.2,
    lastPlayed: 'Hace 2 días',
    price: 69.99,
    deluxePrice: 89.99,
    discount: 0,
    ambientPrimary: '#2563eb',
    ambientSecondary: '#38bdf8',
    ambientGlow: 'rgba(37, 99, 235, 0.45)',
    themeKey: 'orbital',
    description:
      'Operaciones tácticas en estaciones orbitales despresurizadas. Manipula campos magnéticos, coordina escuadrones en audio espacial 3D y asegura el perímetro terrestre.',
    activities: [
      {
        id: 'act-oz-1',
        type: 'Misión en curso',
        title: 'Operación Horizonte Silencioso',
        detail: 'Sector 07 • Infiltración en vacío',
        progress: 54,
        badge: 'Campaña Táctica'
      },
      {
        id: 'act-oz-2',
        type: 'Próximo trofeo sugerido',
        title: 'Precisión Orbital',
        detail: 'Plata • Completa una extracción sin activar alarmas',
        progress: 60,
        badge: 'Trofeo Plata'
      },
      {
        id: 'act-oz-3',
        type: 'Captura reciente',
        title: 'Amanecer sobre la Termosfera',
        detail: 'Capturado hace 4 días',
        progress: null,
        badge: 'Galería'
      },
      {
        id: 'act-oz-4',
        type: 'Amigos jugando ahora',
        title: 'Escuadrón Alfa (3/4 jugadores)',
        detail: 'Buscando cuarto operador • Unirse',
        progress: null,
        badge: 'Multijugador'
      }
    ]
  },
  {
    id: 'valkyrie',
    title: 'VALKYRIE: ASHES OF MIDGARD',
    shortTitle: 'VALKYRIE',
    subtitle: 'ASHES OF MIDGARD',
    genre: 'Aventura Mitológica • Mundo Abierto',
    developer: 'Nordic Forge Entertainment',
    releaseYear: '2025',
    rating: 'PEGI 18',
    sizeGB: 108.0,
    installed: true,
    inCollection: true,
    ogPass: false,
    progress: 95,
    trophiesEarned: 49,
    trophiesTotal: 51,
    hoursPlayed: 142.8,
    lastPlayed: 'Hace 3 días',
    price: 79.99,
    deluxePrice: 99.99,
    discount: 30,
    ambientPrimary: '#10b981',
    ambientSecondary: '#67e8f9',
    ambientGlow: 'rgba(16, 185, 129, 0.40)',
    themeKey: 'valkyrie',
    description:
      'Forja tu leyenda bajo las auroras boreales de un Midgard congelado. Descubre santuarios rúnicos, enfrenta colosos ancestrales y restaura el equilibrio de los nueve reinos.',
    activities: [
      {
        id: 'act-vk-1',
        type: 'Misión en curso',
        title: 'Epílogo: Ecos del Bifrost',
        detail: '95% completado • Exploración libre',
        progress: 95,
        badge: 'Post-Juego'
      },
      {
        id: 'act-vk-2',
        type: 'Próximo trofeo sugerido',
        title: 'Reina de las Valquirias',
        detail: 'Oro • Libera las 8 cámaras rúnicas ocultas (7/8)',
        progress: 87,
        badge: 'Trofeo Oro'
      },
      {
        id: 'act-vk-3',
        type: 'Captura reciente',
        title: 'Fiordo de Escarcha bajo Aurora',
        detail: 'Capturado hace 1 semana',
        progress: null,
        badge: 'Galería'
      },
      {
        id: 'act-vk-4',
        type: 'Amigos jugando ahora',
        title: 'Nero_Wolf en Nuevo Juego+',
        detail: 'Nivel de poder 98 • Ver transmisión',
        progress: null,
        badge: 'Share Screen'
      }
    ]
  },
  {
    id: 'chrono-pulse',
    title: 'CHRONO PULSE',
    shortTitle: 'CHRONO PULSE',
    subtitle: 'HARMONIC SHIFT',
    genre: 'Plataformas y Ritmo • Acción Cinética',
    developer: 'Prismatica Soundworks',
    releaseYear: '2026',
    rating: 'PEGI 7',
    sizeGB: 41.5,
    installed: true,
    inCollection: true,
    ogPass: true,
    progress: 64,
    trophiesEarned: 29,
    trophiesTotal: 42,
    hoursPlayed: 38.4,
    lastPlayed: 'Hace 5 días',
    price: 49.99,
    deluxePrice: 64.99,
    discount: 20,
    ambientPrimary: '#f97316',
    ambientSecondary: '#8b5cf6',
    ambientGlow: 'rgba(249, 115, 22, 0.42)',
    themeKey: 'chronopulse',
    description:
      'Cada salto, impulso y distorsión temporal late al compás de una banda sonora electrónica adaptativa. Manipula el tiempo en dimensiones geométricas vibrantes.',
    activities: [
      {
        id: 'act-cp-1',
        type: 'Misión en curso',
        title: 'Dimensión IV: Prisma Solar',
        detail: 'Sincronización perfecta al 96%',
        progress: 64,
        badge: 'Acto IV'
      },
      {
        id: 'act-cp-2',
        type: 'Próximo trofeo sugerido',
        title: 'Metrónomo Viviente',
        detail: 'Plata • Encadena 250 pulsos rítmicos sin fallar',
        progress: 78,
        badge: 'Trofeo Plata'
      },
      {
        id: 'act-cp-3',
        type: 'Captura reciente',
        title: 'Horizonte Sintético — Clímax',
        detail: 'Capturado hace 6 días',
        progress: null,
        badge: 'Galería'
      },
      {
        id: 'act-cp-4',
        type: 'Amigos jugando ahora',
        title: 'Luna_Beats superó tu puntuación',
        detail: '1,420,900 pts • Intentar superar',
        progress: null,
        badge: 'Marcador'
      }
    ]
  },
  {
    id: 'abyssal-horizon',
    title: 'ABYSSAL HORIZON',
    shortTitle: 'ABYSSAL HORIZON',
    subtitle: 'DEEP BIOLUME',
    genre: 'Exploración Submarina • Supervivencia',
    developer: 'Pelagic Interactive',
    releaseYear: '2026',
    rating: 'PEGI 12',
    sizeGB: 56.8,
    installed: true,
    inCollection: true,
    ogPass: true,
    progress: 41,
    trophiesEarned: 18,
    trophiesTotal: 40,
    hoursPlayed: 29.0,
    lastPlayed: 'Hace 1 semana',
    price: 59.99,
    deluxePrice: 74.99,
    discount: 15,
    ambientPrimary: '#14b8a6',
    ambientSecondary: '#0284c7',
    ambientGlow: 'rgba(20, 184, 166, 0.42)',
    themeKey: 'abyssal',
    description:
      'Desciende a 9,000 metros en la Fosa de Marianas-II. Pilota tu batiscafo bio-adaptativo entre ecosistemas luminiscentes y ruinas sumergidas de una civilización olvidada.',
    activities: [
      {
        id: 'act-ab-1',
        type: 'Misión en curso',
        title: 'Santuario Hadal — Profundidad 7,400m',
        detail: 'Escaneo sonar al 41%',
        progress: 41,
        badge: 'Expedición'
      },
      {
        id: 'act-ab-2',
        type: 'Próximo trofeo sugerido',
        title: 'Cartógrafo del Abismo',
        detail: 'Bronce • Cataloga 30 especies bioluminiscentes (24/30)',
        progress: 80,
        badge: 'Trofeo Bronce'
      },
      {
        id: 'act-ab-3',
        type: 'Captura reciente',
        title: 'Leviatán de Cristal en la Fosa',
        detail: 'Capturado hace 1 semana',
        progress: null,
        badge: 'Galería'
      },
      {
        id: 'act-ab-4',
        type: 'Amigos jugando ahora',
        title: 'Ningún amigo conectado aquí',
        detail: 'Invita a un compañero de tripulación',
        progress: null,
        badge: 'Cooperativo'
      }
    ]
  },
  {
    id: 'apex-striker',
    title: 'APEX STRIKER 26',
    shortTitle: 'APEX STRIKER 26',
    subtitle: 'NEXT-GEN PITCH',
    genre: 'Deportes Nueva Generación • Simulación',
    developer: 'ÖG Sports Montreal',
    releaseYear: '2026',
    rating: 'PEGI 3',
    sizeGB: 74.0,
    installed: true,
    inCollection: true,
    ogPass: false,
    progress: 80,
    trophiesEarned: 35,
    trophiesTotal: 45,
    hoursPlayed: 154.6,
    lastPlayed: 'Hoy',
    price: 79.99,
    deluxePrice: 109.99,
    discount: 0,
    ambientPrimary: '#22c55e',
    ambientSecondary: '#e2e8f0',
    ambientGlow: 'rgba(34, 197, 94, 0.38)',
    themeKey: 'apex',
    description:
      'Física balística hiperrealista impulsada por HyperMotion ÖG5, estadios atmosféricos dinámicos con 90,000 espectadores y respuesta háptica en cada toque de balón.',
    activities: [
      {
        id: 'act-ap-1',
        type: 'Misión en curso',
        title: 'Liga de Campeones ÖG — Semifinal',
        detail: 'Partido de vuelta • Estadio Lumina',
        progress: 80,
        badge: 'Modo Carrera'
      },
      {
        id: 'act-ap-2',
        type: 'Próximo trofeo sugerido',
        title: 'Maestro del Tiro Libre',
        detail: 'Plata • Marca 5 goles de falta directa en División Élite',
        progress: 60,
        badge: 'Trofeo Plata'
      },
      {
        id: 'act-ap-3',
        type: 'Captura reciente',
        title: 'Gol de Chilena en el Minuto 92',
        detail: 'Repetición Instantánea 4K',
        progress: null,
        badge: 'Clip Destacado'
      },
      {
        id: 'act-ap-4',
        type: 'Amigos jugando ahora',
        title: 'Mateo_AR10 y Vico_Futbol',
        detail: 'Club Pro en línea • Sala abierta',
        progress: null,
        badge: 'Clubes Pro'
      }
    ]
  }
];

/* Títulos adicionales en Biblioteca / Tienda para descargas interactivas */
const EXTRA_CATALOG_GAMES = [
  {
    id: 'solaris-odyssey',
    title: 'SOLARIS ODYSSEY',
    shortTitle: 'SOLARIS ODYSSEY',
    subtitle: 'STARBORN',
    genre: 'Exploración Espacial • RPG',
    developer: 'Nova Core Studios',
    releaseYear: '2026',
    rating: 'PEGI 12',
    sizeGB: 64.5,
    installed: false,
    inCollection: true,
    ogPass: true,
    progress: 0,
    trophiesEarned: 0,
    trophiesTotal: 46,
    hoursPlayed: 0,
    lastPlayed: 'No iniciado',
    price: 69.99,
    deluxePrice: 84.99,
    discount: 35,
    ambientPrimary: '#f59e0b',
    ambientSecondary: '#3b82f6',
    ambientGlow: 'rgba(245, 158, 11, 0.4)',
    themeKey: 'orbital',
    description:
      'Cartografía sistemas binarios inexplorados, construye tu fragata interestelar y negocia alianzas galácticas con física orbital realista.'
  },
  {
    id: 'kuro-blade',
    title: 'KURO BLADE: RONIN SHADOW',
    shortTitle: 'KURO BLADE',
    subtitle: 'RONIN SHADOW',
    genre: 'Acción Sigilo • Japón Feudal',
    developer: 'Samurai Forge',
    releaseYear: '2026',
    rating: 'PEGI 18',
    sizeGB: 58.2,
    installed: false,
    inCollection: true,
    ogPass: true,
    progress: 15,
    trophiesEarned: 6,
    trophiesTotal: 44,
    hoursPlayed: 6.5,
    lastPlayed: 'Hace 3 semanas',
    price: 59.99,
    deluxePrice: 79.99,
    discount: 40,
    ambientPrimary: '#ef4444',
    ambientSecondary: '#94a3b8',
    ambientGlow: 'rgba(239, 68, 68, 0.4)',
    themeKey: 'aetheria',
    description:
      'Domina el arte del desenfundado rápido bajo la lluvia de Kioto en una historia de honor, sombras y acero templado.'
  },
  {
    id: 'synth-protocol',
    title: 'SYNTH PROTOCOL: OVERDRIVE',
    shortTitle: 'SYNTH PROTOCOL',
    subtitle: 'OVERDRIVE',
    genre: 'Ciber-Acción • Roguelike',
    developer: 'Vector Nine',
    releaseYear: '2026',
    rating: 'PEGI 16',
    sizeGB: 34.8,
    installed: false,
    inCollection: false,
    ogPass: true,
    progress: 0,
    trophiesEarned: 0,
    trophiesTotal: 36,
    hoursPlayed: 0,
    lastPlayed: 'Disponible en ÖG Pass',
    price: 39.99,
    deluxePrice: 49.99,
    discount: 20,
    ambientPrimary: '#a855f7',
    ambientSecondary: '#06b6d4',
    ambientGlow: 'rgba(168, 85, 247, 0.42)',
    themeKey: 'chronopulse',
    description:
      'Hackea megacorporaciones en arenas procedurales de neón con combate ultrarrápido y mejoras cibernéticas modulares.'
  }
];

const EXPLORE_ITEMS = [
  {
    id: 'exp-1',
    category: 'Noticias',
    tag: 'EXCLUSIVO ÖG5',
    title: 'Aetheria: Eclipse of Souls presenta su expansión "Cenizas del Sol Negro"',
    summary:
      'Explora una nueva región volcánica, 14 armas alquímicas y un modo desafío a 120 FPS nativos en ÖG5.',
    date: 'Hace 2 horas',
    readTime: '4 min de lectura',
    gameKey: 'aetheria',
    accent: '#e11d48',
    body: [
      'Vanguard Obsidian Studios ha revelado todos los detalles de "Cenizas del Sol Negro", la primera gran expansión narrativa para Aetheria: Eclipse of Souls en exclusiva para consolas ÖG5.',
      'La actualización aprovecha al máximo el SSD Ultra-Rápido de ÖG PLAY para eliminar por completo las pantallas de carga entre portales dimensionales, integrando además respuestas hápticas diferenciadas para cada tipo de hoja alquímica.',
      'Disponible a partir del próximo viernes con descarga anticipada activada para poseedores de la Edición Deluxe.'
    ]
  },
  {
    id: 'exp-2',
    category: 'Actualizaciones',
    tag: 'NOTAS DEL PARCHE 2.04',
    title: 'Neon Drift: Tokyo 2099 — Nuevo Circuito Shinjuku Skyway y Ray Tracing',
    summary:
      'Mejoras en reflejos sobre asfalto mojado, 4 vehículos prototipo de hidrógeno y soporte de telemetría en vivo.',
    date: 'Hace 5 horas',
    readTime: '3 min de lectura',
    gameKey: 'neondrift',
    accent: '#06b6d4',
    body: [
      'El parche 2.04 ya está disponible para descarga automática en todos los sistemas ÖG PLAY.',
      'Se ha añadido el trazado nocturno "Shinjuku Skyway" con cambios meteorológicos dinámicos en tiempo real, permitiendo pasar de llovizna ligera a tormenta eléctrica en mitad de carrera.',
      'Además, se ha optimizado la latencia de entrada en el Modo Rendimiento 120Hz reduciéndola en un 18%.'
    ]
  },
  {
    id: 'exp-3',
    category: 'Eventos',
    tag: 'TORNEO OFICIAL ÖG',
    title: 'Copa Mundial ÖG PLAY de Apex Striker 26 — Inscripciones Abiertas',
    summary:
      'Compite desde tu consola este fin de semana por recompensas exclusivas, avatares animados y trofeos de temporada.',
    date: 'Ayer',
    readTime: '2 min de lectura',
    gameKey: 'apex',
    accent: '#22c55e',
    body: [
      'La temporada competitiva de otoño comienza oficialmente en ÖG PLAY con clasificatorias abiertas directamente desde la pestaña de Torneos.',
      'Todos los participantes que completen al menos 5 encuentros recibirán el emblema conmemorativo "Estadio Lumina 26" para su perfil de jugador.',
      'Las finales serán retransmitidas en directo en 4K HDR a través del canal oficial de ÖG PLAY.'
    ]
  },
  {
    id: 'exp-4',
    category: 'Noticias',
    tag: 'TRANSMISIÓN EN VIVO • 18.4K ESPECTADORES',
    title: 'En Directo: Explorando las profundidades de Abyssal Horizon con los creadores',
    summary:
      'Pelagic Interactive muestra el diseño sonoro 3D espacial de las criaturas bioluminiscentes.',
    date: 'EN VIVO AHORA',
    readTime: 'Stream Interactivo',
    gameKey: 'abyssal',
    accent: '#14b8a6',
    body: [
      'Acompaña al equipo de ingeniería de audio y arte ambiental de Pelagic Interactive en una inmersión comentada por la Fosa de Marianas-II.',
      'Descubre cómo se grabaron resonancias acústicas reales bajo el hielo ártico para dar vida al ecosistema sonoro de Abyssal Horizon con auriculares Pulse ÖG 3D.'
    ]
  },
  {
    id: 'exp-5',
    category: 'Actualizaciones',
    tag: 'SISTEMA ÖG5 • FIRMWARE 4.20',
    title: 'Novedades del Sistema ÖG PLAY: Iluminación Ambiental Adaptativa y Audio 3D',
    summary:
      'La nueva actualización del sistema mejora la fluidez del Centro de Control y añade perfiles de ecualización personalizados.',
    date: 'Hace 2 días',
    readTime: '3 min de lectura',
    gameKey: 'orbital',
    accent: '#3b82f6',
    body: [
      'El sistema operativo ÖG PLAY recibe su actualización de otoño con mejoras enfocadas en la inmersión visual y la accesibilidad.',
      'Ahora puedes calibrar la intensidad de la iluminación ambiental dinámica por juego y alternar filtros de daltonismo instantáneos desde el Centro de Control.'
    ]
  }
];

const INITIAL_FRIENDS = [
  {
    id: 'fr-1',
    gamertag: 'Kira_Nyx',
    avatarInitials: 'KN',
    avatarGradient: 'from-rose-500 to-amber-500',
    status: 'online',
    activity: 'Jugando Aetheria: Eclipse of Souls — Cap. IV',
    gameId: 'aetheria',
    inVoiceParty: true,
    isSpeaking: true,
    level: 52
  },
  {
    id: 'fr-2',
    gamertag: 'Drako_99',
    avatarInitials: 'D9',
    avatarGradient: 'from-cyan-500 to-blue-600',
    status: 'online',
    activity: 'Jugando Aetheria: Eclipse of Souls — Cooperativo',
    gameId: 'aetheria',
    inVoiceParty: true,
    isSpeaking: false,
    level: 44
  },
  {
    id: 'fr-3',
    gamertag: 'Sora_Valkyrie',
    avatarInitials: 'SV',
    avatarGradient: 'from-fuchsia-500 to-purple-600',
    status: 'online',
    activity: 'En el menú de Neon Drift: Tokyo 2099',
    gameId: 'neon-drift',
    inVoiceParty: false,
    isSpeaking: false,
    level: 61
  },
  {
    id: 'fr-4',
    gamertag: 'Mateo_AR10',
    avatarInitials: 'MA',
    avatarGradient: 'from-emerald-500 to-teal-600',
    status: 'online',
    activity: 'Jugando Apex Striker 26 — Clubes Pro',
    gameId: 'apex-striker',
    inVoiceParty: false,
    isSpeaking: false,
    level: 39
  },
  {
    id: 'fr-5',
    gamertag: 'Luna_Beats',
    avatarInitials: 'LB',
    avatarGradient: 'from-orange-500 to-violet-600',
    status: 'busy',
    activity: 'Jugando Chrono Pulse — Modo Contrarreloj',
    gameId: 'chrono-pulse',
    inVoiceParty: false,
    isSpeaking: false,
    level: 47
  },
  {
    id: 'fr-6',
    gamertag: 'Nero_Wolf',
    avatarInitials: 'NW',
    avatarGradient: 'from-slate-600 to-slate-800',
    status: 'offline',
    activity: 'Última conexión hace 3 horas',
    gameId: null,
    inVoiceParty: false,
    isSpeaking: false,
    level: 55
  },
  {
    id: 'fr-7',
    gamertag: 'Vico_Futbol',
    avatarInitials: 'VF',
    avatarGradient: 'from-slate-600 to-slate-800',
    status: 'offline',
    activity: 'Última conexión ayer',
    gameId: null,
    inVoiceParty: false,
    isSpeaking: false,
    level: 33
  }
];

const INITIAL_CHATS = {
  'fr-1': [
    { id: 'm1', sender: 'Kira_Nyx', text: '¡Ey! Ya llegué al santuario del Capítulo IV en Aetheria.', time: '12:18' },
    { id: 'm2', sender: 'me', text: 'Dame dos minutos que reviso el equipo y entro a tu sesión.', time: '12:19' },
    { id: 'm3', sender: 'Kira_Nyx', text: 'Perfecto, te espero en la hoguera carmesí 🔥', time: '12:20' }
  ],
  'fr-2': [
    { id: 'm4', sender: 'Drako_99', text: '¿Probaste el nuevo parche de 120Hz? Va increíblemente fluido.', time: '11:45' }
  ],
  'fr-3': [
    { id: 'm5', sender: 'Sora_Valkyrie', text: 'Acabo de bajar tu récord en Shuto por 0.14s 😎', time: 'Ayer' }
  ]
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'trophy',
    title: '¡Trofeo de Oro Desbloqueado!',
    detail: 'Aetheria: Eclipse of Souls — "Forjador del Alba"',
    time: 'Hace 12 min',
    unread: true
  },
  {
    id: 'notif-2',
    type: 'invite',
    title: 'Invitación a Grupo de Voz',
    detail: 'Kira_Nyx te ha invitado al grupo "Escuadrón Eclipse"',
    time: 'Hace 24 min',
    unread: true
  },
  {
    id: 'notif-3',
    type: 'download',
    title: 'Actualización Instalada',
    detail: 'Neon Drift: Tokyo 2099 — Versión 2.04 lista para jugar',
    time: 'Hace 2 horas',
    unread: true
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Resumen Semanal ÖG PLAY',
    detail: 'Has jugado 18.5 horas esta semana y ganado 9 trofeos.',
    time: 'Ayer',
    unread: false
  }
];

const TROPHIES_SHOWCASE = [
  {
    id: 'tr-1',
    tier: 'platinum',
    name: 'Alma Eterna de Solis',
    game: 'Aetheria: Eclipse of Souls',
    desc: 'Obtén todos los trofeos del reino fracturado.',
    rarity: 'Ultra Raro • 1.8%',
    date: '15 Nov 2026'
  },
  {
    id: 'tr-2',
    tier: 'gold',
    name: 'Leyenda del Asfalto de Neón',
    game: 'Neon Drift: Tokyo 2099',
    desc: 'Gana todas las carreras nocturnas en dificultad Suprema.',
    rarity: 'Muy Raro • 6.4%',
    date: '12 Nov 2026'
  },
  {
    id: 'tr-3',
    tier: 'gold',
    name: 'Eco de las Valquirias',
    game: 'Valkyrie: Ashes of Midgard',
    desc: 'Derrota a la Guardiana del Hielo Eterno.',
    rarity: 'Raro • 11.2%',
    date: '04 Nov 2026'
  },
  {
    id: 'tr-4',
    tier: 'silver',
    name: 'Sincronía Perfecta',
    game: 'Chrono Pulse',
    desc: 'Completa un acto entero sin perder el multiplicador x8.',
    rarity: 'Raro • 14.9%',
    date: '29 Oct 2026'
  },
  {
    id: 'tr-5',
    tier: 'bronze',
    name: 'Primer Descenso',
    game: 'Abyssal Horizon',
    desc: 'Alcanza los 5,000 metros de profundidad en el batiscafo.',
    rarity: 'Común • 58.3%',
    date: '21 Oct 2026'
  }
];

/* ============================================================================
 * 3. COMPONENTE DE ARTE CINEMATOGRÁFICO MULTICAPA (SVG + CSS ART)
 *    Garantiza visualización AAA instantánea a 4K vectorial sin enlaces rotos
 * ============================================================================ */
const GameArtwork = ({ themeKey, mode = 'card', title = '', subtitle = '', className = '' }) => {
  const renderScene = () => {
    switch (themeKey) {
      case 'aetheria':
        return (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <radialGradient id="ae-sky" cx="65%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                <stop offset="28%" stopColor="#be123c" stopOpacity="0.85" />
                <stop offset="68%" stopColor="#2a0815" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#090308" stopOpacity="1" />
              </radialGradient>
              <radialGradient id="ae-eclipse" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stopColor="#090308" />
                <stop offset="92%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ae-mist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e11d48" stopOpacity="0" />
                <stop offset="100%" stopColor="#090308" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#ae-sky)" />
            {/* Halo Solar Eclipsado */}
            <circle cx="1060" cy="310" r="235" fill="#f59e0b" opacity="0.22" />
            <circle cx="1060" cy="310" r="175" fill="url(#ae-eclipse)" />
            <circle cx="1060" cy="310" r="154" fill="#0c0409" />
            {/* Montañas y Agujas Góticas */}
            <polygon points="0,900 0,560 220,390 420,580 610,330 840,610 1120,420 1380,560 1600,380 1600,900" fill="#180610" opacity="0.85" />
            <polygon points="180,900 240,320 265,240 290,320 350,900" fill="#12040b" />
            <polygon points="680,900 735,280 755,190 775,280 830,900" fill="#0f0309" />
            <polygon points="1220,900 1280,350 1300,260 1320,350 1380,900" fill="#14040c" />
            {/* Chispas de ascua */}
            <g fill="#fbbf24" opacity="0.75">
              <circle cx="420" cy="440" r="3" />
              <circle cx="540" cy="360" r="2.5" />
              <circle cx="890" cy="480" r="3.5" />
              <circle cx="960" cy="240" r="2" />
              <circle cx="1180" cy="420" r="3" />
              <circle cx="1340" cy="310" r="2.5" />
            </g>
            <rect width="1600" height="900" fill="url(#ae-mist)" />
          </svg>
        );

      case 'neondrift':
        return (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="nd-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#050816" />
                <stop offset="50%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>
              <linearGradient id="nd-road" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#090d1f" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="nd-beam1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#d946ef" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#nd-bg)" />
            {/* Sol Neón Cyberpunk */}
            <circle cx="980" cy="370" r="190" fill="#d946ef" opacity="0.28" />
            <circle cx="980" cy="370" r="135" fill="#06b6d4" opacity="0.25" />
            {/* Rascacielos Futuristas */}
            <g fill="#070b1e" opacity="0.92">
              <rect x="80" y="180" width="130" height="440" />
              <rect x="240" y="110" width="160" height="510" />
              <rect x="440" y="220" width="110" height="400" />
              <rect x="1140" y="140" width="150" height="480" />
              <rect x="1320" y="90" width="190" height="530" />
            </g>
            {/* Luces de neón verticales */}
            <rect x="260" y="150" width="6" height="360" fill="#06b6d4" opacity="0.85" />
            <rect x="375" y="180" width="5" height="320" fill="#e879f9" opacity="0.85" />
            <rect x="1165" y="180" width="6" height="340" fill="#22d3ee" opacity="0.85" />
            <rect x="1350" y="130" width="8" height="400" fill="#d946ef" opacity="0.85" />
            {/* Autopista en perspectiva */}
            <polygon points="0,900 660,520 960,520 1600,900" fill="url(#nd-road)" />
            <line x1="810" y1="520" x2="810" y2="900" stroke="#22d3ee" strokeWidth="4" strokeDasharray="28 22" opacity="0.75" />
            {/* Estelas de velocidad hiper-luminosas */}
            <path d="M 160 880 Q 620 640 770 530" stroke="url(#nd-beam1)" strokeWidth="10" fill="none" />
            <path d="M 1420 880 Q 1020 640 855 530" stroke="#e879f9" strokeWidth="9" fill="none" opacity="0.85" />
          </svg>
        );

      case 'orbital':
        return (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <radialGradient id="ob-space" cx="72%" cy="28%" r="80%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="38%" stopColor="#1d4ed8" stopOpacity="0.7" />
                <stop offset="85%" stopColor="#040b1c" stopOpacity="1" />
              </radialGradient>
              <radialGradient id="ob-planet" cx="50%" cy="15%" r="65%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="30%" stopColor="#0284c7" />
                <stop offset="75%" stopColor="#082f49" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#ob-space)" />
            {/* Estrellas */}
            <g fill="#e0f2fe" opacity="0.8">
              <circle cx="180" cy="140" r="2" />
              <circle cx="340" cy="260" r="1.5" />
              <circle cx="520" cy="110" r="2.5" />
              <circle cx="760" cy="190" r="1.5" />
              <circle cx="1290" cy="150" r="2.5" />
              <circle cx="1440" cy="290" r="2" />
            </g>
            {/* Horizonte curvo planetario */}
            <circle cx="800" cy="1420" r="960" fill="url(#ob-planet)" />
            <circle cx="800" cy="1420" r="968" fill="none" stroke="#7dd3fc" strokeWidth="6" opacity="0.65" />
            {/* Anillo Orbital Estación */}
            <ellipse cx="980" cy="360" rx="440" ry="95" transform="rotate(-14 980 360)" fill="none" stroke="#38bdf8" strokeWidth="5" opacity="0.65" />
            <ellipse cx="980" cy="360" rx="410" ry="82" transform="rotate(-14 980 360)" fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="16 12" opacity="0.5" />
            {/* Retícula táctica sutil */}
            <g stroke="#38bdf8" strokeWidth="1" opacity="0.22">
              <line x1="120" y1="450" x2="1480" y2="450" />
              <circle cx="980" cy="360" r="140" fill="none" />
            </g>
          </svg>
        );

      case 'valkyrie':
        return (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="vk-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#021318" />
                <stop offset="55%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#04171a" />
              </linearGradient>
              <linearGradient id="vk-aurora" x1="0" y1="0" x2="1" y2="0.4">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="45%" stopColor="#34d399" stopOpacity="0.72" />
                <stop offset="75%" stopColor="#67e8f9" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#vk-sky)" />
            {/* Ondas de Aurora Boreal */}
            <path d="M -50 320 Q 380 120 790 280 T 1650 180 L 1650 360 Q 1180 420 760 340 T -50 430 Z" fill="url(#vk-aurora)" />
            <path d="M 100 220 Q 560 60 980 210 T 1620 120 L 1620 240 Q 1080 310 620 210 T 100 300 Z" fill="#67e8f9" opacity="0.25" />
            {/* Picos Nevados de Midgard */}
            <polygon points="0,900 0,580 280,340 540,610 860,290 1180,620 1440,370 1600,520 1600,900" fill="#052226" />
            <polygon points="280,340 220,440 285,420 335,455" fill="#a5f3fc" opacity="0.45" />
            <polygon points="860,290 790,410 865,390 935,425" fill="#a5f3fc" opacity="0.5" />
            <polygon points="1440,370 1385,460 1445,445 1495,470" fill="#a5f3fc" opacity="0.4" />
          </svg>
        );

      case 'chronopulse':
        return (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="cp-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1035" />
                <stop offset="50%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
              <linearGradient id="cp-sun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="55%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#cp-bg)" />
            {/* Disco Solar Rítmico */}
            <circle cx="960" cy="400" r="220" fill="url(#cp-sun)" opacity="0.9" />
            {/* Anillos concéntricos de pulso */}
            <circle cx="960" cy="400" r="290" fill="none" stroke="#fdba74" strokeWidth="3" opacity="0.55" />
            <circle cx="960" cy="400" r="365" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="24 16" opacity="0.5" />
            {/* Prismas geométricos flotantes */}
            <polygon points="340,260 440,390 340,520 240,390" fill="#f97316" opacity="0.35" stroke="#fed7aa" strokeWidth="2" />
            <polygon points="1310,220 1390,320 1310,420 1230,320" fill="#8b5cf6" opacity="0.45" stroke="#ddd6fe" strokeWidth="2" />
            {/* Onda de frecuencia */}
            <path d="M 0 680 Q 200 560 400 680 T 800 680 T 1200 680 T 1600 680 L 1600 900 L 0 900 Z" fill="#130924" opacity="0.88" />
          </svg>
        );

      case 'abyssal':
        return (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="ab-ocean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0369a1" />
                <stop offset="45%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#02121a" />
              </linearGradient>
              <radialGradient id="ab-glow" cx="62%" cy="42%" r="55%">
                <stop offset="0%" stopColor="#5eead4" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#0d9488" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#02121a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#ab-ocean)" />
            {/* Rayos de luz oceánica */}
            <polygon points="620,0 820,0 1120,900 420,900" fill="#99f6e4" opacity="0.11" />
            <polygon points="940,0 1100,0 1440,900 840,900" fill="#38bdf8" opacity="0.09" />
            <rect width="1600" height="900" fill="url(#ab-glow)" />
            {/* Silueta de criatura bioluminiscente */}
            <path d="M 660 410 Q 880 310 1140 390 Q 940 430 660 410 Z" fill="#2dd4bf" opacity="0.55" />
            <path d="M 740 425 Q 920 490 1240 450" stroke="#99f6e4" strokeWidth="3" fill="none" opacity="0.65" />
            {/* Burbujas luminiscentes */}
            <g fill="#99f6e4" opacity="0.6">
              <circle cx="480" cy="520" r="6" />
              <circle cx="510" cy="440" r="4" />
              <circle cx="1060" cy="310" r="7" />
              <circle cx="1120" cy="250" r="3.5" />
              <circle cx="1220" cy="540" r="5" />
            </g>
            {/* Fosa abisal */}
            <polygon points="0,900 0,660 360,740 780,690 1220,760 1600,640 1600,900" fill="#020c12" />
          </svg>
        );

      case 'apex':
      default:
        return (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <radialGradient id="ap-stadium" cx="55%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.45" />
                <stop offset="45%" stopColor="#14532d" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#030d08" stopOpacity="1" />
              </radialGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#ap-stadium)" />
            {/* Reflectores de estadio nocturno */}
            <polygon points="280,120 980,760 520,760" fill="#ffffff" opacity="0.09" />
            <polygon points="1320,120 1080,760 640,760" fill="#86efac" opacity="0.11" />
            <circle cx="280" cy="120" r="24" fill="#ffffff" opacity="0.85" />
            <circle cx="1320" cy="120" r="24" fill="#ffffff" opacity="0.85" />
            {/* Líneas tácticas de césped */}
            <polygon points="0,900 240,610 1360,610 1600,900" fill="#062816" />
            <ellipse cx="800" cy="740" rx="220" ry="62" fill="none" stroke="#86efac" strokeWidth="4" opacity="0.55" />
            <line x1="800" y1="610" x2="800" y2="900" stroke="#86efac" strokeWidth="4" opacity="0.55" />
            {/* Estela cinética de balón */}
            <path d="M 460 520 Q 760 360 1080 450" stroke="#4ade80" strokeWidth="8" fill="none" opacity="0.75" />
            <circle cx="1080" cy="450" r="22" fill="#f8fafc" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {renderScene()}
      {mode === 'card' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded bg-white/95 text-slate-950 shadow">
              ÖG5
            </span>
          </div>
          <div className="absolute bottom-3 left-3.5 right-3.5">
            <p className="text-white font-black tracking-tight text-sm sm:text-base leading-tight drop-shadow-md">
              {title}
            </p>
            {subtitle && (
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/75 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ============================================================================
 * 4. ICONO DE TROFEO ESTILO CONSOLA (PLATINO / ORO / PLATA / BRONCE)
 * ============================================================================ */
const TrophyBadge = ({ tier = 'gold', size = 'md' }) => {
  const palette = {
    platinum: {
      bg: 'from-cyan-200 via-sky-400 to-indigo-500',
      ring: 'ring-cyan-300/60',
      label: 'Platino'
    },
    gold: {
      bg: 'from-amber-200 via-yellow-400 to-amber-600',
      ring: 'ring-amber-300/60',
      label: 'Oro'
    },
    silver: {
      bg: 'from-slate-100 via-slate-300 to-slate-500',
      ring: 'ring-slate-300/50',
      label: 'Plata'
    },
    bronze: {
      bg: 'from-orange-300 via-amber-700 to-stone-800',
      ring: 'ring-orange-400/50',
      label: 'Bronce'
    }
  };
  const cfg = palette[tier] || palette.gold;
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const iconDim = size === 'sm' ? 15 : size === 'lg' ? 26 : 20;

  return (
    <div
      className={`${dim} rounded-2xl bg-gradient-to-br ${cfg.bg} ring-1 ${cfg.ring} flex items-center justify-center shadow-lg shrink-0`}
      title={`Trofeo ${cfg.label}`}
    >
      <Trophy size={iconDim} className="text-slate-950 drop-shadow-sm" strokeWidth={2.3} />
    </div>
  );
};

/* ============================================================================
 * 5. EMBLEMA ORIGINAL ÖG PLAY
 * ============================================================================ */
const OgPlayLogo = ({ compact = false }) => (
  <div className="flex items-center gap-2.5 select-none">
    <div className="relative w-9 h-9 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.18)] backdrop-blur-md">
      <svg viewBox="0 0 36 36" className="w-6 h-6">
        <defs>
          <linearGradient id="og-emblem" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path
          d="M18 4 L30 11 V25 L18 32 L6 25 V11 Z"
          fill="none"
          stroke="url(#og-emblem)"
          strokeWidth="2.4"
        />
        <circle cx="15" cy="18" r="4.5" fill="none" stroke="#ffffff" strokeWidth="2.2" />
        <path d="M22 14.5 H25.5 V21.5 H21.5 V18.2 H23.5" fill="none" stroke="#38bdf8" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    </div>
    {!compact && (
      <div className="flex items-center gap-2">
        <span className="font-black tracking-[0.16em] text-base sm:text-lg text-white">
          ÖG <span className="font-light text-white/85">PLAY</span>
        </span>
        <span className="px-1.5 py-0.5 text-[10px] font-extrabold tracking-widest rounded-md bg-white/15 border border-white/20 text-white/90">
          ÖG5
        </span>
      </div>
    )}
  </div>
);

/* ============================================================================
 * 6. SECUENCIA DE ENCENDIDO / BIENVENIDA DE CONSOLA (BOOT SCREEN)
 * ============================================================================ */
const BootSequence = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  const triggerEnter = useCallback(() => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 520);
  }, [fading, onComplete]);

  useEffect(() => {
    const autoTimer = setTimeout(() => {
      triggerEnter();
    }, 1850);

    const handleKey = () => triggerEnter();
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(autoTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [triggerEnter]);

  return (
    <div
      onClick={triggerEnter}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03050a] cursor-pointer transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Haz de luz volumétrico central */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-sky-500/15 blur-[130px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-amber-300/10 blur-[80px]" />
      </div>

      {/* Emblema animado */}
      <div className="relative flex flex-col items-center text-center px-6 animate-[ogScaleIn_0.75s_cubic-bezier(0.22,1,0.36,1)]">
        <div className="w-24 h-24 rounded-3xl bg-white/[0.06] border border-white/20 flex items-center justify-center shadow-[0_0_60px_rgba(56,189,248,0.35)] mb-7">
          <svg viewBox="0 0 36 36" className="w-14 h-14">
            <path
              d="M18 4 L30 11 V25 L18 32 L6 25 V11 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
            />
            <circle cx="15" cy="18" r="4.5" fill="none" stroke="#ffffff" strokeWidth="2.2" />
            <path
              d="M22 14.5 H25.5 V21.5 H21.5 V18.2 H23.5"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-[0.26em] text-white">
            ÖG <span className="font-extralight text-white/80">PLAY</span>
          </h1>
          <span className="px-2.5 py-1 text-xs font-black tracking-widest rounded-lg bg-white text-slate-950">
            ÖG5
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-300/85 tracking-wide max-w-md mb-8">
          ÖG PLAY — Presiona cualquier botón o entra directamente
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerEnter();
          }}
          className="px-7 py-3 rounded-full bg-white text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-transform"
        >
          Entrar al Sistema
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
 * 7. BARRA SUPERIOR MINIMALISTA (TOP BAR)
 * ============================================================================ */
const NAV_SECTIONS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'explorar', label: 'Explorar' },
  { id: 'biblioteca', label: 'Biblioteca' },
  { id: 'tienda', label: 'Tienda' },
  { id: 'amigos', label: 'Amigos' },
  { id: 'perfil', label: 'Perfil' }
];

const TopBar = ({
  activeSection,
  onSelectSection,
  unreadNotifications,
  onOpenControlCenter,
  onlineStatus,
  gamertag,
  wishlistCount,
  cartCount
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor =
    onlineStatus === 'online'
      ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
      : onlineStatus === 'busy'
      ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
      : 'bg-slate-400';

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pt-4 pb-2 flex items-center justify-between gap-4">
      {/* Izquierda: Logo + Pestañas de Navegación */}
      <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => onSelectSection('inicio')}
          className="shrink-0 focus:outline-none group"
          aria-label="Ir a Inicio de ÖG PLAY"
        >
          <OgPlayLogo compact={false} />
        </button>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegación principal">
          {NAV_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={`relative px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                  isActive
                    ? 'text-white bg-white/14 shadow-[0_0_24px_rgba(255,255,255,0.16)] border border-white/25'
                    : 'text-white/65 hover:text-white hover:bg-white/[0.07] border border-transparent'
                }`}
              >
                {sec.label}
                {sec.id === 'tienda' && (cartCount > 0 || wishlistCount > 0) && (
                  <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-sky-400 text-slate-950">
                    {cartCount > 0 ? cartCount : wishlistCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-white shadow-[0_0_10px_#fff]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Derecha: Notificaciones, Ajustes, Perfil con estado online y Reloj */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notificaciones */}
        <button
          type="button"
          onClick={() => onOpenControlCenter('notificaciones')}
          className="relative p-2.5 rounded-full bg-white/[0.07] hover:bg-white/16 border border-white/12 text-white/90 transition-all hover:scale-105 active:scale-95"
          title="Notificaciones"
          aria-label="Abrir Notificaciones"
        >
          <Bell size={18} />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-lg">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Configuración */}
        <button
          type="button"
          onClick={() => onOpenControlCenter('configuracion')}
          className="p-2.5 rounded-full bg-white/[0.07] hover:bg-white/16 border border-white/12 text-white/90 transition-all hover:scale-105 active:scale-95"
          title="Configuración rápida"
          aria-label="Abrir Configuración"
        >
          <Settings size={18} />
        </button>

        {/* Avatar del jugador + Estado Online */}
        <button
          type="button"
          onClick={() => onOpenControlCenter('perfil')}
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/[0.07] hover:bg-white/16 border border-white/14 transition-all group"
          title="Perfil y Estado Online"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center font-black text-xs text-white ring-2 ring-white/25">
              ÖG
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-slate-950 ${statusColor}`}
            />
          </div>
          <span className="hidden md:block text-xs font-bold text-white/90 group-hover:text-white">
            {gamertag}
          </span>
        </button>

        {/* Reloj digital */}
        <div className="hidden sm:flex items-center pl-2 text-sm sm:text-base font-semibold tracking-wider text-white/90 tabular-nums">
          {timeStr || '12:30'}
        </div>
      </div>
    </header>
  );
};

/* ============================================================================
 * 8. SECCIÓN 1: INICIO (PANTALLA PRINCIPAL ESTILO PS5)
 * ============================================================================ */
const HomeSection = ({
  games,
  selectedIndex,
  onSelectIndex,
  onLaunchGame,
  onToggleInstall,
  installingMap,
  onOpenGameDetails,
  onNavigateSection,
  onOpenActivityModal,
  onShowToast
}) => {
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const selectedGame = games[selectedIndex] || games[0];
  const isInstalling = Boolean(installingMap[selectedGame.id]);
  const installProgress = installingMap[selectedGame.id] || 0;

  // Centrar suavemente la tarjeta seleccionada en el carrusel horizontal
  useEffect(() => {
    const activeEl = cardRefs.current[selectedIndex];
    if (activeEl && carouselRef.current) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
    setMenuOpen(false);
  }, [selectedIndex]);

  return (
    <div className="relative z-10 flex flex-col justify-between h-full px-4 sm:px-8 lg:px-12 pt-3 pb-24 max-w-[1680px] mx-auto">
      {/* Carrusel Horizontal de Juegos estilo PS5 */}
      <section aria-label="Carrusel de juegos">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            <Gamepad2 size={14} className="text-white/80" />
            <span>Juegos Recientes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectIndex((selectedIndex - 1 + games.length) % games.length)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition"
              aria-label="Juego anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => onSelectIndex((selectedIndex + 1) % games.length)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition"
              aria-label="Siguiente juego"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar py-3 px-1 snap-x snap-mandatory"
        >
          {games.map((game, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={game.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onLaunchGame(game);
                  } else {
                    onSelectIndex(idx);
                  }
                }}
                className={`relative shrink-0 snap-center rounded-2xl overflow-hidden text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none group ${
                  isSelected
                    ? 'w-[250px] sm:w-[320px] md:w-[360px] h-[148px] sm:h-[182px] ring-2 ring-white shadow-[0_18px_50px_rgba(0,0,0,0.65),0_0_32px_var(--ambient-glow)] scale-[1.02]'
                    : 'w-[124px] sm:w-[144px] h-[124px] sm:h-[144px] opacity-80 hover:opacity-100 hover:scale-105 ring-1 ring-white/15'
                }`}
              >
                <GameArtwork
                  themeKey={game.themeKey}
                  mode="card"
                  title={isSelected ? game.shortTitle : ''}
                  subtitle={isSelected ? game.subtitle : ''}
                  className="w-full h-full"
                />
                {!isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-bold text-white/90 truncate">
                      {game.shortTitle}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Zona Hero Inferior del Juego Seleccionado */}
      <section className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-7 space-y-4">
          {/* Etiquetas de estado */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-widest uppercase bg-white text-slate-950">
              ÖG5
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/12 border border-white/15 backdrop-blur-md text-white/95">
              {selectedGame.genre}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {selectedGame.installed
                ? 'Instalado • Listo para jugar'
                : isInstalling
                ? `Instalando (${installProgress}%)...`
                : 'No instalado en SSD'}
            </span>
          </div>

          {/* Título estilizado */}
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.03] drop-shadow-[0_6px_28px_rgba(0,0,0,0.65)]">
              {selectedGame.title}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-white/80 max-w-2xl line-clamp-2 leading-relaxed">
              {selectedGame.description}
            </p>
          </div>

          {/* Métricas rápidas estilo PS5 */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-8 pt-1">
            <div>
              <span className="block text-[11px] uppercase tracking-widest text-white/55">
                Progreso
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {selectedGame.progress}%
              </span>
            </div>
            <div className="h-7 w-px bg-white/15" />
            <div>
              <span className="block text-[11px] uppercase tracking-widest text-white/55">
                Trofeos
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-300" />
                {selectedGame.trophiesEarned}/{selectedGame.trophiesTotal}
              </span>
            </div>
            <div className="h-7 w-px bg-white/15" />
            <div>
              <span className="block text-[11px] uppercase tracking-widest text-white/55">
                Tiempo jugado
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {selectedGame.hoursPlayed} h
              </span>
            </div>
          </div>

          {/* Botones de Acción Principal y Contextual */}
          <div className="relative flex flex-wrap items-center gap-3.5 pt-2">
            {selectedGame.installed ? (
              <button
                type="button"
                onClick={() => onLaunchGame(selectedGame)}
                className="px-9 py-3.5 rounded-full bg-white text-slate-950 font-black text-base tracking-wide flex items-center gap-2.5 shadow-[0_0_35px_rgba(255,255,255,0.45)] hover:scale-[1.03] active:scale-95 transition-all"
              >
                <Play size={19} fill="currentColor" />
                <span>Jugar</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isInstalling}
                onClick={() => onToggleInstall(selectedGame.id)}
                className="px-8 py-3.5 rounded-full bg-sky-400 text-slate-950 font-black text-base tracking-wide flex items-center gap-2.5 shadow-[0_0_35px_rgba(56,189,248,0.45)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-75"
              >
                <Download size={19} />
                <span>{isInstalling ? `Descargando ${installProgress}%` : 'Instalar Ahora'}</span>
              </button>
            )}

            {/* Botón secundario ••• con menú contextual desplegable */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="w-12 h-12 rounded-full bg-white/12 hover:bg-white/22 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white transition-all hover:scale-105"
                aria-label="Más opciones del juego"
              >
                <MoreHorizontal size={22} />
              </button>

              {menuOpen && (
                <div className="absolute left-0 bottom-14 w-64 rounded-2xl bg-slate-950/90 border border-white/20 backdrop-blur-2xl shadow-2xl p-1.5 z-40 animate-[ogFadeUp_0.2s_ease-out]">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenGameDetails(selectedGame);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/12 flex items-center justify-between transition"
                  >
                    <span>Ver detalles del juego</span>
                    <ChevronRight size={15} className="text-white/50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigateSection('biblioteca');
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/12 flex items-center justify-between transition"
                  >
                    <span>Administrar almacenamiento</span>
                    <HardDrive size={15} className="text-white/50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigateSection('perfil');
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/12 flex items-center justify-between transition"
                  >
                    <span>Ver trofeos</span>
                    <Trophy size={15} className="text-amber-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onShowToast(
                        `${selectedGame.shortTitle}: El juego está actualizado a la última versión.`
                      );
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/12 flex items-center justify-between transition"
                  >
                    <span>Buscar actualizaciones</span>
                    <RotateCcw size={15} className="text-white/50" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta destacada lateral (Trofeo / Progreso) */}
        <div className="lg:col-span-5 hidden lg:flex justify-end">
          <div className="w-full max-w-md rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-white/65">
                Resumen de Actividad ÖG5
              </span>
              <span className="text-xs font-semibold text-white/80">{selectedGame.sizeGB} GB</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${selectedGame.progress}%`,
                  background: `linear-gradient(90deg, var(--ambient-primary), var(--ambient-secondary))`
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/75">
              <span>Última sesión: {selectedGame.lastPlayed}</span>
              <span>{selectedGame.rating}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fila Horizontal de Tarjetas de Actividad estilo PS5 */}
      <section className="mt-6" aria-label="Tarjetas de actividad">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {selectedGame.activities.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => onOpenActivityModal(act, selectedGame)}
              className="group text-left rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/14 hover:border-white/35 backdrop-blur-2xl p-4 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/65">
                  {act.type}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/12 text-white/90">
                  {act.badge}
                </span>
              </div>
              <p className="font-bold text-sm text-white group-hover:text-white line-clamp-1">
                {act.title}
              </p>
              <p className="text-xs text-white/70 mt-1 line-clamp-1">{act.detail}</p>
              {typeof act.progress === 'number' && (
                <div className="mt-3 w-full h-1.5 rounded-full bg-white/12 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${act.progress}%` }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
 * 9. SECCIÓN 2: EXPLORAR (HUB EDITORIAL Y NOTICIAS OFICIALES)
 * ============================================================================ */
const ExplorarSection = ({ onOpenArticle }) => {
  const [filter, setFilter] = useState('Todo');
  const categories = ['Todo', 'Noticias', 'Eventos', 'Actualizaciones'];

  const filteredItems = useMemo(() => {
    if (filter === 'Todo') return EXPLORE_ITEMS;
    return EXPLORE_ITEMS.filter((item) => item.category === filter);
  }, [filter]);

  const featured = EXPLORE_ITEMS[0];

  return (
    <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-4 pb-28 max-w-[1600px] mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] no-scrollbar">
      {/* Banner Editorial Destacado */}
      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl min-h-[260px] sm:min-h-[310px] flex items-end p-6 sm:p-10">
        <div className="absolute inset-0">
          <GameArtwork themeKey={featured.gameKey} mode="backdrop" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-rose-600 text-white">
              {featured.tag}
            </span>
            <span className="text-xs text-white/75">{featured.date}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {featured.title}
          </h2>
          <p className="text-sm sm:text-base text-white/80">{featured.summary}</p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenArticle(featured)}
              className="px-6 py-2.5 rounded-full bg-white text-slate-950 font-bold text-sm hover:scale-105 transition"
            >
              Leer artículo completo
            </button>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                filter === cat
                  ? 'bg-white text-slate-950 shadow-lg'
                  : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white border border-white/12'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Radio size={14} className="text-emerald-400 animate-pulse" />
          <span>Red Oficial ÖG PLAY • Actualizado en tiempo real</span>
        </div>
      </div>

      {/* Grid de noticias, streams y parches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            onClick={() => onOpenArticle(item)}
            className="group cursor-pointer rounded-3xl bg-white/[0.07] hover:bg-white/[0.13] border border-white/14 hover:border-white/30 backdrop-blur-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <GameArtwork themeKey={item.gameKey} mode="backdrop" className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span
                  className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white shadow"
                  style={{ backgroundColor: item.accent }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white leading-snug group-hover:text-sky-200 transition">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mt-2 line-clamp-2">
                  {item.summary}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-semibold text-white/80">
              <span>{item.readTime}</span>
              <span className="inline-flex items-center gap-1 text-white group-hover:translate-x-1 transition-transform">
                Explorar <ChevronRight size={14} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * 10. SECCIÓN 3: BIBLIOTECA (COLECCIÓN, SSD Y DESCARGAS EN VIVO)
 * ============================================================================ */
const BibliotecaSection = ({
  allGames,
  onLaunchGame,
  onToggleInstall,
  installingMap
}) => {
  const [tab, setTab] = useState('instalados');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Cálculo dinámico del SSD Ultra-Rápido (Base sistema 141.6 GB + juegos instalados)
  const totalCapacity = 1000; // 1.0 TB
  const usedGB = useMemo(() => {
    const gamesSum = allGames
      .filter((g) => g.installed)
      .reduce((acc, g) => acc + g.sizeGB, 0);
    return Number((141.6 + gamesSum).toFixed(1));
  }, [allGames]);

  const usedPercent = Math.min(100, Math.round((usedGB / totalCapacity) * 100));

  const filteredGames = useMemo(() => {
    let list = [...allGames];
    if (tab === 'instalados') {
      list = list.filter((g) => g.installed || Boolean(installingMap[g.id]));
    } else if (tab === 'coleccion') {
      list = list.filter((g) => g.inCollection);
    } else if (tab === 'ogpass') {
      list = list.filter((g) => g.ogPass);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'hours') {
      list.sort((a, b) => b.hoursPlayed - a.hoursPlayed);
    } else if (sortBy === 'progress') {
      list.sort((a, b) => b.progress - a.progress);
    }

    return list;
  }, [allGames, tab, searchQuery, sortBy, installingMap]);

  return (
    <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-4 pb-28 max-w-[1600px] mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] no-scrollbar">
      {/* Cabecera + Barra Visual de Almacenamiento SSD */}
      <div className="rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Tu Biblioteca</h2>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            Gestiona tus títulos instalados, tu colección digital y el catálogo incluido en ÖG Pass.
          </p>
        </div>

        {/* SSD Ultra-Rápido */}
        <div className="w-full lg:w-[420px] rounded-2xl bg-black/35 border border-white/12 p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white flex items-center gap-2">
              <HardDrive size={15} className="text-sky-400" />
              SSD Ultra-Rápido ÖG5
            </span>
            <span className="font-semibold text-white/85 tabular-nums">
              {usedGB} GB / 1.0 TB
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${usedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/55 mt-1.5">
            <span>Espacio libre: {(totalCapacity - usedGB).toFixed(1)} GB</span>
            <span>Velocidad lectura: 7.4 GB/s</span>
          </div>
        </div>
      </div>

      {/* Pestañas + Buscador + Orden */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'instalados', label: 'Instalados' },
            { id: 'coleccion', label: 'Tu Colección' },
            { id: 'ogpass', label: 'ÖG Pass' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                tab === t.id
                  ? 'bg-white text-slate-950 shadow'
                  : 'bg-white/10 text-white/75 hover:bg-white/20 border border-white/12'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar título o género..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-white/45"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Ordenar juegos"
            className="px-4 py-2 rounded-full bg-slate-900/90 border border-white/15 text-xs sm:text-sm text-white focus:outline-none"
          >
            <option value="recent">Orden: Recientes</option>
            <option value="alpha">Orden: A - Z</option>
            <option value="hours">Más jugados</option>
            <option value="progress">Mayor progreso</option>
          </select>
        </div>
      </div>

      {/* Cuadrícula de Juegos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredGames.map((game) => {
          const isDownloading = Boolean(installingMap[game.id]);
          const pct = installingMap[game.id] || 0;

          return (
            <div
              key={game.id}
              className="group rounded-3xl bg-white/[0.07] border border-white/14 hover:border-white/30 backdrop-blur-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
            >
              <div>
                <div className="relative h-44">
                  <GameArtwork
                    themeKey={game.themeKey}
                    mode="card"
                    title={game.shortTitle}
                    subtitle={game.subtitle}
                    className="w-full h-full"
                  />
                  {game.ogPass && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-amber-400 text-slate-950">
                      ÖG PASS
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                    <span>{game.sizeGB} GB</span>
                    <span>{game.hoursPlayed} h jugadas</span>
                  </div>
                  <p className="text-xs text-white/75 line-clamp-1">{game.genre}</p>

                  {isDownloading && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-bold text-sky-300 mb-1">
                        <span>Descargando...</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
                        <div
                          className="h-full bg-sky-400 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4 pb-4 flex items-center gap-2">
                {game.installed ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onLaunchGame(game)}
                      className="flex-1 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-[1.02] transition"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Jugar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleInstall(game.id)}
                      className="px-3 py-2.5 rounded-full bg-white/10 hover:bg-rose-500/25 text-white/80 hover:text-rose-200 text-xs font-semibold transition"
                      title="Desinstalar del SSD"
                    >
                      Desinstalar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() => onToggleInstall(game.id)}
                    className="w-full py-2.5 rounded-full bg-sky-400/90 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-60"
                  >
                    <Download size={14} />
                    <span>{isDownloading ? `Instalando ${pct}%` : 'Descargar e Instalar'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * 11. SECCIÓN 4: TIENDA (ÖG STORE CON EDICIONES, WISHLIST Y CARRITO)
 * ============================================================================ */
const TiendaSection = ({
  storeGames,
  wishlist,
  onToggleWishlist,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onCheckout
}) => {
  const [selectedStoreGame, setSelectedStoreGame] = useState(null);
  const [selectedEdition, setSelectedEdition] = useState('standard');
  const [cartOpen, setCartOpen] = useState(false);

  const spotlight = storeGames[0];

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.finalPrice, 0);
  }, [cart]);

  const openGameSheet = (game) => {
    setSelectedStoreGame(game);
    setSelectedEdition('standard');
  };

  return (
    <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-4 pb-28 max-w-[1600px] mx-auto space-y-7 overflow-y-auto max-h-[calc(100vh-80px)] no-scrollbar">
      {/* Barra superior de Tienda */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">ÖG Store</h2>
          <p className="text-xs sm:text-sm text-white/70">
            Lanzamientos de nueva generación, ediciones Deluxe y ventajas exclusivas ÖG5.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-2">
            <Heart size={14} className="text-rose-400" fill="currentColor" />
            <span>Deseos: {wishlist.length}</span>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition"
          >
            <ShoppingBag size={16} />
            <span>Carrito ({cart.length})</span>
          </button>
        </div>
      </div>

      {/* Banner Principal Dinámico */}
      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl min-h-[260px] flex items-end p-6 sm:p-9">
        <div className="absolute inset-0">
          <GameArtwork themeKey={spotlight.themeKey} mode="backdrop" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-amber-400 text-slate-950">
            Destacado en ÖG5
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white">{spotlight.title}</h3>
          <p className="text-xs sm:text-sm text-white/80">{spotlight.description}</p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openGameSheet(spotlight)}
              className="px-6 py-2.5 rounded-full bg-white text-slate-950 font-bold text-sm hover:scale-105 transition"
            >
              Ver Ediciones • ${spotlight.price.toFixed(2)}
            </button>
            <button
              type="button"
              onClick={() => onToggleWishlist(spotlight.id)}
              className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition"
              aria-label="Añadir a lista de deseos"
            >
              <Heart
                size={18}
                className={wishlist.includes(spotlight.id) ? 'text-rose-400' : 'text-white'}
                fill={wishlist.includes(spotlight.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Estanterías horizontales / Grid */}
      {[
        { title: 'Tendencias en ÖG5', items: storeGames.slice(0, 4) },
        { title: 'Ofertas de Temporada y Catálogo', items: storeGames.slice(4) }
      ].map((shelf) => (
        <section key={shelf.title} className="space-y-3">
          <h3 className="text-lg font-extrabold text-white">{shelf.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {shelf.items.map((game) => {
              const isWished = wishlist.includes(game.id);
              const finalPrice =
                game.discount > 0
                  ? Number((game.price * (1 - game.discount / 100)).toFixed(2))
                  : game.price;

              return (
                <div
                  key={game.id}
                  className="group rounded-3xl bg-white/[0.07] border border-white/14 hover:border-white/30 backdrop-blur-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
                >
                  <div onClick={() => openGameSheet(game)} className="cursor-pointer">
                    <div className="relative h-44">
                      <GameArtwork
                        themeKey={game.themeKey}
                        mode="card"
                        title={game.shortTitle}
                        subtitle={game.subtitle}
                        className="w-full h-full"
                      />
                      {game.discount > 0 && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950 shadow">
                          -{game.discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-white/65">{game.genre}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-black text-white">
                          ${finalPrice.toFixed(2)}
                        </span>
                        {game.discount > 0 && (
                          <span className="text-xs line-through text-white/45">
                            ${game.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openGameSheet(game)}
                      className="flex-1 py-2.5 rounded-full bg-white/14 hover:bg-white text-white hover:text-slate-950 font-bold text-xs transition"
                    >
                      Elegir Edición
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(game.id)}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition"
                      aria-label="Lista de deseos"
                    >
                      <Heart
                        size={16}
                        className={isWished ? 'text-rose-400' : 'text-white/80'}
                        fill={isWished ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Modal de Ficha de Juego con Selector de Edición */}
      {selectedStoreGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-950/95 border border-white/20 overflow-hidden shadow-2xl animate-[ogScaleIn_0.25s_ease-out]">
            <div className="relative h-52">
              <GameArtwork
                themeKey={selectedStoreGame.themeKey}
                mode="backdrop"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedStoreGame(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-white/20"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="px-2 py-0.5 text-[10px] font-black rounded bg-white text-slate-950">
                  ÖG5
                </span>
                <h3 className="text-2xl font-black text-white mt-1">{selectedStoreGame.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-white/80">{selectedStoreGame.description}</p>

              {/* Selector Estándar vs Deluxe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'standard',
                    name: 'Edición Estándar',
                    price:
                      selectedStoreGame.discount > 0
                        ? Number(
                            (
                              selectedStoreGame.price *
                              (1 - selectedStoreGame.discount / 100)
                            ).toFixed(2)
                          )
                        : selectedStoreGame.price,
                    perks: 'Juego completo para consola ÖG5'
                  },
                  {
                    id: 'deluxe',
                    name: 'Edición Digital Deluxe',
                    price: selectedStoreGame.deluxePrice,
                    perks: 'Juego completo + Pase de Temporada + Libro de Arte Digital'
                  }
                ].map((ed) => (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => setSelectedEdition(ed.id)}
                    className={`p-4 rounded-2xl text-left border transition ${
                      selectedEdition === ed.id
                        ? 'bg-white/15 border-white shadow-lg'
                        : 'bg-white/5 border-white/12 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{ed.name}</span>
                      <span className="font-black text-base text-sky-300">
                        ${ed.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-white/65 mt-1.5">{ed.perks}</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStoreGame(null)}
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const price =
                      selectedEdition === 'deluxe'
                        ? selectedStoreGame.deluxePrice
                        : selectedStoreGame.discount > 0
                        ? Number(
                            (
                              selectedStoreGame.price *
                              (1 - selectedStoreGame.discount / 100)
                            ).toFixed(2)
                          )
                        : selectedStoreGame.price;

                    onAddToCart({
                      key: `${selectedStoreGame.id}-${selectedEdition}`,
                      gameId: selectedStoreGame.id,
                      title: selectedStoreGame.title,
                      edition:
                        selectedEdition === 'deluxe'
                          ? 'Edición Digital Deluxe'
                          : 'Edición Estándar',
                      finalPrice: price
                    });
                    setSelectedStoreGame(null);
                    setCartOpen(true);
                  }}
                  className="px-7 py-2.5 rounded-full bg-white text-slate-950 font-black text-sm hover:scale-105 transition"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Carrito de Compras Interactivo */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md h-full bg-slate-950/95 border-l border-white/20 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <ShoppingBag size={20} /> Carrito ÖG Store
                </h3>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full bg-white/10 text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-white/60 text-sm">
                  Tu carrito está vacío. Explora las ediciones disponibles en ÖG Store.
                </div>
              ) : (
                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                  {cart.map((item) => (
                    <div
                      key={item.key}
                      className="p-4 rounded-2xl bg-white/[0.07] border border-white/12 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-sm text-white">{item.title}</p>
                        <p className="text-xs text-white/60">{item.edition}</p>
                        <p className="text-sm font-black text-sky-300 mt-1">
                          ${item.finalPrice.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(item.key)}
                        className="p-2 rounded-full bg-white/10 hover:bg-rose-500/30 text-white/80"
                        aria-label="Eliminar del carrito"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/15 space-y-4">
                <div className="flex items-center justify-between text-base">
                  <span className="text-white/75">Total a pagar:</span>
                  <span className="text-2xl font-black text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onCheckout();
                    setCartOpen(false);
                  }}
                  className="w-full py-3.5 rounded-full bg-white text-slate-950 font-black text-sm shadow-lg hover:scale-[1.02] transition"
                >
                  Confirmar Compra Digital
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 12. SECCIÓN 5: AMIGOS (GRUPO DE VOZ ACTIVO Y RICH PRESENCE)
 * ============================================================================ */
const AmigosSection = ({
  friends,
  micMuted,
  onToggleMic,
  onInviteFriend,
  onOpenFriendChat
}) => {
  const partyMembers = friends.filter((f) => f.inVoiceParty);
  const onlineFriends = friends.filter((f) => f.status !== 'offline');
  const offlineFriends = friends.filter((f) => f.status === 'offline');

  return (
    <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-4 pb-28 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto max-h-[calc(100vh-80px)] no-scrollbar">
      {/* Columna Izquierda: Grupo de Voz Activo */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-3xl bg-white/[0.08] border border-white/18 backdrop-blur-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-lg font-black text-white">Grupo de Voz Activo</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              Audio 3D • Alta Definición
            </span>
          </div>

          <p className="text-xs text-white/65 mb-5">
            Canal: <strong className="text-white">Escuadrón Eclipse</strong> • {partyMembers.length + 1} conectados
          </p>

          {/* Miembros en el grupo con ondas de audio animadas */}
          <div className="space-y-3 mb-6">
            {/* Usuario local */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center font-black text-xs text-white">
                  ÖG
                </div>
                <div>
                  <p className="text-sm font-bold text-white">ÖG_Vanguard (Tú)</p>
                  <p className="text-xs text-white/65">
                    {micMuted ? 'Micrófono silenciado' : 'Micrófono activo'}
                  </p>
                </div>
              </div>
              {!micMuted ? (
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 bg-emerald-400 rounded-full animate-[ogWave_0.7s_ease-in-out_infinite] h-3" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-[ogWave_0.5s_ease-in-out_infinite_0.1s] h-4" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-[ogWave_0.8s_ease-in-out_infinite_0.2s] h-2" />
                </div>
              ) : (
                <MicOff size={16} className="text-rose-400" />
              )}
            </div>

            {partyMembers.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/12 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${member.avatarGradient} flex items-center justify-center font-black text-xs text-white`}
                  >
                    {member.avatarInitials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{member.gamertag}</p>
                    <p className="text-xs text-white/65 truncate max-w-[200px]">
                      {member.activity}
                    </p>
                  </div>
                </div>
                {member.isSpeaking ? (
                  <div className="flex items-end gap-1 h-4">
                    <span className="w-1 bg-sky-400 rounded-full animate-[ogWave_0.6s_ease-in-out_infinite] h-4" />
                    <span className="w-1 bg-sky-400 rounded-full animate-[ogWave_0.45s_ease-in-out_infinite_0.15s] h-2.5" />
                    <span className="w-1 bg-sky-400 rounded-full animate-[ogWave_0.7s_ease-in-out_infinite_0.25s] h-3.5" />
                  </div>
                ) : (
                  <Volume2 size={16} className="text-white/40" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMic}
              className={`flex-1 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                micMuted
                  ? 'bg-rose-500/25 border border-rose-400/40 text-rose-200'
                  : 'bg-white text-slate-950 shadow-lg'
              }`}
            >
              {micMuted ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{micMuted ? 'Activar Micrófono' : 'Silenciar Micrófono'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Amigos En Línea con Rich Presence y Desconectados */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-2xl p-6">
          <h3 className="text-base font-black uppercase tracking-wider text-white/85 mb-4">
            En Línea ({onlineFriends.length})
          </h3>
          <div className="space-y-3">
            {onlineFriends.map((fr) => (
              <div
                key={fr.id}
                className="p-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-tr ${fr.avatarGradient} flex items-center justify-center font-black text-sm text-white`}
                    >
                      {fr.avatarInitials}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-slate-950 ${
                        fr.status === 'busy' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-sm text-white">{fr.gamertag}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/75">
                        Nvl. {fr.level}
                      </span>
                    </div>
                    <p className="text-xs text-sky-200/90 mt-0.5">{fr.activity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!fr.inVoiceParty && (
                    <button
                      type="button"
                      onClick={() => onInviteFriend(fr.id)}
                      className="px-3.5 py-2 rounded-full bg-white/12 hover:bg-white text-white hover:text-slate-950 text-xs font-bold transition"
                    >
                      Invitar a grupo
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenFriendChat(fr.id)}
                    className="p-2.5 rounded-full bg-white/12 hover:bg-white/25 text-white transition"
                    title="Enviar mensaje"
                  >
                    <MessageSquare size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desconectados */}
        <div className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/55 mb-3">
            Desconectados ({offlineFriends.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {offlineFriends.map((fr) => (
              <div
                key={fr.id}
                className="p-3.5 rounded-2xl bg-black/25 border border-white/8 flex items-center gap-3 opacity-75"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white/70">
                  {fr.avatarInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white/85">{fr.gamertag}</p>
                  <p className="text-xs text-white/50">{fr.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 13. SECCIÓN 6: PERFIL (IDENTIDAD, TROFEOS Y GALERÍA DE CAPTURAS)
 * ============================================================================ */
const PerfilSection = ({ gamertag, onlineStatus, onChangeStatus, onOpenLightbox }) => {
  const captures = [
    {
      id: 'cap-1',
      title: 'Catedral Carmesí bajo el Eclipse',
      game: 'Aetheria: Eclipse of Souls',
      themeKey: 'aetheria',
      res: '3840 × 2160 HDR'
    },
    {
      id: 'cap-2',
      title: 'Autopista Neo-Shibuya 02:40 AM',
      game: 'Neon Drift: Tokyo 2099',
      themeKey: 'neondrift',
      res: '3840 × 2160 HDR'
    },
    {
      id: 'cap-3',
      title: 'Amanecer sobre Estación Horizonte',
      game: 'Orbital Zero',
      themeKey: 'orbital',
      res: '3840 × 2160 HDR'
    },
    {
      id: 'cap-4',
      title: 'Aurora Boreal en los Fiordos',
      game: 'Valkyrie: Ashes of Midgard',
      themeKey: 'valkyrie',
      res: '3840 × 2160 HDR'
    }
  ];

  return (
    <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-4 pb-28 max-w-[1600px] mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] no-scrollbar">
      {/* Banner de Identidad Visual */}
      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
        <div className="h-40 sm:h-48 relative">
          <GameArtwork themeKey="orbital" mode="backdrop" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="relative px-6 pb-6 -mt-14 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-fuchsia-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-[20px] bg-slate-950 flex items-center justify-center text-2xl font-black text-white">
                ÖG
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black text-white">{gamertag}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950">
                  ÖG PLUS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1">
                Explorador de mundos de nueva generación • Miembro desde 2020
              </p>
            </div>
          </div>

          {/* Selector de estado online */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full p-1.5 backdrop-blur-xl">
            {[
              { id: 'online', label: 'En línea', dot: 'bg-emerald-400' },
              { id: 'busy', label: 'Ocupado', dot: 'bg-amber-400' },
              { id: 'offline', label: 'Invisible', dot: 'bg-slate-400' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onChangeStatus(st.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                  onlineStatus === st.id
                    ? 'bg-white text-slate-950 shadow'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vitrina de Trofeos + Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resumen Nivel y Desglose de Trofeos */}
        <div className="lg:col-span-5 rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-white mb-5">Vitrina de Trofeos</h3>
            <div className="flex items-center gap-5 mb-6">
              {/* Anillo SVG de Progreso */}
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="9"
                    strokeDasharray="264"
                    strokeDashoffset="92"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Nivel</span>
                  <span className="text-2xl font-black text-white">48</span>
                </div>
              </div>

              <div>
                <p className="text-2xl font-black text-white">956 Trofeos</p>
                <p className="text-xs text-white/65 mt-0.5">65% hacia el Nivel 49</p>
                <p className="text-xs text-sky-300 font-semibold mt-2">
                  Top 4% de jugadores en tu región
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5 text-center">
            {[
              { tier: 'platinum', label: 'Platino', count: 14 },
              { tier: 'gold', label: 'Oro', count: 86 },
              { tier: 'silver', label: 'Plata', count: 214 },
              { tier: 'bronze', label: 'Bronce', count: 642 }
            ].map((t) => (
              <div
                key={t.tier}
                className="p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-col items-center gap-1.5"
              >
                <TrophyBadge tier={t.tier} size="sm" />
                <span className="text-base font-black text-white">{t.count}</span>
                <span className="text-[10px] text-white/60 uppercase">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Trofeos Recientes */}
        <div className="lg:col-span-7 rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-2xl p-6">
          <h3 className="text-lg font-black text-white mb-4">Trofeos Recientes</h3>
          <div className="space-y-3">
            {TROPHIES_SHOWCASE.map((tr) => (
              <div
                key={tr.id}
                className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <TrophyBadge tier={tr.tier} size="md" />
                  <div>
                    <p className="font-bold text-sm text-white">{tr.name}</p>
                    <p className="text-xs text-white/65">{tr.game} • {tr.desc}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <span className="text-xs font-bold text-amber-300 block">{tr.rarity}</span>
                  <span className="text-[11px] text-white/50">{tr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Galería de Capturas Recientes */}
      <div className="rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white">Galería de Capturas Recientes</h3>
          <span className="text-xs text-white/65">Haz clic para ampliar a pantalla completa</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {captures.map((cap) => (
            <button
              key={cap.id}
              type="button"
              onClick={() => onOpenLightbox(cap)}
              className="group relative h-40 rounded-2xl overflow-hidden border border-white/15 text-left focus:outline-none"
            >
              <GameArtwork
                themeKey={cap.themeKey}
                mode="backdrop"
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-3.5">
                <p className="text-xs font-bold text-white line-clamp-1">{cap.title}</p>
                <p className="text-[10px] text-white/65">{cap.res}</p>
              </div>
              <span className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition">
                <Maximize2 size={13} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 14. CENTRO DE CONTROL FLOTANTE (7 MÓDULOS INTERACTIVOS)
 * ============================================================================ */
const CC_TABS = [
  { id: 'amigos', label: 'Amigos', icon: Users },
  { id: 'mensajes', label: 'Mensajes', icon: MessageSquare },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'sonido', label: 'Sonido', icon: Volume2 },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
  { id: 'perfil', label: 'Perfil', icon: Award },
  { id: 'accesibilidad', label: 'Accesibilidad', icon: Eye }
];

const ControlCenter = ({
  isOpen,
  activeTab,
  onSelectTab,
  onClose,
  friends,
  chats,
  activeChatFriendId,
  onSelectChatFriend,
  onSendMessage,
  notifications,
  onMarkAllRead,
  audioSettings,
  onUpdateAudio,
  systemSettings,
  onUpdateSystem,
  onTriggerStandby,
  onlineStatus,
  onChangeStatus,
  gamertag,
  onSwitchUser,
  accessibility,
  onUpdateAccessibility
}) => {
  const [draftMsg, setDraftMsg] = useState('');

  if (!isOpen) return null;

  const activeFriend = friends.find((f) => f.id === activeChatFriendId) || friends[0];
  const thread = chats[activeFriend.id] || [];
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!draftMsg.trim()) return;
    onSendMessage(activeFriend.id, draftMsg.trim());
    setDraftMsg('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-[ogFadeIn_0.2s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-[32px] bg-slate-950/90 border border-white/20 backdrop-blur-3xl shadow-[0_24px_90px_rgba(0,0,0,0.85)] overflow-hidden animate-[ogFadeUp_0.28s_cubic-bezier(0.22,1,0.36,1)]"
      >
        {/* Cabecera del Centro de Control */}
        <div className="px-6 py-4 border-b border-white/12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <OgPlayLogo compact={true} />
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                Centro de Control ÖG5
              </h2>
              <p className="text-[11px] text-white/60">
                Acceso rápido al sistema • Presiona [Esc] o [C] para cerrar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Cerrar Centro de Control"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido dinámico del módulo seleccionado */}
        <div className="p-5 sm:p-6 min-h-[340px] max-h-[62vh] overflow-y-auto no-scrollbar">
          {/* 1. MÓDULO AMIGOS */}
          {activeTab === 'amigos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white">
                  Amigos Conectados ({friends.filter((f) => f.status !== 'offline').length})
                </h3>
                <span className="text-xs text-emerald-300 font-semibold">
                  Grupo de Voz Activo (3)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friends
                  .filter((f) => f.status !== 'offline')
                  .map((fr) => (
                    <div
                      key={fr.id}
                      className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/12 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-tr ${fr.avatarGradient} flex items-center justify-center font-black text-xs text-white shrink-0`}
                        >
                          {fr.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{fr.gamertag}</p>
                          <p className="text-xs text-white/65 truncate">{fr.activity}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectChatFriend(fr.id);
                          onSelectTab('mensajes');
                        }}
                        className="p-2 rounded-full bg-white/12 hover:bg-white text-white hover:text-slate-950 transition shrink-0"
                        title="Abrir chat"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 2. MÓDULO MENSAJES (CHAT INTERACTIVO EN SESIÓN) */}
          {activeTab === 'mensajes' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[310px]">
              {/* Lista de hilos */}
              <div className="md:col-span-4 space-y-2 overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r border-white/12 pb-2 md:pb-0 md:pr-3">
                {friends.slice(0, 4).map((fr) => (
                  <button
                    key={fr.id}
                    type="button"
                    onClick={() => onSelectChatFriend(fr.id)}
                    className={`w-full p-2.5 rounded-2xl text-left flex items-center gap-2.5 transition ${
                      activeFriend.id === fr.id
                        ? 'bg-white/16 border border-white/25'
                        : 'hover:bg-white/8 border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${fr.avatarGradient} flex items-center justify-center font-black text-xs text-white shrink-0`}
                    >
                      {fr.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{fr.gamertag}</p>
                      <p className="text-[11px] text-white/55 truncate">
                        {(chats[fr.id] && chats[fr.id][chats[fr.id].length - 1]?.text) ||
                          'Iniciar conversación'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Conversación activa */}
              <div className="md:col-span-8 flex flex-col justify-between h-full">
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                  {thread.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'me' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs sm:text-sm ${
                          msg.sender === 'me'
                            ? 'bg-white text-slate-950 font-medium'
                            : 'bg-white/12 text-white'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-white/45 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={draftMsg}
                    onChange={(e) => setDraftMsg(e.target.value)}
                    placeholder={`Escribe un mensaje a ${activeFriend.gamertag}...`}
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-white/40"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-full bg-white text-slate-950 hover:scale-105 transition"
                    aria-label="Enviar mensaje"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. MÓDULO NOTIFICACIONES */}
          {activeTab === 'notificaciones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white">
                  Notificaciones de Consola ({unreadCount} nuevas)
                </h3>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="px-3.5 py-1.5 rounded-full bg-white/12 hover:bg-white text-white hover:text-slate-950 text-xs font-bold transition"
                  >
                    Marcar todo como leído
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                      n.unread
                        ? 'bg-white/12 border-white/25'
                        : 'bg-white/[0.04] border-white/10 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {n.unread && <span className="w-2 h-2 rounded-full bg-sky-400" />}
                        <p className="text-sm font-bold text-white">{n.title}</p>
                      </div>
                      <p className="text-xs text-white/70 mt-1">{n.detail}</p>
                    </div>
                    <span className="text-[11px] text-white/50 shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MÓDULO SONIDO (WEB AUDIO API + AUDIO 3D) */}
          {activeTab === 'sonido' && (
            <div className="space-y-5">
              <h3 className="text-base font-extrabold text-white">Audio y Dispositivos ÖG5</h3>

              {/* Volumen Maestro */}
              <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/12 space-y-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Volumen Maestro del Sistema</span>
                  <span>{audioSettings.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioSettings.masterVolume}
                  onChange={(e) =>
                    onUpdateAudio({ masterVolume: Number(e.target.value) })
                  }
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Selector de Salida */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'pulse3d',
                    label: 'Auriculares Pulse ÖG 3D',
                    icon: Headphones
                  },
                  {
                    id: 'hdmi',
                    label: 'TV HDMI (eARC 7.1)',
                    icon: Tv
                  }
                ].map((dev) => {
                  const Icon = dev.icon;
                  const active = audioSettings.outputDevice === dev.id;
                  return (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => onUpdateAudio({ outputDevice: dev.id })}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 text-left transition ${
                        active
                          ? 'bg-white/16 border-white text-white'
                          : 'bg-white/5 border-white/12 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-xs sm:text-sm font-bold">{dev.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Interruptores de Sonido */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'uiSfx',
                    label: 'Efectos de sonido UI',
                    desc: 'Sonidos táctiles Web Audio'
                  },
                  {
                    key: 'spatial3d',
                    label: 'Audio 3D Espacial',
                    desc: 'Motor Tempest ÖG'
                  },
                  {
                    key: 'micMuted',
                    label: 'Silenciar Micrófono',
                    desc: 'Control inalámbrico'
                  }
                ].map((sw) => {
                  const isOn = audioSettings[sw.key];
                  return (
                    <button
                      key={sw.key}
                      type="button"
                      onClick={() => onUpdateAudio({ [sw.key]: !isOn })}
                      className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/12 flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{sw.label}</p>
                        <p className="text-[11px] text-white/55">{sw.desc}</p>
                      </div>
                      <span
                        className={`w-10 h-6 rounded-full p-1 transition ${
                          isOn ? 'bg-sky-400' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                            isOn ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. MÓDULO CONFIGURACIÓN */}
          {activeTab === 'configuracion' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white">
                  Pantalla, Rendimiento y Energía
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <Wifi size={14} /> Wi-Fi 6E • 940 Mbps
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'hdr',
                    label: 'HDR Activo (10-bit)',
                    desc: 'Rango dinámico ampliado'
                  },
                  {
                    key: 'mode120hz',
                    label: 'Modo Rendimiento 120Hz',
                    desc: 'Priorizar tasa de fotogramas'
                  }
                ].map((item) => {
                  const active = systemSettings[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onUpdateSystem({ [item.key]: !active })}
                      className="p-4 rounded-2xl bg-white/[0.07] border border-white/12 flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-xs text-white/60">{item.desc}</p>
                      </div>
                      <span
                        className={`w-11 h-6 rounded-full p-1 transition ${
                          active ? 'bg-emerald-400' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                            active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Intensidad Iluminación Ambiental */}
              <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/12 space-y-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Intensidad de Iluminación Ambiental Dinámica</span>
                  <span>{systemSettings.ambientIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="100"
                  value={systemSettings.ambientIntensity}
                  onChange={(e) =>
                    onUpdateSystem({ ambientIntensity: Number(e.target.value) })
                  }
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Energía: Reposo / Reiniciar */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onTriggerStandby('rest')}
                  className="px-5 py-2.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/35 text-amber-200 text-xs font-bold flex items-center gap-2 transition"
                >
                  <Power size={15} />
                  <span>Entrar en Modo Reposo</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTriggerStandby('reboot')}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <RotateCcw size={15} />
                  <span>Reiniciar Consola ÖG5</span>
                </button>
              </div>
            </div>
          )}

          {/* 6. MÓDULO PERFIL RÁPIDO */}
          {activeTab === 'perfil' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-fuchsia-500 flex items-center justify-center font-black text-lg text-white">
                    ÖG
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">{gamertag}</p>
                    <p className="text-xs text-white/65">
                      Nivel de Trofeos 48 • 14 Platinos • 956 Total
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSwitchUser}
                  className="px-4 py-2 rounded-full bg-white/12 hover:bg-white text-white hover:text-slate-950 text-xs font-bold transition"
                >
                  Cambiar Usuario ({gamertag === 'ÖG_Vanguard' ? 'ÖG_Guest' : 'ÖG_Vanguard'})
                </button>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/65 mb-2.5">
                  Estado Online
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'online', label: 'En línea', color: 'bg-emerald-400' },
                    { id: 'busy', label: 'Ocupado', color: 'bg-amber-400' },
                    { id: 'offline', label: 'Invisible', color: 'bg-slate-400' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onChangeStatus(s.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                        onlineStatus === s.id
                          ? 'bg-white text-slate-950 border-white'
                          : 'bg-white/6 border-white/12 text-white/80 hover:bg-white/12'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. MÓDULO ACCESIBILIDAD (TRANSFORMACIÓN EN VIVO) */}
          {activeTab === 'accesibilidad' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-white">
                Opciones de Accesibilidad en Tiempo Real
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'highContrast',
                    label: 'Alto Contraste',
                    desc: 'Refuerza bordes y legibilidad'
                  },
                  {
                    key: 'largeText',
                    label: 'Texto Grande',
                    desc: 'Amplía la tipografía del sistema'
                  },
                  {
                    key: 'reduceMotion',
                    label: 'Reducir Movimiento',
                    desc: 'Minimiza transiciones dinámicas'
                  }
                ].map((opt) => {
                  const enabled = accessibility[opt.key];
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onUpdateAccessibility({ [opt.key]: !enabled })}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                        enabled
                          ? 'bg-sky-400/20 border-sky-300 text-white'
                          : 'bg-white/[0.06] border-white/12 text-white/80'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{opt.label}</p>
                        <p className="text-[11px] text-white/60">{opt.desc}</p>
                      </div>
                      <span
                        className={`w-10 h-6 rounded-full p-1 transition ${
                          enabled ? 'bg-sky-400' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                            enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/12">
                <p className="text-xs font-bold text-white mb-2.5">
                  Corrección de Daltonismo (Filtro de Pantalla)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'Ninguno' },
                    { id: 'deuteranopia', label: 'Deuteranopía' },
                    { id: 'protanopia', label: 'Protanopía' },
                    { id: 'tritanopia', label: 'Tritanopía' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onUpdateAccessibility({ colorFilter: f.id })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        accessibility.colorFilter === f.id
                          ? 'bg-white text-slate-950 border-white'
                          : 'bg-white/8 border-white/12 text-white/75 hover:bg-white/15'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra inferior de iconos del Centro de Control */}
        <div className="px-4 py-3 bg-black/55 border-t border-white/12 flex items-center justify-around sm:justify-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
          {CC_TABS.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTab(t.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all shrink-0 ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-lg scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-bold tracking-wide">{t.label}</span>
                {t.id === 'notificaciones' && unreadCount > 0 && !isSelected && (
                  <span className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 15. EXPERIENCIA INMERSIVA DE INICIO DE JUEGO (SPLASH LAUNCH OVERLAY)
 * ============================================================================ */
const GameLaunchOverlay = ({ game, onExit }) => {
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    if (!game) return;
    setLoadPct(0);
    const interval = setInterval(() => {
      setLoadPct((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 18) + 12);
      });
    }, 260);
    return () => clearInterval(interval);
  }, [game]);

  if (!game) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-between p-6 sm:p-12 bg-black animate-[ogFadeIn_0.35s_ease-out]">
      <div className="absolute inset-0">
        <GameArtwork
          themeKey={game.themeKey}
          mode="backdrop"
          className="w-full h-full scale-105 transition-transform duration-[4000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />
      </div>

      {/* Cabecera */}
      <div className="relative z-10 flex items-center justify-between">
        <OgPlayLogo compact={false} />
        <button
          type="button"
          onClick={onExit}
          className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-slate-950 border border-white/25 backdrop-blur-xl font-bold text-xs sm:text-sm transition"
        >
          Volver al Sistema ÖG PLAY [Esc]
        </button>
      </div>

      {/* Centro / Splash Title */}
      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-xs font-bold text-white">
          <Sparkles size={14} className="text-amber-300" />
          <span>SSD Ultra-Rápido ÖG5 • Ray Tracing & Audio 3D Activados</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
          {game.title}
        </h1>
        <p className="text-sm sm:text-base text-white/80 max-w-xl">{game.description}</p>
      </div>

      {/* Barra de Carga Cinematográfica */}
      <div className="relative z-10 max-w-xl space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span>
            {loadPct < 100
              ? 'Sincronizando partida guardada en la nube ÖG...'
              : '¡Sesión lista! Ejecutando motor gráfico ÖG5'}
          </span>
          <span className="tabular-nums">{loadPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden backdrop-blur-md">
          <div
            className="h-full rounded-full bg-white shadow-[0_0_20px_#fff] transition-all duration-300"
            style={{ width: `${loadPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 16. PIE DE PANTALLA (HUD DE CONTROLES INTERACTIVO + DOCK CENTRO CONTROL)
 * ============================================================================ */
const ControlsHud = ({
  onPrev,
  onNext,
  onPrimaryAction,
  onToggleControlCenter,
  onBackAction,
  activeSection
}) => {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-30 pointer-events-none px-4 sm:px-8 lg:px-12 pb-3 pt-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-center justify-between gap-4">
      {/* Indicadores clicables de botones */}
      <div className="pointer-events-auto flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold text-white/80">
        {activeSection === 'inicio' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              className="px-2 py-1 rounded-md bg-white/12 hover:bg-white/25 border border-white/20 text-white font-mono text-[11px] transition"
            >
              ←
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-2 py-1 rounded-md bg-white/12 hover:bg-white/25 border border-white/20 text-white font-mono text-[11px] transition"
            >
              →
            </button>
            <span className="ml-1">Navegar</span>
          </div>
        )}

        <button
          type="button"
          onClick={onPrimaryAction}
          className="flex items-center gap-1.5 hover:text-white transition"
        >
          <span className="px-2 py-1 rounded-md bg-white/12 hover:bg-white/25 border border-white/20 text-white font-mono text-[11px]">
            Enter
          </span>
          <span>Jugar / Seleccionar</span>
        </button>

        <button
          type="button"
          onClick={onToggleControlCenter}
          className="flex items-center gap-1.5 hover:text-white transition"
        >
          <span className="px-2 py-1 rounded-md bg-white/12 hover:bg-white/25 border border-white/20 text-white font-mono text-[11px]">
            C
          </span>
          <span>Centro de Control</span>
        </button>

        <button
          type="button"
          onClick={onBackAction}
          className="hidden sm:flex items-center gap-1.5 hover:text-white transition"
        >
          <span className="px-2 py-1 rounded-md bg-white/12 hover:bg-white/25 border border-white/20 text-white font-mono text-[11px]">
            Esc
          </span>
          <span>Volver</span>
        </button>
      </div>

      {/* Botón Dock Flotante estilo botón PS para abrir Centro de Control */}
      <button
        type="button"
        onClick={onToggleControlCenter}
        className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/14 hover:bg-white text-white hover:text-slate-950 border border-white/25 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95"
        title="Abrir Centro de Control (Tecla C)"
      >
        <Sliders size={15} />
        <span className="text-xs font-black tracking-wider uppercase">Control</span>
      </button>
    </footer>
  );
};

/* ============================================================================
 * 17. COMPONENTE PRINCIPAL: APP (SISTEMA OPERATIVO ÖG PLAY)
 * ============================================================================ */
export default function App() {
  // Secuencia inicial de consola
  const [booted, setBooted] = useState(false);

  // Navegación principal
  const [activeSection, setActiveSection] = useState('inicio');

  // Catálogo de juegos en memoria (permite instalar/desinstalar y comprar)
  const [gamesState, setGamesState] = useState(() => [...GAMES_DATA, ...EXTRA_CATALOG_GAMES]);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [installingMap, setInstallingMap] = useState({});

  // Estado social y usuario
  const [gamertag, setGamertag] = useState('ÖG_Vanguard');
  const [onlineStatus, setOnlineStatus] = useState('online');
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatFriendId, setActiveChatFriendId] = useState('fr-1');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Tienda: Wishlist y Carrito
  const [wishlist, setWishlist] = useState(['aetheria', 'valkyrie']);
  const [cart, setCart] = useState([]);

  // Centro de Control
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [controlCenterTab, setControlCenterTab] = useState('amigos');

  // Audio y Sistema
  const [audioSettings, setAudioSettings] = useState({
    masterVolume: 75,
    uiSfx: true,
    spatial3d: true,
    micMuted: false,
    outputDevice: 'pulse3d'
  });

  const [systemSettings, setSystemSettings] = useState({
    hdr: true,
    mode120hz: true,
    ambientIntensity: 80
  });

  // Accesibilidad en tiempo real
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    colorFilter: 'none'
  });

  // Overlays / Modales inmersivos
  const [launchedGame, setLaunchedGame] = useState(null);
  const [standbyMode, setStandbyMode] = useState(null); // 'rest' | 'reboot' | null
  const [modalContent, setModalContent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Juegos principales del carrusel Home (los 7 títulos AAA)
  const homeGames = useMemo(() => gamesState.slice(0, 7), [gamesState]);
  const currentHomeGame = homeGames[selectedGameIndex] || homeGames[0];

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  // Manejador de arranque completado
  const handleBootComplete = useCallback(() => {
    setBooted(true);
    soundEngine.boot(audioSettings.uiSfx, audioSettings.masterVolume);
  }, [audioSettings.uiSfx, audioSettings.masterVolume]);

  // Navegar carrusel con sonido
  const handleSelectGameIndex = useCallback(
    (newIdx) => {
      setSelectedGameIndex(newIdx);
      soundEngine.navigate(audioSettings.uiSfx, audioSettings.masterVolume);
    },
    [audioSettings.uiSfx, audioSettings.masterVolume]
  );

  // Cambiar sección principal con sonido
  const handleSelectSection = useCallback(
    (secId) => {
      setActiveSection(secId);
      soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
    },
    [audioSettings.uiSfx, audioSettings.masterVolume]
  );

  // Abrir Centro de Control en un módulo específico
  const handleOpenControlCenter = useCallback(
    (tab = 'amigos') => {
      setControlCenterTab(tab);
      setControlCenterOpen(true);
      soundEngine.openPanel(audioSettings.uiSfx, audioSettings.masterVolume);
    },
    [audioSettings.uiSfx, audioSettings.masterVolume]
  );

  // Simulación interactiva de descarga/instalación en SSD
  const handleToggleInstall = useCallback(
    (gameId) => {
      const target = gamesState.find((g) => g.id === gameId);
      if (!target) return;

      if (target.installed) {
        setGamesState((prev) =>
          prev.map((g) => (g.id === gameId ? { ...g, installed: false } : g))
        );
        soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
        showToast(`${target.shortTitle} desinstalado del SSD Ultra-Rápido.`);
        return;
      }

      if (installingMap[gameId]) return;

      soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
      showToast(`Descargando ${target.shortTitle} (${target.sizeGB} GB)...`);
      setInstallingMap((prev) => ({ ...prev, [gameId]: 5 }));

      const timer = setInterval(() => {
        setInstallingMap((prev) => {
          const current = prev[gameId] || 0;
          if (current >= 100) {
            clearInterval(timer);
            const nextMap = { ...prev };
            delete nextMap[gameId];

            setGamesState((gs) =>
              gs.map((g) => (g.id === gameId ? { ...g, installed: true } : g))
            );
            setNotifications((notifs) => [
              {
                id: `notif-${Date.now()}`,
                type: 'download',
                title: 'Instalación Completada',
                detail: `${target.title} está listo para jugar`,
                time: 'Ahora',
                unread: true
              },
              ...notifs
            ]);
            soundEngine.notification(audioSettings.uiSfx, audioSettings.masterVolume);
            showToast(`¡${target.shortTitle} instalado y listo para jugar!`);
            return nextMap;
          }
          return { ...prev, [gameId]: Math.min(100, current + 19) };
        });
      }, 380);
    },
    [gamesState, installingMap, audioSettings.uiSfx, audioSettings.masterVolume, showToast]
  );

  // Lanzar juego a pantalla completa
  const handleLaunchGame = useCallback(
    (game) => {
      soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
      setLaunchedGame(game);
    },
    [audioSettings.uiSfx, audioSettings.masterVolume]
  );

  // Enviar mensaje en el Centro de Control con respuesta simulada
  const handleSendMessage = useCallback(
    (friendId, text) => {
      const nowTime = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setChats((prev) => ({
        ...prev,
        [friendId]: [
          ...(prev[friendId] || []),
          { id: `msg-${Date.now()}`, sender: 'me', text, time: nowTime }
        ]
      }));
      soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);

      const friendObj = friends.find((f) => f.id === friendId);
      setTimeout(() => {
        const replies = [
          '¡Recibido! Nos vemos dentro del juego en un segundo.',
          '¡Genial! Estoy configurando mi equipo ahora mismo.',
          '¡Vamos allá! Mándame invitación cuando estés listo.'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        setChats((prev) => ({
          ...prev,
          [friendId]: [
            ...(prev[friendId] || []),
            {
              id: `reply-${Date.now()}`,
              sender: friendObj?.gamertag || 'Amigo',
              text: randomReply,
              time: new Date().toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          ]
        }));
        soundEngine.notification(audioSettings.uiSfx, audioSettings.masterVolume);
      }, 1100);
    },
    [friends, audioSettings.uiSfx, audioSettings.masterVolume]
  );

  // Navegación Global por Teclado (← →, Enter, Esc, C)
  useEffect(() => {
    if (!booted) return;

    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';

      if (e.key === 'Escape') {
        if (launchedGame) {
          setLaunchedGame(null);
          soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
        } else if (modalContent) {
          setModalContent(null);
          soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
        } else if (controlCenterOpen) {
          setControlCenterOpen(false);
          soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
        } else if (activeSection !== 'inicio') {
          setActiveSection('inicio');
          soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
        }
        return;
      }

      if (isTyping) return;

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setControlCenterOpen((prev) => {
          const next = !prev;
          if (next) {
            soundEngine.openPanel(audioSettings.uiSfx, audioSettings.masterVolume);
          } else {
            soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
          }
          return next;
        });
        return;
      }

      if (controlCenterOpen || modalContent || launchedGame || standbyMode) return;

      if (activeSection === 'inicio') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleSelectGameIndex((selectedGameIndex + 1) % homeGames.length);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleSelectGameIndex(
            (selectedGameIndex - 1 + homeGames.length) % homeGames.length
          );
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentHomeGame.installed) {
            handleLaunchGame(currentHomeGame);
          } else {
            handleToggleInstall(currentHomeGame.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    booted,
    activeSection,
    selectedGameIndex,
    homeGames.length,
    currentHomeGame,
    controlCenterOpen,
    modalContent,
    launchedGame,
    standbyMode,
    audioSettings.uiSfx,
    audioSettings.masterVolume,
    handleSelectGameIndex,
    handleLaunchGame,
    handleToggleInstall
  ]);

  // Variables CSS dinámicas de iluminación ambiental
  const ambientStyles = {
    '--ambient-primary': currentHomeGame.ambientPrimary,
    '--ambient-secondary': currentHomeGame.ambientSecondary,
    '--ambient-glow': currentHomeGame.ambientGlow,
    '--ambient-opacity': systemSettings.ambientIntensity / 100
  };

  // Clases de accesibilidad en vivo
  const rootA11yClasses = [
    accessibility.highContrast ? 'og-high-contrast' : '',
    accessibility.largeText ? 'og-large-text' : '',
    accessibility.reduceMotion ? 'og-reduce-motion' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const colorBlindFilterMap = {
    none: 'none',
    deuteranopia: 'url(#og-deuteranopia)',
    protanopia: 'url(#og-protanopia)',
    tritanopia: 'url(#og-tritanopia)'
  };

  const unreadNotifications = notifications.filter((n) => n.unread).length;

  return (
    <div
      style={{
        ...ambientStyles,
        filter: colorBlindFilterMap[accessibility.colorFilter] || 'none'
      }}
      className={`relative w-screen h-screen overflow-hidden bg-[#04060c] text-white font-sans antialiased selection:bg-white selection:text-slate-950 ${rootA11yClasses}`}
    >
      {/* Estilos globales del sistema operativo ÖG PLAY */}
      <style>{`
        @keyframes ogScaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ogFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ogFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ogWave {
          0%, 100% { transform: scaleY(0.45); }
          50% { transform: scaleY(1); }
        }
        @keyframes ogFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Accesibilidad: Alto Contraste */
        .og-high-contrast {
          background-color: #000000 !important;
        }
        .og-high-contrast button,
        .og-high-contrast article,
        .og-high-contrast div[class*="bg-white/"] {
          border-color: rgba(255, 255, 255, 0.55) !important;
        }

        /* Accesibilidad: Texto Grande */
        .og-large-text {
          font-size: 112%;
        }

        /* Accesibilidad: Reducir Movimiento */
        .og-reduce-motion *,
        .og-reduce-motion *::before,
        .og-reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `}</style>

      {/* Filtros SVG de Daltonismo en Tiempo Real */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="og-deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="og-protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="og-tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Secuencia Inicial de Encendido */}
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      {/* FONDO CINEMATOGRÁFICO DINÁMICO A PANTALLA COMPLETA */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {homeGames.map((game, idx) => {
          const isCurrent = idx === selectedGameIndex;
          return (
            <div
              key={game.id}
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <GameArtwork themeKey={game.themeKey} mode="backdrop" className="w-full h-full" />
            </div>
          );
        })}

        {/* Capas de profundidad y viñeta cinematográfica estilo PS5 */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            activeSection === 'inicio'
              ? 'bg-gradient-to-t from-[#03050a] via-[#03050a]/55 to-[#03050a]/45'
              : 'bg-[#03050a]/82 backdrop-blur-xl'
          }`}
        />

        {/* Iluminación Ambiental Reactiva */}
        <div
          className="absolute -top-32 right-1/4 w-[680px] h-[680px] rounded-full blur-[160px] transition-colors duration-1000"
          style={{
            backgroundColor: 'var(--ambient-primary)',
            opacity: 'calc(var(--ambient-opacity) * 0.35)'
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[560px] h-[560px] rounded-full blur-[150px] transition-colors duration-1000"
          style={{
            backgroundColor: 'var(--ambient-secondary)',
            opacity: 'calc(var(--ambient-opacity) * 0.25)'
          }}
        />

        {/* Partículas atmosféricas flotantes sutiles */}
        <div className="absolute inset-0 overflow-hidden opacity-45">
          <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-white/70 animate-[ogFloat_7s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-amber-200/60 animate-[ogFloat_9s_ease-in-out_infinite_1s]" />
          <div className="absolute bottom-1/3 left-2/3 w-1 h-1 rounded-full bg-sky-200/80 animate-[ogFloat_6s_ease-in-out_infinite_2s]" />
        </div>
      </div>

      {/* BARRA SUPERIOR MINIMALISTA */}
      <TopBar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        unreadNotifications={unreadNotifications}
        onOpenControlCenter={handleOpenControlCenter}
        onlineStatus={onlineStatus}
        gamertag={gamertag}
        wishlistCount={wishlist.length}
        cartCount={cart.length}
      />

      {/* CONTENIDO PRINCIPAL POR SECCIÓN */}
      <main className="relative z-10 h-[calc(100vh-68px)]">
        {activeSection === 'inicio' && (
          <HomeSection
            games={homeGames}
            selectedIndex={selectedGameIndex}
            onSelectIndex={handleSelectGameIndex}
            onLaunchGame={handleLaunchGame}
            onToggleInstall={handleToggleInstall}
            installingMap={installingMap}
            onOpenGameDetails={(game) =>
              setModalContent({
                type: 'gameDetails',
                game
              })
            }
            onNavigateSection={handleSelectSection}
            onOpenActivityModal={(activity, game) =>
              setModalContent({
                type: 'activity',
                activity,
                game
              })
            }
            onShowToast={showToast}
          />
        )}

        {activeSection === 'explorar' && (
          <ExplorarSection
            onOpenArticle={(article) =>
              setModalContent({
                type: 'article',
                article
              })
            }
          />
        )}

        {activeSection === 'biblioteca' && (
          <BibliotecaSection
            allGames={gamesState}
            onLaunchGame={handleLaunchGame}
            onToggleInstall={handleToggleInstall}
            installingMap={installingMap}
          />
        )}

        {activeSection === 'tienda' && (
          <TiendaSection
            storeGames={gamesState}
            wishlist={wishlist}
            onToggleWishlist={(id) => {
              setWishlist((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
              );
              soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
            }}
            cart={cart}
            onAddToCart={(item) => {
              setCart((prev) => {
                if (prev.some((c) => c.key === item.key)) return prev;
                return [...prev, item];
              });
              soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
              showToast(`${item.title} añadido al carrito.`);
            }}
            onRemoveFromCart={(key) => {
              setCart((prev) => prev.filter((item) => item.key !== key));
              soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
            }}
            onCheckout={() => {
              const purchasedIds = cart.map((c) => c.gameId);
              setGamesState((prev) =>
                prev.map((g) =>
                  purchasedIds.includes(g.id) ? { ...g, inCollection: true } : g
                )
              );
              setCart([]);
              soundEngine.notification(audioSettings.uiSfx, audioSettings.masterVolume);
              showToast('¡Compra completada! Tus nuevos títulos ya están en Biblioteca.');
            }}
          />
        )}

        {activeSection === 'amigos' && (
          <AmigosSection
            friends={friends}
            micMuted={audioSettings.micMuted}
            onToggleMic={() =>
              setAudioSettings((prev) => ({ ...prev, micMuted: !prev.micMuted }))
            }
            onInviteFriend={(friendId) => {
              setFriends((prev) =>
                prev.map((f) => (f.id === friendId ? { ...f, inVoiceParty: true } : f))
              );
              soundEngine.notification(audioSettings.uiSfx, audioSettings.masterVolume);
              showToast('Invitación enviada. El jugador se ha unido al grupo de voz.');
            }}
            onOpenFriendChat={(friendId) => {
              setActiveChatFriendId(friendId);
              handleOpenControlCenter('mensajes');
            }}
          />
        )}

        {activeSection === 'perfil' && (
          <PerfilSection
            gamertag={gamertag}
            onlineStatus={onlineStatus}
            onChangeStatus={(st) => {
              setOnlineStatus(st);
              soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
            }}
            onOpenLightbox={(capture) =>
              setModalContent({
                type: 'lightbox',
                capture
              })
            }
          />
        )}
      </main>

      {/* HUD DE CONTROLES INFERIOR */}
      <ControlsHud
        activeSection={activeSection}
        onPrev={() =>
          handleSelectGameIndex((selectedGameIndex - 1 + homeGames.length) % homeGames.length)
        }
        onNext={() => handleSelectGameIndex((selectedGameIndex + 1) % homeGames.length)}
        onPrimaryAction={() => {
          if (activeSection === 'inicio') {
            handleLaunchGame(currentHomeGame);
          }
        }}
        onToggleControlCenter={() => {
          if (controlCenterOpen) {
            setControlCenterOpen(false);
            soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
          } else {
            handleOpenControlCenter(controlCenterTab);
          }
        }}
        onBackAction={() => {
          if (controlCenterOpen) setControlCenterOpen(false);
          else if (activeSection !== 'inicio') setActiveSection('inicio');
        }}
      />

      {/* CENTRO DE CONTROL FLOTANTE */}
      <ControlCenter
        isOpen={controlCenterOpen}
        activeTab={controlCenterTab}
        onSelectTab={(tab) => {
          setControlCenterTab(tab);
          soundEngine.navigate(audioSettings.uiSfx, audioSettings.masterVolume);
        }}
        onClose={() => {
          setControlCenterOpen(false);
          soundEngine.back(audioSettings.uiSfx, audioSettings.masterVolume);
        }}
        friends={friends}
        chats={chats}
        activeChatFriendId={activeChatFriendId}
        onSelectChatFriend={setActiveChatFriendId}
        onSendMessage={handleSendMessage}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
          soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
        }}
        audioSettings={audioSettings}
        onUpdateAudio={(patch) => {
          setAudioSettings((prev) => ({ ...prev, ...patch }));
          soundEngine.navigate(audioSettings.uiSfx, audioSettings.masterVolume);
        }}
        systemSettings={systemSettings}
        onUpdateSystem={(patch) => {
          setSystemSettings((prev) => ({ ...prev, ...patch }));
          soundEngine.navigate(audioSettings.uiSfx, audioSettings.masterVolume);
        }}
        onTriggerStandby={(mode) => {
          setControlCenterOpen(false);
          setStandbyMode(mode);
          if (mode === 'reboot') {
            setTimeout(() => {
              setStandbyMode(null);
              setBooted(false);
            }, 1400);
          }
        }}
        onlineStatus={onlineStatus}
        onChangeStatus={(st) => {
          setOnlineStatus(st);
          soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
        }}
        gamertag={gamertag}
        onSwitchUser={() => {
          setGamertag((prev) => (prev === 'ÖG_Vanguard' ? 'ÖG_Guest' : 'ÖG_Vanguard'));
          soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
          showToast('Perfil activo cambiado.');
        }}
        accessibility={accessibility}
        onUpdateAccessibility={(patch) => {
          setAccessibility((prev) => ({ ...prev, ...patch }));
          soundEngine.select(audioSettings.uiSfx, audioSettings.masterVolume);
        }}
      />

      {/* MODALES DE DETALLES, ARTÍCULOS Y LIGHTBOX */}
      {modalContent && (
        <div
          onClick={() => setModalContent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-[ogFadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-slate-950/95 border border-white/20 overflow-hidden shadow-2xl animate-[ogScaleIn_0.25s_ease-out]"
          >
            {modalContent.type === 'article' && (
              <>
                <div className="relative h-56">
                  <GameArtwork
                    themeKey={modalContent.article.gameKey}
                    mode="backdrop"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setModalContent(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-white/20"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-white/12 text-sky-300">
                    {modalContent.article.tag}
                  </span>
                  <h3 className="text-2xl font-black text-white leading-snug">
                    {modalContent.article.title}
                  </h3>
                  <div className="space-y-3 text-sm text-white/80 leading-relaxed">
                    {modalContent.article.body.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              </>
            )}

            {modalContent.type === 'gameDetails' && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-300">
                      Ficha Técnica ÖG5
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {modalContent.game.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalContent(null)}
                    className="p-2 rounded-full bg-white/10 text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm text-white/80">{modalContent.game.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white/6">
                    <span className="text-white/50 block">Estudio</span>
                    <strong className="text-white">{modalContent.game.developer}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/6">
                    <span className="text-white/50 block">Tamaño SSD</span>
                    <strong className="text-white">{modalContent.game.sizeGB} GB</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/6">
                    <span className="text-white/50 block">Clasificación</span>
                    <strong className="text-white">{modalContent.game.rating}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/6">
                    <span className="text-white/50 block">Lanzamiento</span>
                    <strong className="text-white">{modalContent.game.releaseYear}</strong>
                  </div>
                </div>
              </div>
            )}

            {modalContent.type === 'activity' && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      {modalContent.activity.type} • {modalContent.game.shortTitle}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">
                      {modalContent.activity.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalContent(null)}
                    className="p-2 rounded-full bg-white/10 text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm text-white/80">{modalContent.activity.detail}</p>
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalContent(null)}
                    className="px-5 py-2 rounded-full bg-white/10 text-white text-xs font-bold"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const g = modalContent.game;
                      setModalContent(null);
                      handleLaunchGame(g);
                    }}
                    className="px-6 py-2 rounded-full bg-white text-slate-950 text-xs font-black"
                  >
                    Reanudar Actividad en Juego
                  </button>
                </div>
              </div>
            )}

            {modalContent.type === 'lightbox' && (
              <div>
                <div className="relative h-[55vh]">
                  <GameArtwork
                    themeKey={modalContent.capture.themeKey}
                    mode="backdrop"
                    className="w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => setModalContent(null)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/65 text-white hover:bg-white/25"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{modalContent.capture.title}</p>
                    <p className="text-xs text-white/65">{modalContent.capture.game}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-sky-300">
                    {modalContent.capture.res}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PANTALLA DE INICIO DE JUEGO INMERSIVA */}
      <GameLaunchOverlay game={launchedGame} onExit={() => setLaunchedGame(null)} />

      {/* PANTALLA DE MODO REPOSO / REINICIO */}
      {standbyMode && (
        <div
          onClick={() => {
            if (standbyMode === 'rest') setStandbyMode(null);
          }}
          className="fixed inset-0 z-[95] bg-black flex flex-col items-center justify-center text-center p-6 cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-amber-400/15 border border-amber-300/40 flex items-center justify-center mb-6 animate-pulse">
            <Power size={32} className="text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            {standbyMode === 'rest'
              ? 'Consola ÖG5 en Modo Reposo'
              : 'Reiniciando Sistema ÖG PLAY...'}
          </h2>
          <p className="text-sm text-white/65">
            {standbyMode === 'rest'
              ? 'Haz clic en cualquier lugar para reactivar la consola.'
              : 'Preparando entorno gráfico...'}
          </p>
        </div>
      )}

      {/* NOTIFICACIÓN FLOTANTE TIPO TROFEO / SISTEMA PS5 (TOAST) */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-[70] max-w-sm rounded-2xl bg-slate-950/92 border border-white/25 backdrop-blur-2xl px-4 py-3.5 shadow-2xl flex items-center gap-3 animate-[ogFadeUp_0.25s_ease-out]">
          <div className="w-8 h-8 rounded-full bg-sky-400/20 border border-sky-300/40 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-sky-300" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
            {toastMessage}
          </p>
        </div>
      )}
    </div>
  );
}