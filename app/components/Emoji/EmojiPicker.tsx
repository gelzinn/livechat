'use client';

import { useEffect, useState } from "react";
import Icon from "../Icon";

export const EmojiPicker = () => {
  const emojiApiKey = process.env.NEXT_PUBLIC_EMOJI_API_KEY || '';
  const basePath = `https://emoji-api.com/emojis?access_key=${emojiApiKey}`;

  const [emojis, setEmojis] = useState([]);
  const [emojisByGroup, setEmojisByGroup] = useState<any>([]);
  const [selectedEmojiSection, setSelectedEmojiSection] = useState<string | null>(null);

  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    const getEmojis = async () => {
      const response = await fetch(basePath);
      const data = await response.json();

      setEmojis(data);
    }

    getEmojis();
  }, []);

  useEffect(() => {
    if (!emojis) return;

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
    <section className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="flex flex-col w-full max-w-xl h-fit m-auto gap-4 bg-zinc-950 rounded p-4">
        <div className="flex items-center justify-between bg-zinc-900 rounded p-4 gap-4">
          <Icon icon="MagnifyingGlass" className="w-5 h-5" />
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search === null ? '' : search}
            className="w-full bg-zinc-900 outline-none"
            placeholder="Search..."
          />
        </div>
        <span className="text-zinc-500">
          Categories
        </span>
        <label className="flex gap-1 w-full overflow-x-auto">
          {Object.keys(emojisByGroup).map((group) => {
            return (
              <button
                className={`w-full text-xl font-semibold rounded p-2 ${selectedEmojiSection === group ? 'bg-zinc-800' : 'bg-zinc-900'}`}
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
          <ul className="grid grid-cols-8 gap-1 w-full h-full max-h-80 overflow-y-scroll overflow-x-hidden shadow-inner rounded">
            {emojisByGroup[selectedEmojiSection].map((emoji: any) => (
              <button
                key={emoji.slug}
                className="text-center text-xl w-full bg-zinc-900 rounded p-2 select-none"
              >
                {emoji.character}
              </button>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
