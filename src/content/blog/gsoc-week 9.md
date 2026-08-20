---
title: "GSoC Week 9: Full-Scale Evaluation and Rebuilding the Review Tool"
description: "Full-scale evaluation across the entire dataset, plus rebuilding the human review tool around real pipeline data."
pubDate: 2026-07-28
tags: []
---

This is the ninth week (20-26th July) of the coding period of GSoC where the main aim was to move from small-sample testing to genuine full-scale numbers, make sure every comparison was measured fairly, and turn the human review tool from a demo into something connected to real pipeline data.

## Extending Precision@k to k=40

The F2LLM-1.7B predicate-linking model was evaluated on the true 585-example held-out test set — predicates it had never seen during training — checking how often the correct DBpedia property appears somewhere in the top-k retrieved candidates, all the way out to k=40.

| k | Precision |
|---|---|
| 1 | 37.6% |
| 10 | 78.8% |
| 40 | 89.9% |

A specific target of reaching 90% at k=40 had been set in advance. The result, 89.9%, landed right at that target.

## Making the QLoRA vs. Plain LoRA Comparison Genuinely Fair

A second version of F2LLM-1.7B was trained without 4-bit quantization, to check whether quantization was helping, hurting, or making no real difference.

A real measurement inconsistency was caught before drawing any conclusion: the training script's own built-in evaluation used a different method for turning text into vectors than the project's official evaluation script used. This was fixed by always merging model weights first and re-evaluating every checkpoint with one single, consistent method.

Once fairly compared, QLoRA outperformed plain LoRA by 0.5 to 1.5 percentage points at every threshold tested.

## Recovering Predicates That Were Too Quickly Marked "No Match"

2,174 predicates had previously come back with no DBpedia property match at all. All of them were retried, checking further down the ranked candidate list — ranks 51 through 100 — instead of stopping at the usual cutoff.

| Result | Value |
|---|---|
| Predicates recovered | 1,249 / 2,174 (57.5%) |
| Total coverage before | 72.9% |
| Total coverage after | 88.4% |

## The First Genuinely Full-Scale Pipeline Run

Every previous evaluation had been on a sample of 150 sentences. This week, the complete pipeline — Gemma 3 4B extraction through F2LLM-1.7B normalization — ran across the entire evaluation set for the first time.

| Source | Sentences | F1 |
|---|---|---|
| Wikipedia | 1,817 | 0.49 |
| Train | 50 | 0.54 |
| BenchIE | 112 | 0.17 |

BenchIE's score sits meaningfully below the other two sources. This was tracked openly as an active area of investigation rather than smoothed over — BenchIE is independently authored, human-annotated text, quite different in style from the project's own training data.

## Rebuilding the Human Review Tool Around Real Data

The review interface was substantially rebuilt this week: connected to real pipeline output instead of demo data, with the review filter changed from a fixed confidence-score cutoff to a simple "has a suggested property or not" check.

A concrete, useful finding while testing this: one triple scored a very high 0.94 confidence, yet manual review found the subject and object were actually reversed — direct evidence that human review catches things a confidence score alone misses.

Two follow-up fixes: giving every triple a stable ID so reviewed items persist across reloads, and adding a password gate plus input validation since the tool sits on a public link.

## Building the Feedback-Merge Script

A script was written to take confirmed human corrections and fold them back into the predicate cache and future training data. Built and ready, waiting on a genuinely meaningful batch of real corrections to run against.

## Starting a Full Audit of "Property"-Type Triples

Roughly 79% of all extracted triples get classified as descriptive "property" fragments and set aside from DBpedia matching entirely. A manual spot-check of 40 such triples found one that had actually been mislabeled. A full audit of all 6,189 property-type triples was started this week, using GPT-OSS-120B to independently judge each one — results covered in a later week.

---

Footnotes

[^1]: Tiwari, Datta, Marada, Panchal, Ananya, Banerjee, Soru — "LLM-Assisted Multilingual Information Extraction for Knowledge Graph Population: The DBpedia Hindi Chapter," Text2KG Workshop, ESWC 2026. https://ceur-ws.org/Vol-4233/Text2KG_Paper_ID_18.pdf
[^2]: https://github.com/dbpedia/neural-extraction-framework
[^3]: https://deba-iitbh.github.io/deba-gsoc24
[^4]: https://advenk.github.io/av-blog
