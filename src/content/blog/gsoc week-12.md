---
title: "GSoC Week 12: A Deep Dive Into Evaluation, and Publishing Everything"
description: "Investigating why IndIE's BenchIE score looked wrong, closing out the property audit, and publishing all models and datasets."
pubDate: 2026-08-18
tags: []
---

This is the twelfth week of the coding period of GSoC where the main aim was to investigate a real scoring discrepancy down to its root cause, close out the property-type triple audit, and publish everything publicly.

IndIE's BenchIE score looked lower than expected. Investigating this properly turned into one of the most useful pieces of work this summer.

**The real cause:** every source in this project — Wikipedia, Train, and BenchIE — was being scored with the same evaluation script, one that checks for an exact, word-for-word text match between predicted and gold triples. That's the correct approach for Wikipedia and Train, since their gold answers only have one valid phrasing. BenchIE's gold data is different by design — a human annotator deliberately allowed multiple valid ways to phrase the same fact. Using one script built for the first kind of data on the second kind of data was quietly penalizing genuinely correct answers just for being phrased differently.

**The most useful finding came from reading the evaluator's own matching logic directly, rather than trusting its output.** It's a careful word-sequence matcher, not a meaning-based one. This has a real, structural consequence: IndIE, which copies words directly from the source sentence, naturally scores well under this method. The fine-tuned model, which correctly paraphrases facts in its own words, does not get credit for being right, just for being differently worded. Even after both real bugs were fixed, this benchmark specifically has a built-in bias toward extractive systems — a genuine, worthwhile thing to know and report plainly rather than present a single number without its context.

## Closing Out the Property-Type Triple Audit

The audit of all 6,189 property-type triples, started two weeks earlier, was completed this week.

| Category | Count | Share |
|---|---|---|
| Genuine (correctly non-relational) | 3,974 | 64.2% |
| Mislabeled (real relation, wrongly discarded) | 1,837 | 29.7% |
| Errors | 378 | 6.1% |

Nearly a third of triples labeled "property" were actually genuine relational facts that never reached DBpedia matching. A real bug in the audit script itself was found and fixed along the way — the judge model's response was being truncated before it reached its final verdict, and the parsing logic was checking the start of the response rather than the end, together causing an earlier run to silently report 0% mislabeled.

## Publishing Everything Publicly

Both fine-tuned model checkpoints and all six datasets generated over the course of the project were published to Hugging Face — the training set, validation set, the predicate-linking gold set, the BenchIE ground truth, the noisy synthetic set, and the Chain-of-Thought training variant — each with a full description of what it contains and how it was built.

## A Scope Clarification Worth Recording

A question came up about whether the project should also resolve extracted subjects and objects to specific DBpedia entity pages, not just link the relation to a DBpedia property.
We can work on how to improve the current score and also currently we are focused on relation only we can can extend this work to subject and object also.


## Closing Thoughts

This final stretch was less about building something new and more about making sure everything already built was genuinely correct, and genuinely well understood — including its real limitations. Catching and fixing a real evaluation bug, rather than reporting a convenient number, feels like the most valuable work of the summer.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog

---

**Final GSoC Summary:** [GitHub Gist](https://gist.github.com/singhhnitin/6afafd40bc847afc27d8f22d760a0f0e)
**Development branch:** [singhhnitin/neural-extraction-framework — gsoc26h-development](https://github.com/singhhnitin/neural-extraction-framework/tree/gsoc26h-development)
