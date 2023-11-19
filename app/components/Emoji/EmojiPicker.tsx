'use client';

import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";
import Icon from "../Icon";

interface EmojiPickerProps extends HTMLAttributes<HTMLDivElement> {
  onEmojiSelect?: (emoji: any) => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  removeDefaultStyles?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

async function getEmojis() {
  const emojiApiUrl = process.env.NEXT_PUBLIC_EMOJI_API_URL || "https://unpkg.com/unicode-emoji-json@0.5.0/data-by-group.json";

  const res = await fetch(emojiApiUrl);

  if (!res.ok) throw new Error('Failed to fetch data');

  return res.json();
}

// async function translateSearch(search: string) {
//   const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=${search}`

//   const res = await fetch(translateUrl);

//   if (!res.ok) throw new Error('Failed to fetch data');

//   return res.json();
// }

export const EmojiPicker = forwardRef<HTMLDivElement, EmojiPickerProps>(({
  onEmojiSelect,
  onClose,
  className,
  style,
  removeDefaultStyles = false,
}, ref) => {
  const [emojis, setEmojis] = useState<any>([]);
  const [filteredEmojis, setFilteredEmojis] = useState<any>(null);
  const [emojisByGroup, setEmojisByGroup] = useState<any>([]);
  const [selectedEmojiSection, setSelectedEmojiSection] = useState<string | null>(null);

  const [search, setSearch] = useState<string | null>(null);

  const defaultStylesClass = removeDefaultStyles
    ? ''
    : 'flex flex-col w-full max-w-xl h-fit gap-4 bg-zinc-950 rounded p-4';

  const handleSearchChange = async (searchValue: string) => {
    if (!searchValue || !emojis) {
      setFilteredEmojis(null);
      return;
    }

    let searchTerm = searchValue;

    // const translatedSearch = await translateSearch(searchValue);

    // if (translatedSearch && translatedSearch[0] && translatedSearch[0][0] && translatedSearch[0][0][0]) {
    //   searchTerm = translatedSearch[0][0][0];
    // }

    const filteredEmojiData = emojis.filter((emoji: any) =>
      emoji.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredEmojis(filteredEmojiData);
  };

  const handleScrollToCategory = (categoryId: string) => {
    const categoryElement = document.getElementById(categoryId);
    if (!categoryElement) return;

    categoryElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmojiClick = (emoji: string) => {
    if (onEmojiSelect) onEmojiSelect(emoji);
  };

  useEffect(() => {
    async function fetchData() {
      const emojiData = await getEmojis();

      if (emojiData) setEmojisByGroup(emojiData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!emojisByGroup || (emojisByGroup && !(emojisByGroup.length > 0))) return;

    const allEmojis: any[] = [];

    emojisByGroup.forEach((group: any) => {
      allEmojis.push(...group.emojis);
    });

    setEmojis(allEmojis);
  }, [emojisByGroup]);

  useEffect(() => {
    if (search !== null && search.length > 0 && emojis) handleSearchChange(search);
  }, [search]);

  useEffect(() => {
    setSearch(null);
  }, [onClose]);

  return (
    <section
      className={`${defaultStylesClass}${className}`}
      style={{
        width: '-webkit-fill-available',
        ...style,
      }}
      ref={ref}
    >
      {search && filteredEmojis ? (
        filteredEmojis.length > 0 ? (
          <>
            <span className="text-zinc-500">Results to "{search}" search</span>
            <ul className="flex flex-wrap gap-1 w-full h-fit overflow-y-auto overflow-x-hidden shadow-inner rounded">
              {filteredEmojis.map((emoji: any, index: number) => {
                const {
                  name,
                  emoji: character
                } = emoji;

                return (
                  <button
                    key={index}
                    title={name}
                    className="flex justify-center items-center text-center text-xl w-14 h-14 rounded p-2 select-none bg-zinc-900 hover:bg-zinc-800"
                    onClick={() => handleEmojiClick(character)}
                  >
                    {character}
                  </button>
                );
              })}
            </ul>
          </>
        ) : (
          <span className="text-zinc-500">No results found.</span>
        )
      ) : emojis && emojis.length > 0 ? (
        <>
          <span className="text-zinc-500">Categories</span>
          <label className="flex flex-shrink-0 flex-grow gap-1 w-full h-fit overflow-x-auto overflow-y-hidden scroll-px-0">
            {emojisByGroup.map((group: any) => {
              const {
                name,
                slug,
                emojis,
              } = group;

              const firstEmoji = emojis[0].emoji;

              return (
                <button
                  className={`w-14 h-14 flex-shrink-0 text-xl font-semibold rounded p-2 ${selectedEmojiSection === group
                    ? 'bg-zinc-800'
                    : 'bg-zinc-900'
                    }`}
                  key={slug}
                  title={name}
                  onClick={() => {
                    setSelectedEmojiSection(slug);
                    handleScrollToCategory(slug);
                  }}
                >
                  {
                    firstEmoji
                  }
                </button>
              );
            })}
          </label>

          <ul className="flex flex-wrap gap-4 my-2 w-full h-80 overflow-y-auto shadow-inner rounded">
            {emojisByGroup.map((group: any) => {
              return (
                <div
                  key={group.slug}
                  id={group.slug}
                  className="flex flex-wrap gap-4 my-2 w-full"
                >
                  <span
                    id={group.slug}
                    className="text-zinc-500"
                  >
                    {group.name}
                  </span>
                  <ul className="flex flex-wrap gap-1 w-full h-auto shadow-inner rounded">
                    {group.emojis.map((emoji: any) => {
                      const {
                        slug,
                        name,
                        emoji: character
                      } = emoji;

                      return (
                        <button
                          key={slug}
                          title={name}
                          className="flex justify-center items-center text-center text-xl w-14 h-14 rounded p-2 select-none bg-zinc-900 hover:bg-zinc-800"
                          onClick={() => handleEmojiClick(character)}
                        >
                          {character}
                        </button>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </ul>
        </>
      ) : (
        <span className="text-zinc-500">
          Loading...
        </span>
      )}
      <footer className="relative flex items-center justify-between mt-4">
        <div
          className="flex items-center justify-between w-full bg-zinc-900 border border-zinc-800 rounded min-w-12 min-h-[48px] h-12 overflow-hidden transition-all duration-300"
          style={{ width: search ? 'calc(100% - 48px)' : '100%' }}
        >
          <button className="hidden sm:flex items-center justify-center min-w-12 h-12 bg-zinc-900 border-r border-zinc-800 text-base text-zinc-100 p-4">
            <Icon icon="MagnifyingGlass" className="h-12 text-zinc-100" />
          </button>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search === null ? '' : search}
            className="w-full bg-zinc-900 outline-none p-4 h-12"
            placeholder="Search emojis..."
          />
        </div>
        <button
          className={`absolute right-0 flex items-center justify-center w-12 h-12 rounded text-base text-zinc-100 p-4 ${search
            ? 'visible opacity-100 translate-x-0'
            : 'invisible opacity-0 translate-x-12 ml-2'
            } transition-all duration-500`}
          onClick={() => setSearch(null)}
        >
          <Icon icon="X" className="h-12 text-zinc-100" />
        </button>
      </footer>
    </section>
  );
},
);
