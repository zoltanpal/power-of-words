import { SentimentBadge } from "@/components/elements/SentimentBadge";
import { formatDate } from "@/lib/utils";

//export function FeedList({ feeds, freeText }: { feeds: any[], freeText: string }) {
export function FeedList({ feeds }: { feeds: any[], freeText: string }) {
    if (!feeds?.length) return <p>No feeds found.</p>


    return (
      <div>
        <ul className="divide-y divide-muted border rounded-md">
          {feeds.map((feed, idx) => (
            <li key={idx} className="p-4 flex flex-col sm:flex-row justify-between hover:bg-gray-50 sm:items-center gap-2">
              <div>
                <p className="text-xl font-sans subpixel-antialiased not-italic">
                  {feed.feed.title}
                </p>
                <span className="font-mono text-gray-500 font-sans font-sans subpixel-antialiased not-italic">{formatDate(feed.feed.published)} • {feed.source.name}</span>
              </div>
              <div className="mx-6">
                <SentimentBadge sentiment={feed.feed_sentiments.sentiment_key} />
                </div>
            </li>
          ))}
        </ul>
      </div>

    )
  }
  