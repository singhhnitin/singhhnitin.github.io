---
title: "Week 8: Predicate-Linking Fine-Tuning and the Normalization Decision Point"
description: "Building a full-scale gold set across 8,034 predicates, an encoding mismatch that invalidated early results, and the open question heading into next week."
pubDate: 2026-07-21T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "predicate-linking"]
layout: ../../layouts/post.astro
---

This week centered on closing the loop on the predicate-linking model — the component that maps extracted Hindi predicates to DBpedia ontology properties, and which the entire normalization pipeline depends on.

## Building a full-scale gold set

Earlier evaluations of the embedding models had only been tested on a handful of predicates — not enough to trust. This week, a proper gold set was constructed across all 8,034 unique Hindi predicates from the training and validation data. F2LLM-8B retrieved the top-50 DBpedia ontology candidates for each predicate, and GPT-OSS-120B picked the correct one from that shortlist. This produced 8,029 usable entries — 5,855 real DBO mappings and 2,174 correctly identified as having no ontology match.

## F2LM-1.7B vs. E5

With this larger, fairer gold set in hand, an unbiased comparison showed F2LM-1.7B clearly outperforming E5 at every level:

| Metric | E5 | F2LM-1.7B |
|---|---|---|
| precision@1 | 0.240 | 0.317 |
| precision@5 | 0.432 | 0.559 |
| precision@10 | 0.523 | 0.643 |

F2LM-1.7B confirmed as the right base model to fine-tune further.

## Fine-tuning and a lesson in evaluation consistency

F2LLM-1.7B was fine-tuned with QLoRA (rank 16, targeting q_proj and v_proj, lr=2e-5) on a held-out split, with a 10% test set separated beforehand. The first pass looked like a dramatic win — precision@1 went from 0.000 to 0.214 on the held-out set. But a fairer re-evaluation using consistent SentenceTransformer encoding throughout told a different story: almost no real improvement (0.330 → 0.322).

The root cause was an encoding mismatch — training used AutoModel with manual mean pooling, while evaluation used the SentenceTransformer wrapper, so the two weren't measuring the same thing. An important reminder that encoding pipelines have to match end-to-end for the numbers to mean anything.

## Continuing the fine-tune

With the mismatch identified, a 6-epoch continuation run was launched from the existing checkpoint. Once evaluated consistently, precision@1 on the unbiased gold set moved to 0.378 — up from the 0.330 baseline.

| Checkpoint | precision@1 | precision@5 | precision@10 |
|---|---|---|---|
| Original (0 epochs) | 0.330 | 0.604 | 0.693 |
| After Round 1 (3 epochs) | 0.322 | 0.597 | 0.696 |
| After Round 2 (9 epochs total) | 0.378 | 0.706 | 0.785 |

## Where this leaves things

Precision@1 is the gating number for whether normalization results can be trusted — since normalization sits directly on top of predicate-linking. With 0.378 now in hand, this is the open question heading into next week: is that number strong enough to proceed with the full normalization pipeline, or does predicate-linking need further work first.
