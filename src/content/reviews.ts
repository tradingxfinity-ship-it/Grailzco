/**
 * Real buyer reviews from https://www.whatnot.com/user/grailzco/reviews,
 * copied as written (long ones trimmed with "…"). Update `total` when the Whatnot count changes.
 */
export const whatnotReviews = {
  url: "https://www.whatnot.com/user/grailzco/reviews",
  total: 2213,
  items: [
    {
      user: "jay_katchem",
      date: "11/10/2026",
      text: "it truly cannot be put into words how amazing these guys are. the cards are excellent, the packaging always safe and secure, and J the host - one of a kind. thank you J & thank you grailzco for all that you do",
    },
    {
      user: "tolgrant14028",
      date: "11/13/2026",
      text: "The packaging was great! My card was penny sleeved and top loaded but also protected by two free ascended heroes packs!",
    },
    {
      user: "troycommabarnes",
      date: "11/12/2026",
      text: "Great conditions as shown prior to purchase. Very well packaged and arrived in great time. Not my first purchase and certainly not my last.",
    },
    {
      user: "h0l0haven",
      date: "10/3/2026",
      text: "These guys always have great cards, in great condition, and fast shipping! I'm a Frequent flyer! The packaging is always phenomenal as well! …",
    },
    {
      user: "whoismushi",
      date: "11/14/2026",
      text: "Great price and great experience! They even gave me two ascended hero packs with my order! Thank you, yall are the best!!! …",
    },
    {
      user: "tdstorm",
      date: "11/13/2026",
      text: "Another grail card from the best streamers on the app - thank you 🙏",
    },
    {
      user: "alimp1",
      date: "11/11/2026",
      text: "card looked way better in person, well packaged and showed up quick.",
    },
    {
      user: "_pikadrew_",
      date: "10/4/2026",
      text: "… I've been looking for that jolteon for a while and I'm so happy to have it in the PC! Shouts out to the packing team as well, everything came in perfect condition …",
    },
    {
      user: "sakuras_nerd_haven",
      date: "11/13/2026",
      text: "Super fast and amazing quality and care! Will buy again!",
    },
    {
      user: "kingkyle79",
      date: "10/29/2026",
      text: "AMAZING 10/10, thank you for the extra love brother greatly appreciate it!!! … NOT expected but GREATLY appreciated! I will definitely be back brother",
    },
    {
      user: "cml29",
      date: "11/15/2026",
      text: "Love joining the stream and there are always cards for everyone. A great place to hang out, definitely recommend checking it and grabbing some cards. Givvies are fire too 🔥",
    },
    {
      user: "timescramble",
      date: "11/5/2026",
      text: "Beautiful cards. Condition was better than expected. So eeeezzzaayyy",
    },
    {
      user: "emoney0014",
      date: "11/10/2026",
      text: "Nobody is better than this seller. This dude is the man the GOAT",
    },
    {
      user: "user_93396",
      date: "11/13/2026",
      text: "Arrived very quickly and I am very impressed with the condition of the card!",
    },
    {
      user: "goliath331",
      date: "10/5/2026",
      text: "The cards look amazing! Thank you so much for helping increase my Snorlax collection.",
    },
    {
      user: "57star",
      date: "10/31/2026",
      text: "I was expecting generic EX cards … but I actually received 3 art rares thats awesome i really appreciate it greatly …",
    },
    {
      user: "troycommabarnes",
      date: "10/26/2026",
      text: "Phenomenally packaged, card arrived in great condition and as shown. Highly recommend to all",
    },
    {
      user: "ryanstcgsellz5432",
      date: "11/10/2026",
      text: "Fair shipping and everything was well protected thanks for the great cards",
    },
    {
      user: "wokstar99",
      date: "10/5/2026",
      text: "Love your stream. Excellent selection and great description of all the cards I received.",
    },
    {
      user: "tdstorm",
      date: "11/2/2026",
      text: "Favorite streamer on the app - as always thank you!",
    },
  ],
} as const;

export type WhatnotReview = (typeof whatnotReviews.items)[number];
