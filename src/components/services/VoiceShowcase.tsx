"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { claimAudio, registerAudio } from "@@/lib/audio-focus";
import FullscreenStage, { FsControls } from "@@/components/common/FullscreenStage";

const FOCUS = "voice-showcase";

/**
 * Voice showcase: eight voice artists (senior to kid) across several languages. Every clip carries its own voice
 * track so lips and voice stay in sync. Idle: the active clip loops muted. "Listen" restarts it with sound; when it
 * ends the showcase moves on to the next voice in the same language until paused.
 * Only the active clip loads (one <video>, its sources swap) and nothing loads until the section nears the viewport.
 *
 * Data driven: add a language to LANGS, then add CLIPS rows plus files at /media/voices/<voice>-<lang>.{webm,mp4}
 * and <voice>-<lang>-poster.avif. Language chips show only the languages a voice has.
 *
 * DEMO CLIPS: generated studio performances (EVA logo top-left plus a faint centre watermark).
 * Replace them with real EVA artist recordings (same file names, about 8 s, webm VP9/Opus + mp4 H.264/AAC).
 */
const VOICES = [
  { id: "senior-male", label: "Senior male", who: "senior Indian man with a white beard" },
  { id: "mid-male", label: "Middle-aged male", who: "middle-aged Indian man" },
  { id: "young-male", label: "Young male", who: "young Indian man" },
  { id: "kid-boy", label: "Kid boy", who: "Indian boy" },
  { id: "senior-female", label: "Senior female", who: "senior Indian woman in a saree" },
  { id: "mid-female", label: "Middle-aged female", who: "middle-aged Indian woman" },
  { id: "young-female", label: "Young female", who: "young Indian woman" },
  { id: "kid-girl", label: "Kid girl", who: "Indian girl" },
] as const;

const LANGS = [
  { id: "en", label: "English", lang: "en" },
  { id: "hi", label: "Hindi", lang: "hi" },
  { id: "bn", label: "Bengali", lang: "bn" },
  { id: "mr", label: "Marathi", lang: "mr" },
  { id: "ta", label: "Tamil", lang: "ta" },
] as const;

type VoiceId = (typeof VOICES)[number]["id"];
type LangId = (typeof LANGS)[number]["id"];
type Clip = { voice: VoiceId; lang: LangId; genre: string; line: string };

