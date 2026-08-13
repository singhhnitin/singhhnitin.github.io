---
title: "GSoC Week 9: Full-Scale Evaluation and Rebuilding the Review Tool"
description: "GSoC 2026 progress update."
pubDate: 2026-07-28
---

GSoC Week 9: Full-Scale Evaluation, a Fairer Model Comparison, and Rebuilding the Review Tool

This week was about moving from small-sample testing to genuine full-scale numbers, making sure every comparison along the way was measured fairly, and turning the human review tool from a demo into something connected to real pipeline data.

Extending Precision@k to k=40

The predicate-linking model was evaluated on the true 585-example held-out test set — predicates it had never seen during training — checking how often the correct DBpedia property appears somewhere in the top-k retrieved candidates, all the way out to k=40.

k	Precision
1	37.6%
10	78.8%
40	89.9%

A specific target of reaching 90% at k=40 had been set in advance. The result, 89.9%, landed right at that target — an honest, precise number worth reporting exactly as measured rather than rounded.

Making the QLoRA vs. Plain LoRA Comparison Genuinely Fair

A second version of the predicate-linking model was trained without 4-bit quantization, to check whether quantization was helping, hurting, or making no real difference.

A real measurement inconsistency was caught before drawing any conclusion: the training script's own built-in evaluation used a different method for turning text into vectors than the project's official evaluation script used. Comparing numbers produced by two different measurement methods would have been like comparing measurements taken in different units — not a fair comparison at all. This was fixed by always merging model weights first and then re-evaluating every checkpoint with one single, consistent method.

Once fairly compared, QLoRA outperformed plain LoRA by 0.5 to 1.5 percentage points at every threshold tested — matching the expected direction, since quantization noise can act as a mild regularizer that slightly improves how well a model generalizes.

Recovering Predicates That Were Too Quickly Marked "No Match"

2,174 predicates had previously come back with no DBpedia property match at all. All of them were retried, this time checking further down the ranked candidate list — ranks 51 through 100 — instead of stopping at the usual cutoff, on the hypothesis that some "no match" results were retrieval limitations rather than genuine absences.

1,249 of the 2,174 (57.5%) received a real DBpedia property once the search went deeper, raising total predicate coverage from 72.9% to 88.4%. This was a meaningful recovery — nearly six in ten "no match" cases weren't actually unmatchable, they simply hadn't been searched far enough.

The First Genuinely Full-Scale Pipeline Run

Every previous evaluation had been on a sample of 150 sentences. This week, the complete pipeline — extraction through final DBpedia property — ran across the entire evaluation set for the first time: 1,817 Wikipedia sentences, 112 BenchIE sentences, and 50 training sentences.

Source	Sentences	F1
Wikipedia	1,817	0.49
Train	50	0.54
BenchIE	112	0.17

BenchIE's score sits meaningfully below the other two sources. Rather than smoothing over this, it's being tracked openly as an active area of investigation — BenchIE is independently authored, human-annotated text quite different in style from the project's own training data, and understanding exactly why the gap is this large is a genuinely useful open thread for the coming weeks, not a finished, closed result.

Rebuilding the Human Review Tool Around Real Data

The review interface was substantially rebuilt this week: connected to real pipeline output instead of demo data, with the review filter changed from a fixed confidence-score cutoff to a simple "has a suggested property or not" check. The earlier cutoff-based filter had been silently excluding a large share of real data from ever being reviewable at all; the new approach makes everything genuinely reviewable. The review screen now also shows both the suggested DBpedia property and the original Hindi phrase together, so a reviewer can see exactly what's being matched, and every review decision now syncs automatically to GitHub.

A concrete, useful finding while testing this: one triple scored a very high 0.94 confidence, yet manual review found the subject and object were actually reversed — direct, real evidence that human review meaningfully catches things a confidence score alone would miss.

Two follow-up fixes were made after initial testing: the tool originally forgot everything already reviewed on page reload, asking the same questions again — fixed by giving every triple a stable ID and checking GitHub on load for what's already been decided. And since the tool sits on a public link, a password gate was added, along with input validation on the manual property-entry field, so a stray or unintended visitor can't corrupt real review data.

Building the Feedback-Merge Script

A script was written to take confirmed human corrections from the review tool and fold them back into the model's predicate cache and future training data — closing the loop from "a human caught an error" to "the model can eventually learn from it." It hasn't been run in earnest yet, since it needs a genuinely meaningful batch of real corrections to work on first, but it's built and ready for when that batch exists.

Starting a Full Audit of "Property"-Type Triples

Roughly 79% of all extracted triples get classified as descriptive "property" fragments rather than real relational facts, and are set aside from DBpedia matching entirely. A manual spot-check of 40 such triples found one that had actually been mislabeled — a genuine fact wrongly filed as non-relational. Rather than estimate from a small sample, a full audit of all 6,189 property-type triples was started this week, using an LLM to independently judge each one. If the spot-check rate held at scale, that would represent a genuinely meaningful number of real facts currently being set aside unnecessarily — worth knowing precisely rather than guessing at, which is exactly what the full audit is for.
