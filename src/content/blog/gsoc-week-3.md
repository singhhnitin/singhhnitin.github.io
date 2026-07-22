---
title: "GSoC Week 3: Auditing the 20K Dataset End to End"
description: "A full content audit of the existing synthetic dataset surfaced a 78.8% property-relation bias, a failed first attempt at ontology alignment, and a clean justification for why off-the-shelf Indic models aren't a shortcut."
pubDate: 2026-06-16T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "fine-tuning"]
---

Week 2 established that 2,000–5,000 high-quality examples should be enough for fine-tuning, in principle. Week 3 was about finding out how much of the existing 20K-example dataset actually clears that bar.

## What's in the dataset

Each of the 20,000 examples is a chat-formatted triple: a system prompt instructing the model to extract triples, a user message containing the Hindi sentence, and an assistant message with a reasoning trace followed by the extracted triples as JSON. Every example also carries a judgement field — a 1–10 score with a written justification from the judge model that originally scored it.

## Score distribution, and a spike that doesn't belong

The average score across all 20,000 examples is 7.30. The distribution itself is uneven in a way that's worth investigating rather than averaging away: score 4 has 2,742 examples, a visible spike relative to its neighbours, while score 9 alone accounts for 7,535 examples — 37.7% of the entire dataset, by far the largest single cluster. Filtering to score ≥9 leaves 8,633 examples, 43.2% of the total, which becomes the working training set.

Numbers alone don't explain why a score happens, so I read a sample at every score band by hand. Score 10 examples are genuinely clean — grammatical source sentences, spans that are exact substrings of the original text, and triples that accurately capture the sentence's meaning. Score 9 is fully usable too, typically losing a point for a mildly awkward source construction rather than any extraction error. Score 8 is where the dataset gets more interesting: some examples in this band have source sentences that are outright ungrammatical Hindi — one example reads `नई औद्योगिक विकास नीति की शुरू की`, which doesn't parse correctly — yet the extraction itself was accurate, so the overall score stayed high. Training on sentences like that would teach the model to treat broken Hindi as acceptable input, which is the specific reason the filter threshold is set at 9 rather than 8. Score 4 consistently traces back to one of two problems: subject and object swapped, or a span boundary that bleeds a word from one slot into another. Score 3 is more serious — the most common pattern is a dropped negation, where the source sentence states a company does *not* take some action and the extraction reverses it to state that it does, inverting the sentence's actual meaning.

## The dataset's dominant pattern: property relations

This was the most consequential finding of the audit. Across all 176,817 triplets in the dataset, 139,321 — 78.8% — use a generic `"property"` relation rather than an actual Hindi verb. Only 21.2% use real verb relations. On average, each example contains 7.0 property relations against just 1.9 real verb relations, and the ratio barely shifts after filtering to score ≥9: 55,440 property triplets against 16,295 verb triplets, still a 77.3/22.7 split.

This connects directly back to the PREDICATE_PLACEHOLDER pattern found in Week 2. Fine-tuning a model on this dataset unfiltered would teach it to output a generic, non-committal predicate close to 80% of the time — reproducing the exact failure mode this project is meant to fix, just learned from training data instead of inherited from a rule engine's fallback behaviour. It's the clearest argument so far for training in stages: first on the full filtered set to establish Hindi sentence structure and reasoning, then specifically rebalanced toward verb relations, and only then layered with ontology-aligned examples.

## Everything else the audit turned up

Sentences in the dataset average 32 words and 184 characters, with 66.3% falling in the 21–40 word range — a realistic length for Hindi Wikipedia prose. Every single example, all 20,000, includes a structured reasoning trace following the same five-step pattern: deconstruct the sentence, identify the core relation, identify secondary relations, identify property relations, final review. That's full coverage, averaging 1,254 characters per trace, which means fine-tuning on this data teaches a model *how to reason* about a Hindi sentence, not just what JSON to output at the end. Span quality held up well too — subjects average 1.9 words, objects 2.4 words, and only 0.6% of subjects run longer than 10 words. There are zero exact duplicate sentences across the full set, and only 19 near-duplicates by an 80-character prefix match, which is negligible at this scale.

Running the full set of Phase 1 error types against all 20,000 examples gave a clean read: empty predicates and missing triples both sit at 0%, implicit relation errors (bare copulas like है and हुआ used as IS-A relations) sit at 0.7%, and apparent span errors land at 2.42% after accounting for Unicode normalisation differences that aren't real boundary errors. Overall, the dataset is genuinely solid for the surface mechanics of Hindi extraction — the property-relation imbalance is the one structural issue worth designing around.

## Building the ontology alignment layer, and getting it wrong first

In parallel, I ran the ontology alignment work against all 37,496 verb triplets from the dataset, plus the 198 IndIE verb triplets from Phase 1, to check whether Phase 1's predicate errors survive once alignment is applied.

The first version used a manually defined set of 20 properties and reported a 99.3% alignment rate, which looked excellent and turned out to be meaningless. `dbo:occupation` alone was absorbing 25% of all alignments, acting as a catch-all bin for anything that didn't have a better match. High-confidence matches were outright wrong — दर्शाता है ("represents") was mapping to `dbo:occupation`, which makes no semantic sense at all. Digging into why, `dbo:ist` (the German word for "is") was consuming 19.3% of alignments and `dbo:ra` another 18.1% — the multilingual embedding model was matching Hindi predicates against foreign-language property labels purely on surface similarity, with no actual relevance.

