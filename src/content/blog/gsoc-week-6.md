---
title: "GSoC Week 6: Fixing a Scoring Bias and Getting the Training Pipeline Running"
description: "Finding and fixing a scoring bias that was undervaluing real Wikipedia sentences, then getting the training pipeline running end to end."
pubDate: 2026-07-07
tags: []
---

This is the sixth week (29th June-5th July) of the coding period of GSoC where the main aim was to turn the scraped and annotated Wikipedia sentences into a trustworthy training and validation set, and get the fine-tuning pipeline running end to end.

## Scoring Wikipedia Sentences

Every Wikipedia sentence's extracted triples needed a quality score before being trusted as validation data, using the same LLM-as-judge approach as the original dataset, with sentences scoring 9 or above becoming the validation set.

A real, measurable bias was found this week: sentences with a high proportion of "property"-type relations (descriptive adjective-noun pairs, common in natural encyclopedic text) were being scored unfairly low, even when the extraction itself was correct. Since the vast majority of real Wikipedia sentences fall into this category, the bias was hitting real data especially hard.

**The fix:** two carefully chosen examples were added to the judge's prompt, so it could tell the difference between "naturally descriptive" and "genuinely wrong."

| Metric | Before fix | After fix |
|---|---|---|
| Wikipedia sentences scoring high enough for validation | ~8.5% | 68.8% |

Other fixes made during this pass: raising the judge's output length limit (responses were occasionally cut off mid-answer), making the resume logic safe against duplicate counting, and running the scoring job in parallel chunks for speed. In total, 12,234 unique Wikipedia sentences were scored.

## Resolving Coreference

Wikipedia sentences are pulled as standalone lines, but Hindi frequently uses pronouns that refer back to something named in a previous, unavailable sentence, which can make a triple's subject genuinely ambiguous.

Every flagged sentence was handled with a three-way classification:

| Category | Handling |
|---|---|
| Resolved | Real referent found, sentence rewritten, re-extracted |
| Self-contained | Demonstrative pronoun + noun kept as valid subject |
| Genuinely ambiguous | Excluded from validation set entirely |

This careful handling meant genuinely recoverable examples were kept rather than lost, landing at 1,817 final validation candidates.

## Assembling the Final Dataset

Everything came together this week into the two files actually used for training, following a consistent `subject | relation | object` format, with two relation types (core and property) and two trace types (a short "optimal" version and a longer chain-of-thought version).

A real schema bug was found and fixed here — the combined training file mixed entries from different sources that didn't all share the same fields, which crashed the data-loading library partway through. This was fixed by normalizing every entry to a consistent schema before combining.

| Dataset | Size | Invalid entries |
|---|---|---|
| Training traces | 79,242 | 0 |
| Validation traces | 3,634 | 0 |

## Training Configuration and the Smoke Test

Training settings are managed through Hydra configuration files, with every run logged to Weights & Biases. Gemma 3 4B is fine-tuned via 4-bit QLoRA, comparing two learning rates directly, with evaluation every quarter-epoch.

Before committing to a multi-day full run, a small smoke test (50 examples, 1 epoch) confirmed the pipeline works end to end. A few real issues came up and were fixed along the way: the original environment was too old for the required library versions (fixed by building a fresh Python 3.10 environment), the same schema mismatch from dataset assembly needed handling here too, and the most significant one — a crash in the evaluation code tracing back to a known bug in the underlying library's generation function. The fix was writing a manual, step-by-step generation loop with proper caching, which also made progress visible instead of appearing to hang.

Real output from the smoke test, on a sentence about tweeters being found in home stereo systems: after only 50 training examples, the model already captured the general shape of the task correctly, with loss dropping steadily and token accuracy rising across all four test steps, no crashes.

## Dataset Statistics and a Timing Estimate

| Metric | Value |
|---|---|
| Average token length | 327 |
| Maximum token length | 1,087 |
| Examples exceeding context window | 7 / 79,242 (0.01%) |
| Estimated time per epoch | 2.5–3 days |
| Estimated time per full learning-rate run | 8–9.5 days |
| Estimated time for both planned runs | 16–19 days |

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
