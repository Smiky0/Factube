import "dotenv/config";

interface SearchResult {
    title: string;
    link: string;
    snippet: string;
}

export async function webSearch(query: string): Promise<SearchResult[]> {
    try {
        // Using DuckDuckGo which doesn't require an API key
        const response = await fetch(
            `https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            },
        );

        if (!response.ok) {
            console.warn(
                `Web search failed for "${query}": ${response.status}`,
            );
            return [];
        }

        const data = (await response.json()) as {
            RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
            AbstractText?: string;
            AbstractURL?: string;
        };

        const results: SearchResult[] = [];

        // Add abstract result if available
        if (data.AbstractText && data.AbstractURL) {
            results.push({
                title: "Direct Answer",
                link: data.AbstractURL,
                snippet: data.AbstractText,
            });
        }

        // Add related topics
        if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
            data.RelatedTopics.slice(0, 3).forEach((topic) => {
                if (topic.Text && topic.FirstURL) {
                    results.push({
                        title: topic.Text.split("<")[0].trim(),
                        link: topic.FirstURL,
                        snippet: topic.Text.split("<")[0].trim(),
                    });
                }
            });
        }

        return results.slice(0, 5);
    } catch (error) {
        console.error(`Web search error for "${query}":`, error);
        return [];
    }
}

export async function searchForClaim(claim: string): Promise<string> {
    const results = await webSearch(claim);
    if (results.length === 0) {
        return "No search results found.";
    }

    return (
        "Recent web search results:\n" +
        results
            .map(
                (r, i) =>
                    `${i + 1}. "${r.title}"\n   URL: ${r.link}\n   Summary: ${r.snippet}`,
            )
            .join("\n\n")
    );
}
