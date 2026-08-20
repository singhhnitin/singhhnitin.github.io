---
title: "Week-7 Streamlining the Training Pipeline"
description: "Seventh week of the coding period, streamlining the training pipeline and reviewing real model output closely."
pubDate: 2026-07-14
tags: []
---

This is the seventh week of the coding period of GSoC where the main aim was to make the training pipeline faster and more efficient, and take a close, line-by-line look at what the model was actually producing on real sentences.

## Streamlining the Dataset and Training Pipeline

The training data was filtered down to "optimal"-trace examples only, removing the longer chain-of-thought traces that weren't the intended format for this stage.

| Change | Result |
|---|---|
| Filtered training set | 39,621 examples |
| Block size | Reduced from 1024 to 512 tokens |

Checking token length directly confirmed all examples comfortably fit under the smaller context window, so the reduction was a real efficiency gain with no downside.

The expensive generation-based evaluation running every quarter-epoch was removed, replaced with a single baseline evaluation at step zero. Automatic checkpoint-resume logic was also added, so an interrupted run can pick back up instead of restarting from scratch.

## A Close Look at Real Model Output

To understand what the fine-tuned model (lr=2e-4 checkpoint) was actually doing, I ran it on 150 real sentences — 50 each from Wikipedia validation data, the BenchIE benchmark, and the training data — and went through predictions against the correct answer line by line, not just as an aggregate score.

A clear pattern showed up: most "failures" under strict exact-match scoring were reasonable structural differences, not actual errors. A few real examples:

- One sentence about soldiers achieving success through regular military practice: both core relations correctly identified, only a minor difference in where a phrase boundary was drawn.
- One sentence about chlorine being found in soil: the model's main line was a perfect exact match to gold; the only difference was one additional, reasonable property-relation line.
- One sentence naming three actors: gold split the names into three separate lines, the model combined them into one — arguably an equally valid way to represent the same fact.

A smaller number of cases showed real content differences worth tracking honestly: a couple of examples had the model output "NONE" for an object where gold had a real answer, and a few showed subject and object roles genuinely reversed rather than just restructured.

**Overall, across all 15 closely-examined examples, every one had valid, correctly-formatted output**, and while all of them technically failed strict exact-match scoring, most of those failures were structural choices rather than actual errors. This distinction is part of why later evaluation work moved toward LLM-as-judge scoring, which can tell formatting differences apart from genuine content errors.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
