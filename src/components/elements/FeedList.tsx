import { SentimentBadge } from "@/components/elements/SentimentBadge";
import { formatDate } from "@/lib/utils";


function highlightText(text: string, search: string) {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi"); // case-insensitive match
  const parts = text.split(regex);

  return parts.map((part, idx) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={idx} className="bg-yellow-200 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function FeedList({ feeds, searchedText }: { feeds: any[]; searchedText: string }) {
  if (!feeds?.length) return <p>No feeds found.</p>;

  return (
    <div>
      <ul className="divide-y divide-muted border rounded-md">
        {feeds.map((feed, idx) => (
          <li
            key={idx}
            className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-gray-50"
          >
            {/* Left content */}
            <div className="flex flex-col">
              <p className="text-base sm:text-lg font-sans subpixel-antialiased not-italic">
                {highlightText(feed.feed.title, searchedText)}
              </p>
              <span className="text-sm text-gray-500 font-sans subpixel-antialiased not-italic">
                {formatDate(feed.feed.published)} • {feed.source.name}
              </span>
            </div>

            {/* Right content (sentiment badge) */}
            <div className="sm:ml-6 self-start sm:self-center">
              <SentimentBadge sentiment={feed.feed_sentiment.sentiment_key} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
