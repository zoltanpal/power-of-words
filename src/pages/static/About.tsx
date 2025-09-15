export default function About() {
    return (
        <div className="w-full lg:w-3/4 px-2">
            <p className="mt-3 text-xl text-justify">
            Welcome to <b>Power of Word</b>, where we unravel the impact of language 
            through cutting-edge sentiment analysis. Our platform provides 
            a unique window into the emotional weight carried by words and sentences in Hungarian news. 
            Discover how the nuances of language can influence perceptions, emotions, and decisions.

            </p>

            <h3 className="text-2xl font-semibold tracking-tight mt-10">
                How It Works
            </h3>
            <p className="text-l my-1 text-justify">
                My platform continuously reads and processes news articles from a wide array 
                of Hungarian RSS feeds. Utilizing sophisticated natural language processing (NLP) algorithms, 
                analyzing the text to determine its sentiment, categorizing it as positive, 
                negative, or neutral. My analysis delves deep into the words and phrases used, 
                highlighting how specific language choices can shape the tone and influence the reader.
            </p>

            <h3 className="text-2xl font-semibold tracking-tight mt-10">
                Key Features
            </h3>
            <ul className="my-3 ml-6 text-l list-disc [&>li]:mt-1 text-justify">
                <li><b>Real-Time Sentiment Analysis:</b> Get up-to-the-minute sentiment evaluations of the latest news articles.</li>
                <li><b>Comprehensive Sentiment Categories:</b> Understand the emotional tone of articles with clear positive, negative, and neutral classifications.</li>
                <li><b>Influence Insights:</b> Discover how specific words and phrases can impact reader perception and sentiment.</li>
                <li><b>Intuitive Visualizations:</b> Explore sentiment trends and patterns through interactive charts and graphs, making it easy to interpret complex data at a glance.</li>
                <li><b>Extensive News Coverage:</b> Stay updated with a broad range of Hungarian news sources, ensuring you don't miss any critical updates.</li>
            </ul>
            <br />
            <i><b>Please note:</b> Website interface is in English, but the analyzed headlines are Hungarian.</i>
        </div>
    )
        
  }