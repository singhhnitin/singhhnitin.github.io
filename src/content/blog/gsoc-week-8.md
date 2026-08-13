---
title: "GSoC Week 8: Building a Predicate-Linking Gold Set"
description: "GSoC 2026 progress update."
pubDate: 2026-07-21
tags: []
---

GSoC Week 8: Building a Predicate-Linking Gold Set and Fine-Tuning the Normalization Model

This week's work connected two halves of the pipeline properly for the first time: building a real, substantial gold set for predicate-to-DBpedia-property linking, using it to fairly compare candidate models, fine-tuning the chosen model on it, and then running the complete extraction-plus-normalization pipeline together for a genuine end-to-end evaluation.

Building the Predicate-Linking Gold Set

When the extraction model produces a triple, its relation comes out as raw Hindi text and needs to be mapped to a formal DBpedia property before it means anything to a knowledge graph. Training a model to do that mapping well needs a real gold set of correct answers.

Built in three stages: first, every unique Hindi predicate was extracted from the training and validation sentences — 8,034 in total. Second, for each predicate, a large embedding model retrieved the 50 most relevant candidate DBpedia properties from the full ontology. Third, an LLM read each predicate together with its 50 candidates and picked the single correct property, or NONE if nothing genuinely fit.

Real examples from the result: predicates like "was honored" resolved cleanly to the property for honours received; "was discovered" resolved to the property for a discovery; predicates describing something not being recorded, or something not being organized, were correctly identified as NONE, since no real DBpedia property applies.

Final gold set: 8,034 predicates, with 5,855 (72.9%) mapped to a real DBpedia property and 2,174 (27.1%) correctly identified as NONE.

A Fair, Unbiased Model Comparison

Since the gold set itself was built using a different, larger model than either candidate being evaluated, comparing two smaller models against it was genuinely unbiased — neither had any structural advantage baked in.

Model	Precision@1	Precision@5	Precision@10
Candidate A	0.240	0.432	0.523
Candidate B	0.317	0.559	0.643

Candidate B outperformed at every level and was confirmed as the model to fine-tune going forward. In plain terms, precision@1 of 31.7% means the correct DBpedia property was the model's very first guess for roughly one in three predicates; precision@10 of 64.3% means it appeared somewhere in the top 10 guesses nearly two-thirds of the time.

Fine-Tuning, and Checking for Catastrophic Forgetting

Before fine-tuning, 585 entries (10% of the gold set) were held out and never touched during training, specifically so the model could be tested afterward on genuinely unseen predicates — the standard way to check for catastrophic forgetting, where a model improves on what it was trained on while quietly getting worse at everything else.

Training ran via QLoRA across two rounds — an initial 3 epochs, followed by 6 more for 9 total — with every checkpoint measured using one single, consistent method throughout, to keep the whole comparison genuinely fair.

Result on the held-out set: the first round of training showed only a small change, not yet enough to shift the model meaningfully. The second round showed a real, clear improvement — up nearly 5 percentage points at precision@1 and over 9 points at precision@10 — with no sign of catastrophic forgetting; the model improved on predicates it had never seen during training, exactly as hoped.

A concrete before-and-after example: for the predicate meaning "won an award," the model's top guesses before fine-tuning were unrelated properties about recent winners or general victories; after fine-tuning, its top guesses correctly centered on the actual award property. For a predicate the model already handled correctly before training — "was born," correctly mapping to birth-place-related properties — fine-tuning left it unchanged, exactly as it should.

Evaluating Both Extraction Checkpoints with an LLM Judge

Using the same fixed set of 150 sentences from the previous week, both trained extraction checkpoints (the two different learning rates) were scored by an LLM judge for precision, recall, and F1 — giving a fair, apples-to-apples comparison on identical sentences.

Source	Higher learning rate F1	Lower learning rate F1
Wikipedia	0.692	0.613
Train	0.795	0.471
BenchIE	0.182	0.214

The higher learning rate checkpoint won clearly on Wikipedia and training data, confirming it as the stronger overall model, and became the checkpoint used for the rest of the project.

The Full Pipeline, End to End, for the First Time

With both models in place, I ran the complete pipeline — extraction followed immediately by normalization — on the same 150-sentence evaluation set.

Source	Precision	Recall	F1
Wikipedia	0.600	0.610	0.603
Train	0.567	0.550	0.555
BenchIE	0.270	0.223	0.238

A Wikipedia F1 of 0.603 on a genuinely full, end-to-end pipeline is a strong result for a system built this year on a low-resource language pair. BenchIE remained noticeably harder than the other two sources, which makes sense given it's independently authored, out-of-distribution text rather than data generated for this project — a real, open pattern worth continuing to track as the project moves toward full-scale evaluation.
