---
title: "GSoC Week 2: Establishing Phase 1 Baselines on Hindi-BenchIE"
description: "Measured baselines for the existing extraction systems, a previously undocumented failure mode hiding inside IndIE's rule engine, and sizing the fine-tuning data requirement."
pubDate: 2026-06-09T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "benchmarks"]
---

Week 1 covered the project background and the systems already in place — IndIE, GSoC25_H, and the Hindi-BenchIE benchmark. Week 2 was about actually running those systems and measuring where they stand, rather than working from assumptions.

## Setting the baseline

I ran IndIE, GSoC25_H, and a zero-shot Gemma-3-1B baseline against the full Hindi-BenchIE dataset — 112 hand-annotated sentences. For evaluation, I reused `BenchIEDetailedComparator` from GSoC25_H rather than writing a new evaluation script, so this year's numbers stay directly comparable to last year's instead of being measured on a different yardstick.

| System | Precision | Recall | F1 |
|---|---|---|---|
| IndIE | 0.44 | 0.49 | 0.46 |
| GSoC25_H (IndIE + Gemma-3-12B + ReAct) | 0.21 | 0.58 | 0.31 |
| Gemma-3-1B zero-shot | 0.00 | 0.00 | 0.00 |

I broke the errors down further, by component: subject, predicate, and object are scored separately rather than just as one aggregate correct/incorrect triple. Argument span extraction — correctly identifying the subject and object — was at 0% error across all three systems. Every single error, across every system tested, was in the predicate. That result narrows things down a lot: whatever gets built for the rest of this project needs to be aimed at predicate generation specifically. Subject and object extraction, at least as measured on this benchmark, isn't where the problem is.

## A failure mode not in the original taxonomy

Aggregate scores only tell you so much, so I went through IndIE's failures by hand rather than stopping at the F1 number. That surfaced something the existing error taxonomy didn't have a category for: when IndIE's rule engine can't determine a relation with any confidence, it doesn't fail loudly or return nothing. It silently outputs the literal string `"property"` as the predicate and moves on as if it succeeded. I'm calling this failure mode PREDICATE_PLACEHOLDER.

It's easy to miss because the output still has the shape of a real triple — there's a subject, something sitting in the relation slot, and an object. Nothing about the structure flags it as wrong; you have to actually read the predicate to notice. I quantified how often this happens: PREDICATE_PLACEHOLDER accounts for 28.9% of all of IndIE's failures. Running the same check against GSoC25_H's output, that number drops to 8.2%, which tells me the LLM completion step in that pipeline is resolving most of these placeholder cases on its own, though not all of them. I'm going to keep tracking that remaining 8.2% specifically, since it's exactly the kind of error an F1 score alone would never surface — you'd only find it by going and reading actual outputs.

## Sizing the fine-tuning data requirement

The other thing I wanted an answer to before starting on training was how much data this actually needs. Full fine-tuning of a language model typically needs millions of examples to avoid destroying what the model already knows, which isn't realistic for a task this specific. The alternative is LoRA (Low-Rank Adaptation): instead of updating every parameter in the model, you train a small set of additional adapter matrices while the base model's weights stay frozen. That drops the data requirement by a large margin, since you're not trying to re-teach the model language from scratch, just steering it toward this one task.

For a narrow, well-defined extraction task with a consistent output format like this one, published research on LoRA data requirements lands in a fairly consistent range. The part that matters more for how I'm approaching this: a smaller set of manually verified examples, checked against Hindi-BenchIE's gold annotations, should outperform a much larger but noisier synthetic dataset. That's the assumption Week 3's audit was built around — actually going and checking how much of the 20K-example dataset I have on hand is clean enough to use.

## Resources

- [Phase 1 ablation table (markdown)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.md)
- [Phase 1 ablation table (CSV)](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/results/phase1_ablation_table.csv)
- [Week 1 baselines notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/01_week1_baselines.ipynb)
- [Week 2 error analysis notebook](https://github.com/singhhnitin/neural-extraction-framework/blob/gsoc26h-development/GSoC26_H/notebooks/02_week2_error_analysis.ipynb)

## What's next

With the data-sizing question settled in principle, the next step was to stop reasoning about the training data in the abstract and go check what's actually inside the 20K-example dataset — not just how large it is, but how much of it is clean enough to use. That audit is what Week 3 covers.
