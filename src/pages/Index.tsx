import { useState } from "react";
import Icon from "@/components/ui/icon";

const COVER_1 = "https://cdn.poehali.dev/projects/02310e87-ccb0-47f4-bb70-d15d6719af0a/files/200de9ff-ed06-4eae-8109-ec8588e147c2.jpg";
const COVER_2 = "https://cdn.poehali.dev/projects/02310e87-ccb0-47f4-bb70-d15d6719af0a/files/6c54a926-c549-4a2a-a75b-29f8d6a0e30d.jpg";
const COVER_3 = "https://cdn.poehali.dev/projects/02310e87-ccb0-47f4-bb70-d15d6719af0a/files/ea9de2d2-3f46-4af5-bfe9-a62f602264be.jpg";

interface Track {
  id: number;
  title: string;
  album: string;
  genre: string;
  duration: string;
  cover: string;
  year: number;
}

const ALL_TRACKS: Track[] = [
  { id: 1, title: "Северный ветер", album: "Тишина", genre: "Ambient", duration: "4:23", cover: COVER_1, year: 2024 },
  { id: 2, title: "Город спит", album: "Ночные огни", genre: "Lo-fi", duration: "3:47", cover: COVER_2, year: 2024 },
  { id: 3, title: "Первый снег", album: "Тишина", genre: "Ambient", duration: "5:12", cover: COVER_1, year: 2023 },
  { id: 4, title: "Последний рейс", album: "Ночные огни", genre: "Indie", duration: "3:58", cover: COVER_2, year: 2024 },
  { id: 5, title: "Утренний свет", album: "Рассвет", genre: "Acoustic", duration: "4:05", cover: COVER_3, year: 2023 },
  { id: 6, title: "Далёкий берег", album: "Рассвет", genre: "Ambient", duration: "6:01", cover: COVER_3, year: 2023 },
  { id: 7, title: "Эхо", album: "Тишина", genre: "Lo-fi", duration: "3:30", cover: COVER_1, year: 2022 },
  { id: 8, title: "Между строк", album: "Ночные огни", genre: "Indie", duration: "4:44", cover: COVER_2, year: 2022 },
  { id: 9, title: "Туман", album: "Рассвет", genre: "Acoustic", duration: "5:20", cover: COVER_3, year: 2022 },
];

const GENRES = ["Все", "Ambient", "Lo-fi", "Indie", "Acoustic"];
const ALBUMS = [
  { title: "Тишина", year: 2024, tracks: 3, cover: COVER_1, desc: "Три трека о пустоте и покое" },
  { title: "Ночные огни", year: 2023, tracks: 3, cover: COVER_2, desc: "Городские зарисовки после полуночи" },
  { title: "Рассвет", year: 2022, tracks: 3, cover: COVER_3, desc: "Первый свет и тихое начало" },
];