const CLIPS: Clip[] = [
  { voice: "senior-male", lang: "en", genre: "Documentary", line: "Long before the cities rose, these mountains kept the stories of our people." },
  { voice: "mid-male", lang: "en", genre: "Movie trailer", line: "This summer, one man stands between the city and the storm. Coming soon to theatres." },
  { voice: "young-male", lang: "en", genre: "Web series", line: "Bro, I quit my job today. Tomorrow, we start our own company." },
  { voice: "kid-boy", lang: "en", genre: "Cartoon", line: "Hey buddy, wanna build the biggest sandcastle ever? Let's go!" },
  { voice: "senior-female", lang: "en", genre: "Storytelling", line: "Once upon a time, a little sparrow built her nest on our mango tree." },
  { voice: "mid-female", lang: "en", genre: "Corporate", line: "For over twenty years, we have helped families plan a safer tomorrow." },
  { voice: "young-female", lang: "en", genre: "Promo", line: "Big festive sale! Up to fifty percent off, this weekend only. Hurry, shop now!" },
  { voice: "kid-girl", lang: "en", genre: "Anime", line: "Look, the magic star is glowing! Come on, let's follow it!" },
  { voice: "senior-male", lang: "hi", genre: "TV series", line: "धर्म के मार्ग पर चलने वाला कभी अकेला नहीं होता, पुत्र।" },
  { voice: "mid-male", lang: "hi", genre: "TV series", line: "माँ, मैं वादा करता हूँ, इस घर की इज़्ज़त पर कभी आँच नहीं आने दूँगा।" },
  { voice: "young-male", lang: "hi", genre: "Promo", line: "नया फ़ोन, धमाकेदार ऑफ़र! आज ही ख़रीदें, कल देर हो जाएगी!" },
  { voice: "kid-boy", lang: "hi", genre: "Anime", line: "मैं हार नहीं मानूँगा! मैं सबसे ताकतवर निंजा बनूँगा!" },
  { voice: "senior-female", lang: "hi", genre: "TV series", line: "बहू, इस घर की ख़ुशियाँ अब तुम्हारे हाथों में हैं।" },
  { voice: "mid-female", lang: "hi", genre: "E-learning", line: "आज के इस पाठ में, हम सीखेंगे कि पैसे की बचत कैसे करें।" },
  { voice: "young-female", lang: "hi", genre: "Movie", line: "अगर तुम सच में मुझसे प्यार करते हो, तो आज ये बात सबके सामने कहो।" },
  { voice: "kid-girl", lang: "hi", genre: "Cartoon", line: "मम्मी, देखो! मेरी गुड़िया ने उड़ना सीख लिया!" },
  { voice: "senior-male", lang: "bn", genre: "Movie", line: "এই জমি আমার বাপ-দাদার, আমি কোথাও যাব না।" },
  { voice: "mid-male", lang: "bn", genre: "Documentary", line: "নদীর ধারে এই গ্রামে, প্রতিটি ভোর নতুন গল্প নিয়ে আসে।" },
  { voice: "young-male", lang: "bn", genre: "Anime", line: "আমি কথা দিচ্ছি, এই লড়াই আমি জিতবই!" },
  { voice: "kid-boy", lang: "bn", genre: "Kids TV", line: "দাদু, আরেকটা গল্প বলো না, প্লিজ!" },
  { voice: "senior-female", lang: "bn", genre: "Storytelling", line: "অনেক দিন আগে, এক রাজার সাতটি মেয়ে ছিল।" },
  { voice: "mid-female", lang: "bn", genre: "TV series", line: "তুই ফিরে এসেছিস? আমি জানতাম, তুই আসবি।" },
  { voice: "young-female", lang: "bn", genre: "Anime", line: "ভয় পেও না, আমি আছি! একসাথে আমরা জিতবই!" },
  { voice: "kid-girl", lang: "bn", genre: "Cartoon", line: "চলো বন্ধুরা, আজ আমরা চাঁদে যাব!" },
  { voice: "senior-male", lang: "mr", genre: "Storytelling", line: "आमच्या लहानपणी, गावात वीज नव्हती, पण गोष्टी भरपूर होत्या." },
  { voice: "mid-male", lang: "mr", genre: "Corporate", line: "प्रत्येक मोठं स्वप्न एका छोट्या पावलाने सुरू होतं. चला, आज ते पाऊल टाकूया." },
  { voice: "young-male", lang: "mr", genre: "Web series", line: "अरे यार, आज पुन्हा ट्रॅफिकमध्ये अडकलो, बॉस नक्की ओरडणार!" },
  { voice: "kid-boy", lang: "mr", genre: "Kids TV show", line: "चला मित्रांनो, आज आपण जंगलात नवीन मित्र शोधूया!" },
  { voice: "senior-female", lang: "mr", genre: "TV series", line: "सूनबाई, आपल्या घराची परंपरा नेहमी जपायची." },
  { voice: "mid-female", lang: "mr", genre: "TV ad", line: "शुद्ध आणि ताजं दूध, आता थेट तुमच्या घरी!" },
  { voice: "young-female", lang: "mr", genre: "Storytelling", line: "खूप वर्षांपूर्वी, एका छोट्या गावात एक हुशार मुलगी राहत होती." },
  { voice: "kid-girl", lang: "mr", genre: "Anime", line: "मी घाबरणार नाही! माझी जादू सगळ्यांना वाचवेल!" },
  { voice: "senior-male", lang: "ta", genre: "Movie", line: "தம்பி, உழைப்புக்கு எப்போதும் மரியாதை உண்டு." },
  { voice: "mid-male", lang: "ta", genre: "TV show", line: "வணக்கம் நண்பர்களே! இன்றைய நிகழ்ச்சிக்கு உங்களை அன்புடன் வரவேற்கிறோம்." },
  { voice: "young-male", lang: "ta", genre: "Movie", line: "இது என் ஊர், இங்கே நியாயம் தான் ஜெயிக்கும்." },
  { voice: "kid-boy", lang: "ta", genre: "Cartoon", line: "ஐயோ! என் சாக்லேட்டை யார் சாப்பிட்டது?" },
  { voice: "senior-female", lang: "ta", genre: "Cartoon", line: "குழந்தைகளே, பாட்டி சூடான இட்லி செய்திருக்கேன், சாப்பிட வாங்க!" },
  { voice: "mid-female", lang: "ta", genre: "TV news", line: "இன்றைய முக்கிய செய்திகளை இப்போது பார்க்கலாம்." },
  { voice: "young-female", lang: "ta", genre: "TV series", line: "இந்த குடும்பத்துக்காக நான் எதையும் செய்வேன், அதுதான் என் முடிவு." },
  { voice: "kid-girl", lang: "ta", genre: "Kids TV show", line: "ஹாய் குட்டீஸ்! இன்னைக்கு நாம ஒரு புது பாட்டு கத்துக்கலாமா?" },
];

