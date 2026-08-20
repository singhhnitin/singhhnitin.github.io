---
title: "Week-3 Dataset Audit and Ontology Alignment"
description: "Third week of the coding period, auditing the existing training dataset and building the ontology alignment layer."
pubDate: 2026-06-16
tags: []
---

# Week-3 Dataset Audit and Ontology Alignment

This is the third week (8-14th June) of the coding period of GSoC where the main aim was to go through the existing training dataset in detail, build the ontology alignment layer, and test existing models to check whether fine-tuning is genuinely needed for this task.

## Dataset Content Analysis

The existing dataset has 20,000 examples in chat format, each with a Hindi sentence, a reasoning trace, and the extracted triples with a quality score. I went through this dataset in detail this week.

The average score across all examples was 7.30 out of 10. Filtering to score 9 and above gives 8,633 examples, which became the working high-quality set. Reading through examples at every score level showed a clear pattern — higher scores had genuinely correct spans and grammar, lower scores had real issues like subject-object reversal or missing negation.

One important finding from this pass:

| Relation type | Count | Share |
|---|---|---|
| Property (descriptive) | 139,340 | 78.8% |
| Real verb relation | 37,477 | 21.2% |

Out of 176,817 total triplets, close to four in five use a generic "property" relation rather than a real verb relation. This mattered directly for planning the fine-tuning approach in the weeks ahead.

## Ontology Alignment Layer

I built a layer to map extracted Hindi relations to real DBpedia ontology properties, using a curated set of 73 properties with combined Hindi and English descriptions.

| Check | Result |
|---|---|
| Manual precision check (30 samples) | 30/30 correct (100%) |
| Auto-alignment at full scale | 5,109 / 37,496 verb triplets (13.6%) |

The 13.6% auto-alignment rate reflects that most raw Hindi predicates are genuinely complex and do not map cleanly to a fixed property list without further work — the remaining triplets were queued for human review.

## Testing Existing Models

To check whether fine-tuning a new model was actually necessary, I tested two existing models directly on the extraction task, zero-shot.

| Model | Result |
|---|---|
| IndicBART | Produced garbled output; no real task understanding |
| mREBEL | 0 / 3,282 test examples produced any output |

Neither model handled Hindi triple extraction reliably out of the box, which supports the fine-tuning approach planned for this project.

## Annotation Interface Research

I also compared four annotation tools — Argilla, INCEpTION, Doccano, and a custom Streamlit build — specifically checking each one's support for DBpedia ontology suggestions during review. Streamlit was chosen going forward, since it allows building the exact review flow needed (sentence, extracted triple, ranked DBpedia property suggestions) without working around another tool's built-in assumptions.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
