---
title: "GSoC Week 8: Building a Predicate-Linking Gold Set"
description: "Eighth week of the coding period, building a predicate-linking gold set and running the full pipeline end to end for the first time."
pubDate: 2026-07-21
tags: []
---

This is the eighth week of the coding period of GSoC where the main aim was to build a gold set for predicate-to-DBpedia-property linking, fine-tune the normalization model on it, and run the complete pipeline end to end for the first time.

## Building the Predicate-Linking Gold Set

When the extraction model produces a triple, its relation comes out as raw Hindi text and needs to be mapped to a formal DBpedia property. Built in three stages: every unique predicate was extracted from the training and validation sentences (8,034 total), an embedding model retrieved the 50 most relevant candidate DBpedia properties for each, and an LLM picked the correct one or NONE if nothing fit.

| Result | Count | Share |
|---|---|---|
| Mapped to a real DBpedia property | 5,855 | 72.9% |
| Correctly identified as NONE | 2,174 | 27.1% |

## A Fair, Unbiased Model Comparison

Since the gold set itself was built using a different, larger model than either candidate being evaluated, this comparison was genuinely unbiased.

| Model | Precision@1 | Precision@5 | Precision@10 |
|---|---|---|---|
| Candidate A | 0.240 | 0.432 | 0.523 |
| Candidate B | 0.317 | 0.559 | 0.643 |

Candidate B outperformed at every level and was chosen for fine-tuning going forward.

## Fine-Tuning, and Checking for Catastrophic Forgetting

585 entries (10% of the gold set) were held out and never touched during training, to test the model afterward on genuinely unseen predicates. Training ran via QLoRA across two rounds, 3 epochs then 6 more for 9 total.

The second round showed a real, clear improvement — up nearly 5 percentage points at precision@1 and over 9 points at precision@10 — with no sign of catastrophic forgetting.

## Evaluating Both Extraction Checkpoints

Using the same fixed set of 150 sentences from the previous week, both trained extraction checkpoints were scored by an LLM judge.

| Source | Higher learning rate F1 | Lower learning rate F1 |
|---|---|---|
| Wikipedia | 0.692 | 0.613 |
| Train | 0.795 | 0.471 |
| BenchIE | 0.182 | 0.214 |

The higher learning rate checkpoint won clearly on Wikipedia and training data, and became the checkpoint used for the rest of the project.

## The Full Pipeline, End to End, for the First Time

With both models in place, I ran the complete pipeline — extraction followed by normalization — on the same 150-sentence evaluation set.

| Source | Precision | Recall | F1 |
|---|---|---|---|
| Wikipedia | 0.600 | 0.610 | 0.603 |
| Train | 0.567 | 0.550 | 0.555 |
| BenchIE | 0.270 | 0.223 | 0.238 |

BenchIE remained noticeably harder than the other two sources, which makes sense given it's independently authored, out-of-distribution text rather than data generated for this project.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