The root cause was simple: 20 properties for 2,196 unique predicates leaves the matcher no good options, so it forces a match regardless of quality. The fix was to extend the existing alignment approach with a much larger curated property set — 73 properties, each with a combined Hindi and English description — add an explicit rule for copula-based predicates, correct the descriptions on properties that were behaving as catch-all bins (`dbo:parent`, `dbo:child`, `dbo:university`), and raise the confidence threshold from 0.40 to 0.58.

Re-running against the 198 IndIE verb triplets from Phase 1 gave 30 out of 30 correct on the aligned subset — 100% precision. Across the full 37,496 verb triplets, the final numbers are: 5,109 (13.6%) aligned automatically to a `dbo:` property, the remaining 32,387 (86.4%) routed to human review, across 41 distinct properties used. Checked specifically against Phase 1's IndIE output, alignment reliably resolves around 15% of predicate normalisation errors — but the PREDICATE_PLACEHOLDER cases, 29.3% of IndIE's failures, can't be touched by alignment at all, since there's no real predicate underneath them to match against. The 86.4% HITL rate isn't a weakness in the alignment layer; most Hindi surface predicates genuinely don't map cleanly onto a fixed ontology, and that's exactly the gap human review and better predicate generation are meant to close.

## Testing whether existing models already solve this

Before committing further effort to a custom approach, it was worth checking whether something off-the-shelf already handles this task. I ran two models zero-shot against a 5,000-example sample.

**IndicBART** (AI4Bharat, 244M parameters) produced garbled Hindi — stripped diacritics, repeated words, no attempt at structured extraction at all. I stopped at 2,537 of 5,000 examples once the pattern was unmistakable: effectively 0% useful output. The model has no real concept of triple extraction; it processed the prompt as something closer to a translation or text-reconstruction task.

**mREBEL** (Babelscape, 611M parameters) was the more interesting test, since it's purpose-built for multilingual relation extraction with property-URI output, and Hindi is listed among its supported languages. Run against 3,282 Hindi examples, it produced zero outputs — 100% empty responses, 0% match against gold. That's about as clean a negative result as a benchmark can give.

| System | Precision | Recall | F1 |
|---|---|---|---|
| IndIE | 0.44 | 0.49 | 0.46 |
| GSoC25_H | 0.21 | 0.58 | 0.31 |
| Gemma-3-1B zero-shot | 0.00 | 0.00 | 0.00 |
| IndicBART zero-shot | ~0.00 | ~0.00 | ~0.00 |
| mREBEL zero-shot | 0.00 | 0.00 | 0.00 |

No existing model — rule-based, Indic-specific, or purpose-built for relation extraction — handles Hindi triple extraction reliably out of the box. (Airavata, AI4Bharat's 7B model, remains gated behind HuggingFace approval and wasn't testable this round.)

## Comparing annotation tooling for the feedback loop

Alongside the dataset and modelling work, I evaluated four tools for the human-in-the-loop component this project needs.

**Argilla** is purpose-built for collecting human feedback on LLM outputs — low-confidence triples get pushed via a Python API, a reviewer accepts, rejects, or edits in a browser UI, and corrections export directly to HuggingFace Datasets format. It supports active learning and multi-annotator agreement tracking out of the box. Its gap for this project is that it has no native concept of a DBpedia ontology, so ranked `dbo:` property suggestions would have to be added as a custom metadata field.

**INCEpTION** is the only tool of the four with built-in DBpedia entity linking — highlighting a span in a Hindi sentence surfaces `dbr:` URI suggestions automatically, and it can be configured to offer `dbo:` property selection directly from the ontology. That makes it the most semantically aligned option for producing high-quality, ontology-aligned gold examples, though it's Java-based and noticeably heavier to deploy than the Python-native alternatives.

**Doccano** is the simplest of the four — a pip install, a clean local UI for accept/reject/edit workflows, and a REST API for moving data in and out. It has no DBpedia awareness at all, so property names would need to be typed manually, which invites error, but it's a reasonable choice for a fast, low-stakes annotation pass.

**Streamlit**, the approach used for the prototype so far, gives full control over the interface: the Hindi sentence, the extracted triple, a ranked `dbo:` dropdown populated with confidence scores from the alignment layer, accept/reject/edit actions, error-taxonomy labels, and automatic JSONL export for retraining. The trade-off is that multi-annotator coordination has to be built by hand rather than coming built in — a non-issue while there's a single reviewer, but worth keeping in mind if that changes.

## Where this leaves things

The dataset audit, the alignment layer, the model comparison, and the annotation tooling research all converge on the same conclusion from different directions: the property-relation bias in the data, the PREDICATE_PLACEHOLDER pattern in the rule engine, and the complete failure of off-the-shelf models all point at the same bottleneck. Predicate generation is the problem, and every piece of evidence gathered this week sharpens exactly what fixing it needs to look like.
