---
title: "GSoC Week 11: Establishing Real Baselines and Testing Beyond Hindi"
description: "Establishing real baselines against IndIE and testing the pipeline on Gujarati and Rajasthani."
pubDate: 2026-08-11
tags: []
---

This is the eleventh week of the coding period of GSoC where the main aim was to close out two items flagged the week before — splitting every result into extraction-only and full-pipeline figures, and establishing genuine baselines to measure the fine-tuned model against — and test how the pipeline behaves on languages it was never trained on.

## Extraction-Only vs. Full-Pipeline, Completed

Every result now reports two separate numbers.

| Source | Extraction-only F1 | Full-pipeline F1 |
|---|---|---|
| Wikipedia | 0.554 | 0.493 |
| Train | 0.610 | 0.537 |
| BenchIE | 0.056 | 0.173 |

BenchIE shows a genuinely interesting, opposite pattern — its full-pipeline score is higher than its extraction-only score. The model consistently trims small Hindi grammatical particles (postpositions like का/की/में) that BenchIE's gold spans retain, causing exact-text matching to fail even when the underlying fact is completely correct. Once predicate linking maps both sides to the same DBpedia property, this difference disappears.

## Real Baselines, on the Same Evaluation Set

Two real reference points were established — IndIE, an existing rule-based Hindi extraction tool, and the same base Gemma 3 4B model completely untrained.

| System | Wikipedia (ext/full) | Train (ext/full) | BenchIE (ext/full) |
|---|---|---|---|
| Fine-tuned Gemma 3 4B | 0.554 / 0.493 | 0.610 / 0.537 | 0.056 / 0.173 |
| Base Gemma 3 4B (untrained) | 0.024 / 0.150 | 0.014 / 0.057 | 0.016 / 0.067 |
| IndIE (rule-based) | 0.021 / 0.126 | 0.010 / 0.048 | 0.076 / 0.151 |

Fine-tuning improved Wikipedia F1 by roughly 23x and Train F1 by roughly 44x over the untrained model.

## Testing the Pipeline Beyond Hindi

The extraction model was run on 50 real Gujarati sentences and 50 Rajasthani sentences — languages it has never seen in training.

| Language | Produced output | Crashed |
|---|---|---|
| Gujarati (n=50) | 50 / 50 | 0 |
| Rajasthani (n=50) | 50 / 50 | 0 |

All 100 sentences produced output with zero crashes. The model reliably identifies the correct type of relation even in an unfamiliar language, while subject and object spans often mix scripts and Hindi grammatical patterns get substituted onto non-Hindi structure — the model generalizes the underlying task well beyond what it generalizes the language.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
