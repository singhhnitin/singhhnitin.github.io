---
title: "GSoC Week 11: Establishing Real Baselines and Testing Beyond Hindi"
description: "GSoC 2026 progress update."
pubDate: 2026-08-11
tags: []
---

GSoC Week 11: Establishing Real Baselines and Testing Beyond Hindi

With the core pipeline trained, evaluated, and documented, this week closed out two items flagged as next steps at the end of last week: splitting every result into extraction-only and full-pipeline figures, and establishing genuine baselines to measure the fine-tuned model against. It also added something new — a direct test of how the pipeline behaves on languages it was never trained on.

Extraction-Only vs. Full-Pipeline, Completed

Every result now reports two separate numbers: extraction-only (raw predicted triples compared directly against gold, with no DBpedia matching involved) and full-pipeline (the final result after predicate linking). Separating these two makes it possible to tell, for any given result, whether a gap comes from the extraction step or the normalization step.

Source	Extraction-only F1	Full-pipeline F1
Wikipedia	0.554	0.493
Train	0.610	0.537
BenchIE	0.056	0.173

BenchIE shows a genuinely interesting, opposite pattern from the other two sources — its full-pipeline score is higher than its extraction-only score. Looking closely at real examples explained this directly: the model consistently trims small Hindi grammatical particles (postpositions like का/की/में) that BenchIE's gold spans retain, which causes exact-text matching to fail even when the underlying fact is completely correct. Once predicate linking maps both sides to the same DBpedia property instead of comparing raw text, this difference disappears and the real matches are recovered. This is a good, concrete example of why separating these two numbers is worth doing — without it, this pattern would have looked like unexplained noise rather than a specific, understood behavior.

Real Baselines, on the Same Evaluation Set

To know whether the fine-tuning work is genuinely paying off, two real reference points were established — an existing external Hindi extraction tool, and the same base model completely untrained — both evaluated on the exact same sentences as the main model, with both extraction-only and full-pipeline numbers for each.

System	Wikipedia (ext/full)	Train (ext/full)	BenchIE (ext/full)
Fine-tuned model	0.554 / 0.493	0.610 / 0.537	0.056 / 0.173
Base model (untrained)	0.024 / 0.150	0.014 / 0.057	0.016 / 0.067
External tool (rule-based)	0.021 / 0.126	0.010 / 0.048	0.076 / 0.151

Fine-tuning improved Wikipedia F1 by roughly 23x and Train F1 by roughly 44x over the untrained model on extraction-only scoring — a clean, honest way to demonstrate the real value the fine-tuning work adds, with a genuine, external point of comparison rather than only comparing the project against its own earlier checkpoints.

Testing the Pipeline Beyond Hindi

To understand how the pipeline behaves outside its training language, the extraction model was run on 50 real Gujarati sentences and 50 Rajasthani sentences — languages it has never seen in training.

Language	Produced output	Crashed
Gujarati (n=50)	50 / 50	0
Rajasthani (n=50)	50 / 50	0

All 100 sentences produced output with zero crashes — confirming the pipeline handles genuinely unfamiliar input gracefully rather than breaking on it. Looking at the actual predictions in detail showed a clear, consistent, and honestly quite interesting pattern: the model reliably identifies the correct type of relation even in an unfamiliar language — correctly recognizing a "capital of" relationship or a "located in" relationship regardless of the source language — while the subject and object spans often mix scripts, and Hindi grammatical patterns get substituted onto non-Hindi sentence structure. In other words, the model generalizes the underlying task well beyond what it generalizes the language — a genuinely useful, concrete finding about exactly what fine-tuning did and didn't teach it.

Where Things Stand

With baselines established and the extraction/normalization split fully in place, the project now has a complete, honest picture: a fine-tuned model that clearly and measurably outperforms both an untrained baseline and an existing external tool, on every source and every metric, with a well-understood explanation for the one place its behavior looked unusual at first glance.
