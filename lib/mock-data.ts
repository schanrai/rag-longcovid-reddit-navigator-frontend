import type { QueryResponse, ClarificationResponse, ErrorResponse } from "./types"

export const MOCK_EMPTY: QueryResponse = {
  original_query: "rare long covid symptoms in teenagers with red eyes",
  rewritten_query: "Long COVID symptoms affecting teenagers with eye redness",
  answer_markdown: "",
  sources: [],
  metadata: {
    total_sources: 0,
    processing_time_ms: 1800,
  },
}

export const MOCK_ANSWER: QueryResponse = {
  original_query: "what helps with brain fog",
  rewritten_query: "What strategies help reduce brain fog in Long COVID?",
  answer_markdown: `Many Long COVID patients report that **pacing and cognitive rest** are among the most effective strategies for managing brain fog [1]. Pushing through mental fatigue often triggers post-exertional malaise (PEM), making symptoms significantly worse [2].

## Lifestyle strategies

- **Structured rest breaks**: Short 10–20 minute rest periods before hitting cognitive limits, rather than after [1][3]
- **Sleep hygiene**: Consistent sleep schedules and avoiding screens before bed helped multiple community members reduce morning fog [3]
- **Low-histamine diet**: A subset of patients report improvement after reducing high-histamine foods, suggesting a mast cell activation component [4]

## Supplements reported anecdotally

Several community members report benefit from **low-dose naltrexone (LDN)** [2], **vitamin D and B12 repletion** [4], and **antihistamines** (cetirizine or famotidine) [5]. These are not medically endorsed but are frequently discussed in the community.

## Medical interventions

Some patients found improvement through LC clinics offering neurological assessment [6]. Cognitive rehabilitation therapy has helped others structure their recovery [3].

> **Please note:** This information is drawn from community discussions and does not constitute medical advice. Always consult a qualified healthcare provider before making changes to your treatment.`,
  sources: [
    {
      citation_number: 1,
      reddit_url: "https://www.reddit.com/r/covidlonghaulers/comments/abc123",
      subreddit: "r/covidlonghaulers",
      post_title: "Finally found what helps my brain fog - pacing protocol",
      chunk_text: "After 18 months of debilitating brain fog I finally found something that helps. The key was pacing — not just physical but cognitive pacing. I set a timer every 20 minutes and take a short rest even when I feel okay. This has reduced my crashes by about 70%.",
      chunk_type: "post",
      score: 847,
      date: "2024-03-12",
      summary: "User reports significant improvement in brain fog using a structured cognitive pacing protocol with timed rest breaks.",
    },
    {
      citation_number: 2,
      reddit_url: "https://www.reddit.com/r/LongCovid/comments/def456",
      subreddit: "r/LongCovid",
      post_title: "LDN update — 3 months in",
      chunk_text: "Three months on low-dose naltrexone at 4.5mg. Brain fog went from an 8/10 to about a 4/10. I can actually read books again. Still not back to baseline but this has been the single biggest thing that helped me.",
      chunk_type: "post",
      score: 612,
      date: "2024-01-28",
      summary: "Patient reports notable improvement in brain fog severity after three months on low-dose naltrexone.",
    },
    {
      citation_number: 3,
      reddit_url: "https://www.reddit.com/r/covidlonghaulers/comments/ghi789",
      subreddit: "r/covidlonghaulers",
      post_title: "Sleep hygiene helped more than I expected",
      chunk_text: "I was skeptical but fixing my sleep made a huge difference to the brain fog. Blackout curtains, consistent wake time, no screens after 9pm. It took about 3 weeks to notice a difference but morning fog reduced a lot.",
      chunk_type: "comment",
      score: 423,
      date: "2024-02-05",
      summary: "Commenter describes meaningful brain fog reduction following strict sleep hygiene improvements over three weeks.",
    },
    {
      citation_number: 4,
      reddit_url: "https://www.reddit.com/r/covidlonghaulers/comments/jkl012",
      subreddit: "r/covidlonghaulers",
      post_title: "MCAS protocol — low histamine diet results",
      chunk_text: "After reading about MCAS I tried a low histamine diet for 6 weeks. Brain fog is noticeably better and I'm less inflamed generally. Also started vitamin D (I was deficient) and B12.",
      chunk_type: "post",
      score: 389,
      date: "2023-11-14",
      summary: "User reports cognitive improvement after adopting a low-histamine diet and correcting vitamin D and B12 deficiencies.",
    },
    {
      citation_number: 5,
      reddit_url: "https://www.reddit.com/r/LongCovid/comments/mno345",
      subreddit: "r/LongCovid",
      post_title: "Antihistamines — cetirizine and famotidine combo",
      chunk_text: "The H1/H2 blocker combo (cetirizine + famotidine) cleared my brain fog within about 3 days. Completely by accident — I took it for allergies. Many of us seem to have a histamine/MCAS element.",
      chunk_type: "comment",
      score: 567,
      date: "2024-04-02",
      summary: "User accidentally discovered significant brain fog relief from combined H1/H2 antihistamine therapy.",
    },
    {
      citation_number: 6,
      reddit_url: "https://www.reddit.com/r/covidlonghaulers/comments/pqr678",
      subreddit: "r/covidlonghaulers",
      post_title: "LC clinic neurological assessment — worth it",
      chunk_text: "Finally got into the LC clinic. They did a full neurological workup and referred me to cognitive rehab. It's slow progress but having a structured plan from actual clinicians has been reassuring and measurably helpful.",
      chunk_type: "post",
      score: 298,
      date: "2024-05-18",
      summary: "Patient describes positive experience at a Long COVID clinic including referral to cognitive rehabilitation therapy.",
    },
  ],
  metadata: {
    total_sources: 6,
    processing_time_ms: 3240,
  },
}

export const MOCK_CLARIFICATION: ClarificationResponse = {
  mode: "clarification",
  intent: "The query could refer to fatigue, PEM, or general energy management",
  rewrites: [
    "What helps with post-exertional malaise (PEM) crashes in Long COVID?",
    "How do Long COVID patients manage chronic fatigue and low energy?",
    "What are effective pacing strategies for Long COVID fatigue?",
    "What supplements or medications help with Long COVID fatigue?",
  ],
  original_query: "how do i deal with the fatigue",
}

export const POPULAR_QUERIES = [
  "What helps with brain fog?",
  "How do others manage PEM crashes?",
  "Best supplements for Long COVID recovery",
  "What is low-dose naltrexone and does it help?",
  "Sleep problems and Long COVID",
  "When does Long COVID get better?",
]