type Section = "home" | "about" | "catalog";

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Все");
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentTrack = ALL_TRACKS.find((t) => t.id === playingId) ?? null;

  const filtered = ALL_TRACKS.filter((t) => {
    const g = genre === "Все" || t.genre === genre;
    const s = t.title.toLowerCase().includes(search.toLowerCase()) ||
              t.album.toLowerCase().includes(search.toLowerCase());
    return g && s;
  });

  const togglePlay = (id: number) => setPlayingId(playingId === id ? null : id);
  const inList = (id: number) => playlist.some((t) => t.id === id);
  const addToList = (track: Track) => { if (!inList(track.id)) setPlaylist([...playlist, track]); };
  const removeFromList = (id: number) => setPlaylist(playlist.filter((t) => t.id !== id));

  const navTo = (s: Section) => { setSection(s); setMobileOpen(false); };

  const NAV = [
    { id: "home" as Section, label: "Главная" },
    { id: "about" as Section, label: "Об артисте" },
    { id: "catalog" as Section, label: "Каталог" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e4dc] font-ibm">

      {/* ── HEADER ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navTo("home")} className="font-cormorant text-xl tracking-[0.25em] uppercase text-[#e8e4dc] hover:text-[#c9a96e] transition-colors">
            Дениа49-МуЗыКа
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => navTo(n.id)}
                className={`text-xs tracking-[0.2em] uppercase transition-colors ${section === n.id ? "text-[#c9a96e]" : "text-[#666] hover:text-[#e8e4dc]"}`}>
                {n.label}
              </button>
            ))}
            <button onClick={() => setShowPlaylist(!showPlaylist)}
              className="relative text-[#666] hover:text-[#c9a96e] transition-colors">
              <Icon name="ListMusic" size={18} />
              {playlist.length > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#c9a96e] rounded-full text-[9px] text-black font-bold flex items-center justify-center">
                  {playlist.length}
                </span>
              )}
            </button>
          </nav>

          <button className="md:hidden text-[#666] hover:text-[#e8e4dc] transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0d0d0d] px-6 py-5 flex flex-col gap-5">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => navTo(n.id)} className={`text-xs tracking-[0.2em] uppercase text-left ${section === n.id ? "text-[#c9a96e]" : "text-[#666]"}`}>
                {n.label}
              </button>
            ))}
            <button onClick={() => { setShowPlaylist(!showPlaylist); setMobileOpen(false); }}
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#666]">
              <Icon name="ListMusic" size={16} /> Плейлист {playlist.length > 0 && `(${playlist.length})`}
            </button>
          </div>
        )}
      </header>

      {/* ── PLAYLIST DRAWER ── */}
      {showPlaylist && (
        <aside className="fixed top-16 right-0 bottom-0 w-80 z-40 bg-[#0f0f0f] border-l border-white/[0.06] flex flex-col animate-slide-in-right">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <span className="font-cormorant text-lg tracking-wider">Плейлист</span>
            <button onClick={() => setShowPlaylist(false)} className="text-[#555] hover:text-[#e8e4dc] transition-colors">
              <Icon name="X" size={16} />
            </button>
          </div>

          {playlist.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#444]">
              <Icon name="Music2" size={36} />
              <p className="text-xs tracking-[0.2em] uppercase">Плейлист пуст</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto py-3">
              {playlist.map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] group transition-colors">
                  <span className="text-[#444] text-xs w-4 shrink-0">{i + 1}</span>
                  <img src={t.cover} alt={t.title} className="w-9 h-9 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{t.title}</p>
                    <p className="text-xs text-[#555] truncate mt-0.5">{t.album}</p>
                  </div>
                  <button onClick={() => removeFromList(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 transition-all">
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {playlist.length > 0 && (
            <div className="p-4 border-t border-white/[0.06]">
              <button className="w-full py-3 bg-[#c9a96e] text-black text-xs tracking-[0.2em] uppercase rounded-lg hover:bg-[#d4b87a] transition-colors font-medium">
                Скачать всё
              </button>
            </div>
          )}
        </aside>
      )}

      <main className={`pt-16 ${currentTrack ? "pb-24" : ""}`}>

        {/* ════════════ HOME ════════════ */}
        {section === "home" && (
          <>
            {/* Hero */}
            <section className="relative min-h-[88vh] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img src={COVER_1} alt="" className="w-full h-full object-cover opacity-[0.12]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
              </div>
              <div className="relative max-w-6xl mx-auto px-6 w-full py-24">
                <p className="text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-8 animate-fade-in">
                  Авторская музыка · Бесплатно
                </p>
                <h1 className="font-cormorant text-[clamp(3rem,10vw,7rem)] leading-[0.92] tracking-tight mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Слушай.<br />
                  <em className="text-[#c9a96e] not-italic">Скачивай.</em><br />
                  Наслаждайся.
                </h1>
                <p className="text-[#777] text-base md:text-lg leading-relaxed max-w-md mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  Ambient, lo-fi и акустика — для тех, кто ценит тишину и детали. Вся музыка в открытом доступе.
                </p>
                <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <button onClick={() => navTo("catalog")}
                    className="px-7 py-3.5 bg-[#c9a96e] text-black text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-[#d4b87a] transition-all font-medium">
                    Открыть каталог
                  </button>
                  <button onClick={() => navTo("about")}
                    className="px-7 py-3.5 border border-white/15 text-[#aaa] text-xs tracking-[0.2em] uppercase rounded-xl hover:border-[#c9a96e]/50 hover:text-[#c9a96e] transition-all">
                    Об артисте
                  </button>
                </div>
              </div>
            </section>

            {/* Popular */}
            <section className="max-w-6xl mx-auto px-6 py-20">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-2">Сейчас слушают</p>
                  <h2 className="font-cormorant text-4xl">Популярные</h2>
                </div>
                <button onClick={() => navTo("catalog")} className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#555] hover:text-[#c9a96e] transition-colors">
                  Все треки <Icon name="ArrowRight" size={12} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {ALL_TRACKS.slice(0, 3).map((track) => (
                  <TrackCard key={track.id} track={track}
                    isPlaying={playingId === track.id}
                    onPlay={() => togglePlay(track.id)}
                    inPlaylist={inList(track.id)}
                    onAddPlaylist={() => addToList(track)} />
                ))}
              </div>
            </section>

            {/* Albums */}
            <section className="max-w-6xl mx-auto px-6 py-10 pb-28 border-t border-white/[0.06]">
              <div className="mb-10 pt-16">
                <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-2">Дискография</p>
                <h2 className="font-cormorant text-4xl">Альбомы</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {ALBUMS.map((alb) => (
                  <button key={alb.title} onClick={() => navTo("catalog")}
                    className="group text-left">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                      <img src={alb.cover} alt={alb.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#c9a96e] flex items-center justify-center">
                          <Icon name="Play" size={22} className="text-black translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-cormorant text-2xl mb-1">{alb.title}</h3>
                    <p className="text-[#555] text-xs tracking-wider mb-1">{alb.year} · {alb.tracks} трека</p>
                    <p className="text-[#444] text-xs">{alb.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════ ABOUT ════════════ */}
        {section === "about" && (
          <section className="max-w-6xl mx-auto px-6 py-20 pb-32 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={COVER_3} alt="Артист" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-5 -right-5 w-44 h-44 border border-[#c9a96e]/20 rounded-2xl -z-10" />
              </div>
              <div>
                <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-5">Об артисте</p>
                <h1 className="font-cormorant text-[clamp(2.5rem,6vw,4.5rem)] leading-none mb-8">Дениа49</h1>
                <div className="space-y-5 text-[#888] text-sm leading-relaxed">
                  <p>Независимый музыкант, пишущий инструментальную музыку на стыке ambient и acoustic.</p>
                  <p>Моя музыка — это попытка остановить время и дать пространство для мысли. Начал создавать треки в 2018 году и с тех пор выпустил три альбома.</p>
                  <p>Я верю, что музыка должна быть доступной. Все треки бесплатны для скачивания и прослушивания.</p>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-6">
                  {[{ num: "9", label: "Треков" }, { num: "3", label: "Альбома" }, { num: "2018", label: "С года" }].map((s) => (
                    <div key={s.label} className="border-t border-white/[0.08] pt-4">
                      <p className="font-cormorant text-3xl text-[#c9a96e]">{s.num}</p>
                      <p className="text-[10px] text-[#444] tracking-[0.2em] uppercase mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => navTo("catalog")}
                  className="mt-10 px-7 py-3.5 bg-[#c9a96e] text-black text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-[#d4b87a] transition-colors font-medium">
                  Слушать музыку
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ════════════ CATALOG ════════════ */}
        {section === "catalog" && (
          <section className="max-w-6xl mx-auto px-6 py-16 pb-32 animate-fade-in">
            <div className="mb-10">
              <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-2">Музыка</p>
              <h1 className="font-cormorant text-5xl mb-8">Каталог</h1>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Icon name="Search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
                  <input type="text" placeholder="Поиск по названию или альбому…"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-[#444] focus:outline-none focus:border-[#c9a96e]/40 transition-colors" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {GENRES.map((g) => (
                    <button key={g} onClick={() => setGenre(g)}
                      className={`px-4 py-3 text-[10px] tracking-[0.15em] uppercase rounded-xl border transition-all ${genre === g ? "bg-[#c9a96e] text-black border-[#c9a96e]" : "border-white/[0.08] text-[#666] hover:border-[#c9a96e]/40 hover:text-[#c9a96e]"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-[#444]">
                <Icon name="SearchX" size={36} className="mx-auto mb-4" />
                <p className="text-xs tracking-[0.2em] uppercase">Ничего не найдено</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((track, i) => (
                  <div key={track.id}
                    className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 ${playingId === track.id ? "border-[#c9a96e]/20 bg-[#c9a96e]/[0.04]" : "border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"}`}>
                    <span className="text-[#444] text-xs w-5 text-right shrink-0 group-hover:hidden">{i + 1}</span>
                    <button onClick={() => togglePlay(track.id)}
                      className="hidden group-hover:flex w-5 shrink-0 text-[#c9a96e] justify-center">
                      <Icon name={playingId === track.id ? "Pause" : "Play"} size={14} />
                    </button>
                    <img src={track.cover} alt={track.title} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${playingId === track.id ? "text-[#c9a96e]" : ""}`}>{track.title}</p>
                      <p className="text-xs text-[#444] truncate mt-0.5">{track.album} · {track.year}</p>
                    </div>
                    <span className="hidden md:block text-[10px] text-[#444] px-3 py-1 bg-white/[0.04] rounded-full tracking-wider">{track.genre}</span>
                    <span className="text-[#444] text-xs shrink-0">{track.duration}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => addToList(track)}
                        className={`p-2 rounded-lg transition-all ${inList(track.id) ? "text-[#c9a96e]" : "text-[#444] hover:text-[#c9a96e] opacity-0 group-hover:opacity-100"}`}>
                        <Icon name={inList(track.id) ? "BookmarkCheck" : "Bookmark"} size={15} />
                      </button>
                      <button className="p-2 rounded-lg text-[#444] hover:text-[#c9a96e] transition-all opacity-0 group-hover:opacity-100">
                        <Icon name="Download" size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── PLAYER BAR ── */}
      {currentTrack && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center gap-5">
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-11 h-11 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate text-[#c9a96e]">{currentTrack.title}</p>
              <p className="text-xs text-[#444] truncate mt-0.5">{currentTrack.album}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[#444] hover:text-[#e8e4dc] transition-colors">
                <Icon name="SkipBack" size={18} />
              </button>
              <button onClick={() => setPlayingId(null)}
                className="w-11 h-11 rounded-full bg-[#c9a96e] flex items-center justify-center text-black hover:bg-[#d4b87a] transition-colors">
                <Icon name="Pause" size={18} />
              </button>
              <button className="text-[#444] hover:text-[#e8e4dc] transition-colors">
                <Icon name="SkipForward" size={18} />
              </button>
            </div>
            <button className="hidden md:block text-[#444] hover:text-[#c9a96e] transition-colors ml-2">
              <Icon name="Download" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackCard({ track, isPlaying, onPlay, inPlaylist, onAddPlaylist }: {
  track: Track;
  isPlaying: boolean;
  onPlay: () => void;
  inPlaylist: boolean;
  onAddPlaylist: () => void;
}) {
  return (
    <div className={`group rounded-2xl overflow-hidden border transition-all duration-300 ${isPlaying ? "border-[#c9a96e]/30" : "border-white/[0.06] hover:border-white/[0.1]"}`}>
      <div className="relative aspect-square">
        <img src={track.cover} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-[#c9a96e] flex items-center justify-center shadow-xl">
            <Icon name={isPlaying ? "Pause" : "Play"} size={22} className="text-black translate-x-0.5" />
          </div>
        </button>
        {isPlaying && (
          <div className="absolute top-3 right-3 flex items-end gap-0.5 h-5">
            {[1, 2, 3, 2].map((h, i) => (
              <div key={i} className="w-1 bg-[#c9a96e] rounded-full bar"
                style={{ height: `${h * 5}px`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 bg-[#111]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`text-sm font-medium truncate ${isPlaying ? "text-[#c9a96e]" : ""}`}>{track.title}</h3>
            <p className="text-xs text-[#444] mt-0.5">{track.album} · {track.duration}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={onAddPlaylist}
              className={`p-1.5 rounded-lg transition-colors ${inPlaylist ? "text-[#c9a96e]" : "text-[#444] hover:text-[#c9a96e]"}`}>
              <Icon name={inPlaylist ? "BookmarkCheck" : "Bookmark"} size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-[#444] hover:text-[#c9a96e] transition-colors">
              <Icon name="Download" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
