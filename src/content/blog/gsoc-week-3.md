---
title: "GSoC Week 3: A Full Dataset Audit and the Case for Fine-Tuning"
description: "GSoC 2026 progress update."
pubDate: 2026-06-16
tags: []
---

GSoC Week 3: A Full Dataset Audit and the Case for Fine-Tuning

This week centered on four connected tasks: a complete content analysis of the existing 20,000-example synthetic dataset, building and fixing the ontology alignment layer, testing existing Indic language models to confirm the need for fine-tuning, and researching annotation tooling in depth.

Task 1 — Complete Dataset Content Analysis

I worked through the entire scored dataset in detail — 20,000 examples, each in chat format with a system prompt, a Hindi sentence, and an assistant response containing a full reasoning trace and the extracted triplets, along with a quality score and justification from an earlier scoring pass.

Score distribution. The average score across all 20,000 examples was 7.30 out of 10. Filtering to score 9 and above gives 8,633 examples (43.2% of the total) — this became the working high-quality training set. One interesting detail: score 4 examples showed a real, consistent spike, and manually inspecting them showed the judge was correctly catching two specific problems — subject/object reversal and incorrect span boundaries — exactly as it should.

Reading examples at every score level. Score 10 examples are genuinely perfect: grammatically correct source sentences with exact-substring spans. Score 9 examples are very good with one small, forgivable issue, usually an awkward source sentence rather than an extraction error — still fully usable for training. Score 8 examples were more mixed; some had genuinely ungrammatical source sentences despite accurate extractions, which is part of why the training threshold was ultimately set at 9 rather than 8 — training on broken input risks teaching the model that broken Hindi is acceptable. Score 3 examples had real meaning errors, most commonly missing negation, where a sentence stating something does not happen got extracted as if it does — a genuine, instructive category of mistake to be aware of.

Property vs. real-relation split — the most important finding of the week. Of 176,817 total triplets across the dataset, 78.8% use a generic "property" relation (adjective-noun, possessive, temporal attributes), and only 21.2% use real Hindi verb relations. This matters directly: fine-tuning on this data as-is would teach a model to output "property" the vast majority of the time, mirroring the exact placeholder problem observed in the baseline evaluation. This finding directly shaped the decision to pursue staged training later in the project — training first on the full mix, then specifically refining on verb-relation-heavy examples.

Other confirmed data-quality signals: 100% of examples included a structured, 5-step reasoning trace — meaning the model being trained will learn to reason about a sentence, not just pattern-match an output. Zero exact duplicate sentences across all 20,000 examples. A full run of six defined error-type checks came back clean on nearly every category, with span-boundary errors sitting within acceptable tolerance after accounting for Unicode encoding differences.

Task 2 — Ontology Alignment Layer

I built and tested a layer to map extracted Hindi relations to real DBpedia ontology properties.

First attempt used a small, manually curated set of 20 properties and looked deceptively strong at a 99.3% alignment rate — until manual inspection showed this was mostly wrong, with one generic property acting as a catch-all bin for a quarter of all matches, and clearly unrelated words being matched confidently.

Root cause: only 20 properties for over 2,000 unique predicates was forcing bad matches, and the multilingual embedding model was in some cases confusing Hindi words with unrelated foreign-language property names entirely.

The fix: I found the real DBpedia ontology file already present in the repository (2,890 real DBpedia properties) and built on an existing ontology-alignment approach already present in the codebase from earlier project work, extending it into a curated set of 73 properties with combined Hindi and English descriptions, adding a copula keyword rule, correcting several property descriptions that were acting as catch-all bins, and raising the confidence threshold.

Verified result: on a held-out check of 30 aligned samples, all 30 were correct — 100% precision on the aligned subset. At full scale across the 37,496 verb triplets in the dataset: 5,109 (13.6%) aligned automatically to a real DBpedia property, with the rest queued for human review. This 13.6% auto-alignment rate is an honest, correctly-calibrated number — most raw Hindi predicates are genuinely complex and won't map cleanly without either more sophisticated matching or fine-tuning to produce cleaner predicate phrasing in the first place.

Task 3 — Testing Existing Indic Models

To confirm that fine-tuning a new model was actually necessary — rather than assumed — I tested two existing models directly on the extraction task, zero-shot.

IndicBART (244M parameters, trained for translation/summarization across 11 Indic languages) produced garbled output when prompted for structured extraction — it had no real concept of the task, treating it more like translation.

mREBEL (611M parameters, specifically trained for multilingual relation extraction with property URI output — the closest existing model to this project's actual goal) produced completely empty output on every single one of 3,282 Hindi test examples, despite Hindi being a listed supported language.

Together with the baseline numbers from Weeks 1–2, this gave a clear, evidence-based picture: no existing model — rule-based, Indic-specific, or purpose-built for relation extraction — handles Hindi triple extraction reliably out of the box. This directly justifies the fine-tuning approach the project is built around.

Task 4 — Annotation Interface Research

I evaluated four real annotation tools against the project's specific needs — particularly, whether each tool has any real awareness of the DBpedia ontology, since that's central to what a reviewer needs to see.

Argilla exports directly to a standard training-data format and supports active learning, but has no built-in DBpedia awareness — a ranked property suggestion list would need to be added manually as a custom field.

INCEpTION is the only tool with built-in DBpedia entity-linking support, making it the most semantically aligned option on paper — but it's Java-based and heavier to deploy than a Python-native option.

Doccano is the simplest to stand up, but has no ontology integration at all — a reviewer would need to type property names manually.

Streamlit, building something fully custom, gives complete control: the exact interface needed (sentence, extracted triple, ranked DBpedia property suggestions with confidence scores, accept/reject/edit actions, structured error categories, automatic export) without fighting against another tool's built-in assumptions. Given the project's specific need for tight DBpedia-ontology integration, this was the direction chosen going forward.