const findClip = (v: VoiceId, l: LangId) => CLIPS.find((c) => c.voice === v && c.lang === l);
const langsFor = (v: VoiceId) => LANGS.filter((l) => findClip(v, l.id));
const base = (c: Clip) => `/media/voices/${c.voice}-${c.lang}`;
const R = 15;
const CIRC = 2 * Math.PI * R;

/** Arrow / Home / End move focus inside a group of buttons (roving through siblings). */
function rove(e: React.KeyboardEvent<HTMLElement>, selector: string) {
  const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(selector));
  const idx = btns.indexOf(document.activeElement as HTMLButtonElement);
  if (idx < 0) return;
  let n = -1;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (idx + 1) % btns.length;
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (idx - 1 + btns.length) % btns.length;
  else if (e.key === "Home") n = 0;
  else if (e.key === "End") n = btns.length - 1;
  if (n >= 0) {
    e.preventDefault();
    btns[n].focus();
  }
}

export default function VoiceShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);
  const reducedRef = useRef(false);
  const [near, setNear] = useState(false);
  const [voice, setVoice] = useState<VoiceId>(VOICES[1].id);
  const [lang, setLang] = useState<LangId>("en");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playingRef = useRef(false);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  // Set when a new clip should start with sound once its sources are in the DOM.
  const pendingSound = useRef(false);

  const clip = findClip(voice, lang) ?? findClip(voice, "en") ?? CLIPS[0];
  const vMeta = VOICES.find((v) => v.id === clip.voice)!;
  const lMeta = LANGS.find((l) => l.id === clip.lang)!;
  const caption = `${lMeta.label} · ${clip.genre}`;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) setNear(true);
        else {
          const v = vid.current;
          if (v) {
            v.pause();
            v.muted = true;
          }
          setPlaying(false);
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Clip changed (or first load): reload sources, then either play with sound or loop muted.
  useEffect(() => {
    const v = vid.current;
    if (!v || !near) return;
    v.load();
    setProgress(0);
    if (pendingSound.current) {
      pendingSound.current = false;
      v.loop = false;
      claimAudio(FOCUS);
      v.muted = false;
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {
          v.muted = true;
          setPlaying(false);
        });
    } else {
      v.muted = true;
      v.loop = true;
      if (visible.current && !reducedRef.current) v.play().catch(() => {});
    }
  }, [clip.voice, clip.lang, near]);

  useEffect(() => () => vid.current?.pause(), []);

  // Keep the active voice chip in view inside the scrollable row (without scrolling the page).
  const pillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = pillsRef.current;
    const btn = row?.querySelector<HTMLElement>(`[data-voice="${clip.voice}"]`);
    if (!row || !btn) return;
    const r = row.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    if (br.left < r.left + 12 || br.right > r.right - 12)
      row.scrollBy({ left: br.left - r.left - (r.width - br.width) / 2, behavior: reducedRef.current ? "auto" : "smooth" });
  }, [clip.voice]);

  // One sound at a time: another player took sound, so this one goes back to a muted loop.
  useEffect(
    () =>
      registerAudio(FOCUS, () => {
        const v = vid.current;
        if (v) {
          v.muted = true;
          v.loop = true;
          if (reducedRef.current) v.pause();
        }
        playingRef.current = false;
        setPlaying(false);
      }),
    [],
  );

  const go = useCallback((v: VoiceId, l: LangId, sound: boolean) => {
    const target = findClip(v, l) ? l : "en";
    pendingSound.current = sound;
    setNear(true);
    setVoice(v);
    setLang(target);
    // Same clip: the effect will not rerun, so restart it here.
    if (v === voice && target === lang) {
      const el = vid.current;
      if (!el) return;
      pendingSound.current = false;
      if (!sound) return;
      el.loop = false;
      claimAudio(FOCUS);
      el.muted = false;
      el.currentTime = 0;
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [voice, lang]);

  const pause = () => {
    vid.current?.pause();
    setPlaying(false);
  };

  const onListenVoice = (v: VoiceId) => {
    if (v === clip.voice && playing) return pause();
    const el = vid.current;
    if (v === clip.voice && el && !el.muted && el.currentTime > 0 && !el.ended) {
      claimAudio(FOCUS);
      el.play().then(() => setPlaying(true)).catch(() => {});
      return;
    }
    go(v, lang, true);
  };

  const onLang = (l: LangId) => go(clip.voice, l, true);

  const onTime = () => {
    const v = vid.current;
    if (v && !v.muted && v.duration) setProgress(v.currentTime / v.duration);
  };

  const onEnded = () => {
    if (!playingRef.current) return;
    // Next voice that has this language.
    const i = VOICES.findIndex((v) => v.id === clip.voice);
    for (let k = 1; k <= VOICES.length; k++) {
      const n = VOICES[(i + k) % VOICES.length].id;
      if (findClip(n, clip.lang)) return go(n, clip.lang, true);
    }
  };

  const langs = langsFor(clip.voice);
  const ring = (on: boolean, act: boolean) => (
    <span className="eva-voices-ring" aria-hidden="true">
      <svg width="36" height="36" viewBox="0 0 36 36" focusable="false">
        <circle cx="18" cy="18" r={R} className="eva-voices-ring-bg" />
        <circle
          cx="18"
          cy="18"
          r={R}
          className="eva-voices-ring-fg"
          strokeDasharray={CIRC}
          strokeDashoffset={act ? CIRC * (1 - progress) : CIRC}
        />
        {on ? <path d="M14 12h3v12h-3zM19 12h3v12h-3z" fill="currentColor" /> : <path d="M15 12l9 6-9 6z" fill="currentColor" />}
      </svg>
    </span>
  );

  return (
    <FullscreenStage label="Voice-over showcase" fill>
    <div ref={root} className="eva-voices">
      <video
        ref={vid}
        className="eva-svc-video eva-voices-clip is-active"
        poster={`${base(clip)}-poster.avif`}
        muted
        loop
        playsInline
        onTimeUpdate={onTime}
        onEnded={onEnded}
        preload="none"
        aria-label={`${vMeta.label} voice artist, a ${vMeta.who} with headphones, speaking ${lMeta.label} at a studio microphone`}
        disablePictureInPicture
        data-audio-focus={FOCUS}
      >
        {near && (
          <>
            <source src={`${base(clip)}.webm`} type="video/webm" />
            <source src={`${base(clip)}.mp4`} type="video/mp4" />
          </>
        )}
      </video>
      <p className="eva-voices-tag">
        <span className="sr-only">Now showing: {vMeta.label} voice, </span>
        {caption}
      </p>
      <FsControls only>
        <p className="eva-voices-now">
          <span>{vMeta.label} · {caption}</span>
          <q lang={lMeta.lang}>{clip.line}</q>
        </p>
      </FsControls>
      <FsControls>
      <div className="eva-voices-bar">
        {langs.length > 1 && (
          <div className="eva-voices-langs" role="group" aria-label="Sample language" onKeyDown={(e) => rove(e, "button")}>
            {langs.map((l) => (
              <button
                key={l.id}
                type="button"
                lang={l.lang}
                data-audio-btn=""
                className="eva-voices-lang"
                aria-pressed={l.id === clip.lang}
                onClick={() => onLang(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
        <div className="eva-voices-row">
          <div ref={pillsRef} className="eva-voices-pills" role="group" aria-label="Listen to a voice sample" onKeyDown={(e) => rove(e, "button[data-voice]")}>
            {VOICES.map((v) => {
              const act = v.id === clip.voice;
              const on = act && playing;
              return (
                <button
                  key={v.id}
                  type="button"
                  data-voice={v.id}
                  data-audio-btn=""
                  className={`eva-voices-pill${act ? " is-active" : ""}`}
                  aria-pressed={on}
                  aria-label={`Listen: ${v.label} voice`}
                  onClick={() => onListenVoice(v.id)}
                >
                  {ring(on, act)}
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
          <div className="eva-voices-mobile">
            <label className="sr-only" htmlFor="eva-voice-select">
              Voice
            </label>
            <select
              id="eva-voice-select"
              className="eva-voices-select"
              value={clip.voice}
              onChange={(e) => go(e.target.value as VoiceId, lang, playing)}
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              data-audio-btn=""
              className="eva-voices-pill is-active"
              aria-pressed={playing}
              aria-label={`Listen: ${vMeta.label} voice`}
              onClick={() => onListenVoice(clip.voice)}
            >
              {ring(playing, true)}
              <span>{playing ? "Pause" : "Listen"}</span>
            </button>
          </div>
          {playing && (
            <button type="button" className="eva-media-sound eva-voices-pause" data-audio-btn="" onClick={pause}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" />
              </svg>
              <span>Pause</span>
              <span className="sr-only"> voice samples</span>
            </button>
          )}
        </div>
      </div>
      </FsControls>
      <p className="sr-only" aria-live="polite">
        {playing ? `Playing ${vMeta.label.toLowerCase()} voice, ${caption}` : ""}
      </p>
    </div>
    </FullscreenStage>
  );
}
