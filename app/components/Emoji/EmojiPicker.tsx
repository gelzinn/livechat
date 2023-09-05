'use client';

import { useEffect, useState } from "react";
import Icon from "../Icon";

interface EmojiPickerProps {
  onEmojiSelect?: (emoji: any) => void;
  onClose?: () => void;
  className?: string;
  removeDefaultStyles?: boolean;
}

async function getEmojis() {
  const emojiApiKey = process.env.NEXT_PUBLIC_EMOJI_API_KEY || '';
  const basePath = `https://emoji-api.com/emojis?access_key=${emojiApiKey}`;

  const res = await fetch(basePath);

  if (!res.ok) throw new Error('Failed to fetch data');

  return res.json();
}

export const EmojiPicker = ({
  onEmojiSelect,
  onClose,
  className,
  removeDefaultStyles = false,
}: EmojiPickerProps) => {
  const [emojis, setEmojis] = useState([]);
  const [emojisByGroup, setEmojisByGroup] = useState<any>([]);
  const [selectedEmojiSection, setSelectedEmojiSection] = useState<string | null>(null);

  const [search, setSearch] = useState<string | null>(null);

  const defaultStylesClass = removeDefaultStyles
    ? ''
    : 'flex flex-col w-full max-w-xl h-fit gap-4 bg-zinc-950 rounded p-4';

  const handleEmojiClick = (emoji: any) => {
    if (onEmojiSelect) onEmojiSelect(emoji);
  };

  useEffect(() => {
    async function fetchData() {
      const emojiData = await getEmojis();

      if (emojiData) setEmojis(emojiData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!emojis || emojis && !(emojis.length > 0)) return;

    const grouped = emojis.reduce((groupedEmojis: any, emoji) => {
      const { group } = emoji;
      if (!groupedEmojis[group]) {
        groupedEmojis[group] = [];
      }
      groupedEmojis[group].push(emoji);
      return groupedEmojis;
    }, {});

    setEmojisByGroup(grouped);
    setSelectedEmojiSection(Object.keys(grouped)[0]);
  }, [emojis]);

  return (
    <div className={`${defaultStylesClass}${className}`}>
      <header className="flex items-center justify-between gap-2">
        <div
          className="flex items-center justify-between w-full bg-zinc-900 border border-zinc-800 rounded min-w-12 min-h-[48px] h-12 overflow-hidden"
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
        {onClose && (
          <button
            className="flex items-center justify-center min-w-12 h-12 bg-zinc-900 border border-zinc-800 rounded text-base text-zinc-100 p-4"
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            <Icon icon="X" className="h-12 text-zinc-100" />
          </button>
        )}
      </header>
      {emojis && emojis.length > 0 ? (
        <>
          <span className="text-zinc-500">
            Categories
          </span>
          <label className="flex flex-shrink-0 gap-1 w-full h-14 overflow-x-auto overflow-y-hidden">
            {Object.keys(emojisByGroup).map((group) => {
              return (
                <button
                  className={`w-14 h-14 flex-shrink-0 sm:flex-shrink text-xl font-semibold rounded p-2 ${selectedEmojiSection === group ? 'bg-zinc-800' : 'bg-zinc-900'}`}
                  key={group}
                  onClick={() => setSelectedEmojiSection(group)}
                >
                  {emojisByGroup[group][0].character}
                </button>
              )
            })}
          </label>
          <span className="text-zinc-500">
            Emojis
          </span>
          {selectedEmojiSection && (
            <ul
              className="flex flex-wrap gap-1 w-full h-80 max-h-80 overflow-y-scroll overflow-x-hidden shadow-inner rounded"
            >
              {emojisByGroup[selectedEmojiSection].map((emoji: any) => {
                return (
                  <button
                    key={emoji.slug}
                    className="text-center text-xl w-14 h-14 rounded p-2 select-none bg-zinc-900 hover:bg-zinc-800"
                    title={emoji.unicodeName}
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji.character}
                  </button>
                )
              })}
            </ul>
          )}
        </>
      ) : (
        <span className="text-zinc-500">
          Loading...
        </span>
      )}
    </div>
  );
}
