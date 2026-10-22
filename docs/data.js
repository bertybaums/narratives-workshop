/* Settings and data for the narratives workshop deck.
   Change the invite code and links here; every slide that shows them updates. */

window.WORKSHOP = {
  // Confirmed October 21, 2026. Created on Narrate with:
  //   flask --app server narrate invite --code AISYMP2026 --expires 2026-11-30 --label "AI Symposium 2026"
  code: "AISYMP2026",
  codeUntil: "November 30, 2026",
  codeValid: "Valid through November 30, 2026",
  narcUrl: "https://narc.insight.uidaho.edu",
  narrateUrl: "https://narc.insight.uidaho.edu/narrate",
  deckUrl: "https://bertybaums.github.io/narratives-workshop/",
  companionUrl: "https://bertybaums.github.io/narratives-workshop/companion.html",
  mindrouterUrl: "https://mindrouter.uidaho.edu",
  email: "bbaum@uidaho.edu",
  narrateModel: "qwen3.8-27b"
};

// The ARC/NARC palette, matching narc.insight.uidaho.edu
window.NARC_PALETTE = {
  0: "#000000", 1: "#0074D9", 2: "#FF4136", 3: "#2ECC40", 4: "#FFDC00",
  5: "#AAAAAA", 6: "#F012BE", 7: "#FF851B", 8: "#7FDBFF", 9: "#870C25"
};

window.NARC_COLOR_NAMES = {
  0: "black", 1: "blue", 2: "red", 3: "green", 4: "yellow",
  5: "gray", 6: "magenta", 7: "orange", 8: "light blue", 9: "maroon"
};

window.NARC_MODELS = {
  "claude-fable-5-1": { maker: "Anthropic, commercial, off campus", closed: true },
  "gemma-4-26b": { maker: "Google, open weights" },
  "gemma-4-31b": { maker: "Google, open weights" },
  "glm-5.3-flash": { maker: "Z.ai, open weights", withdrawn: true },
  "gpt-oss-120b": { maker: "OpenAI, open weights" },
  "gpt-oss-20b": { maker: "OpenAI, open weights" },
  "kimi-k3": { maker: "Moonshot AI, open weights" },
  "mimo-v2.6-flash": { maker: "Xiaomi, open weights", withdrawn: true },
  "nemotron-3-super": { maker: "NVIDIA, open weights" },
  "qwen3.5-122b": { maker: "Alibaba (Qwen), open weights" },
  "qwen3.6-27b": { maker: "Alibaba (Qwen), open weights" },
  "qwen3.8-27b": { maker: "Alibaba (Qwen), open weights" }
};

/* Results copied from the public Inspect page, narc.insight.uidaho.edu/inspect, on October 21, 2026.
   Row: [model, grids only, story only, grids + story, shuffled orders solved (of 3), key-word lists solved (of 3)]
   1 = solved, 0 = not solved. Shuffle and key-word tests run only where grids + story solved it;
   null = not run, "untested" = not yet run. */
var CAPTION = "Live results from narc.insight.uidaho.edu, October 21, 2026. One try per model per condition. " +
  "The shuffled and key-word tests run three times each, only for models that solved it with grids + story.";

window.NARC_RESULTS = {
  chat: {
    caption: CAPTION,
    rows: [
      ["gemma-4-26b", 0, 0, 0, null, null],
      ["gemma-4-31b", 0, 0, 0, null, null],
      ["glm-5.3-flash", 0, 0, 1, 0, 1],
      ["gpt-oss-120b", 0, 0, 1, 0, 1],
      ["gpt-oss-20b", 0, 0, 0, null, null],
      ["kimi-k3", 0, 0, 1, 0, 0],
      ["mimo-v2.6-flash", 0, 0, 0, null, null],
      ["nemotron-3-super", 0, 0, 0, null, null],
      ["qwen3.5-122b", 0, 0, 1, 0, 0],
      ["qwen3.6-27b", 0, 0, 0, null, null],
      ["qwen3.8-27b", 0, 0, 1, 0, 1]
    ]
  },
  hunt: {
    caption: CAPTION,
    rows: [
      ["claude-fable-5-1", 0, 0, 1, "untested", "untested"],
      ["gemma-4-26b", 0, 0, 0, null, null],
      ["gemma-4-31b", 0, 0, 1, 1, 0],
      ["glm-5.3-flash", 0, 0, 0, null, null],
      ["gpt-oss-120b", 0, 0, 1, 1, 0],
      ["gpt-oss-20b", 0, 0, 1, 0, 0],
      ["kimi-k3", 0, 0, 1, 1, 0],
      ["mimo-v2.6-flash", 0, 0, 0, null, null],
      ["nemotron-3-super", 0, 0, 1, 0, 0],
      ["qwen3.5-122b", 0, 0, 0, null, null],
      ["qwen3.6-27b", 0, 0, 1, 0, 0],
      ["qwen3.8-27b", 0, 0, 1, 0, 0]
    ]
  },
  accident: {
    caption: CAPTION,
    rows: [
      ["claude-fable-5-1", 0, 0, 1, "untested", "untested"],
      ["gemma-4-26b", 0, 0, 1, 0, 0],
      ["gemma-4-31b", 0, 0, 0, null, null],
      ["glm-5.3-flash", 0, 0, 0, null, null],
      ["gpt-oss-120b", 0, 0, 1, 0, 0],
      ["gpt-oss-20b", 0, 0, 0, null, null],
      ["kimi-k3", 0, 0, 1, 0, 0],
      ["mimo-v2.6-flash", 0, 0, 0, null, null],
      ["nemotron-3-super", 0, 0, 0, null, null],
      ["qwen3.5-122b", 0, 0, 0, null, null],
      ["qwen3.6-27b", 0, 0, 0, null, null],
      ["qwen3.8-27b", 0, 0, 0, null, null]
    ]
  },
  ballerina: {
    caption: CAPTION,
    rows: [
      ["claude-fable-5-1", 0, 0, 1, "untested", "untested"],
      ["gemma-4-26b", 0, 0, 0, null, null],
      ["gemma-4-31b", 0, 0, 1, 1, 0],
      ["glm-5.3-flash", 0, 0, 0, null, null],
      ["gpt-oss-120b", 0, 0, 1, 1, 0],
      ["gpt-oss-20b", 0, 0, 0, null, null],
      ["kimi-k3", 0, 0, 1, 2, 0],
      ["mimo-v2.6-flash", 0, 0, 0, null, null],
      ["nemotron-3-super", 0, 0, 1, 1, 0],
      ["qwen3.5-122b", 0, 0, 1, 1, 0],
      ["qwen3.6-27b", 0, 0, 1, 0, 0],
      ["qwen3.8-27b", 0, 0, 1, 3, 0]
    ]
  }
};
