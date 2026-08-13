---
title: "GSoC Week 6: Fixing a Scoring Bias and Getting the Training Pipeline Running"
description: "Finding and fixing a scoring bias that was undervaluing real Wikipedia sentences, then getting the training pipeline running end to end."
pubDate: 2026-07-07
tags: []
---

GSoC Week 6: Fixing a Scoring Bias, Resolving Coreference, and Getting the Training Pipeline Running

With real Wikipedia sentences scraped and annotated, this week was about turning that raw material into a genuinely trustworthy training and validation set — and getting the actual fine-tuning pipeline built, tested, and confirmed working end to end.

Scoring Wikipedia Sentences, and a Real Bias Found and Fixed

Every Wikipedia sentence's extracted triples needed a quality score before being trusted as validation data — using the same LLM-as-judge approach as the original dataset, with sentences scoring 9 or above becoming the validation set.

A real, measurable bias was found: Wikipedia sentences were scoring surprisingly low overall. Testing directly confirmed the cause — sentences with a high proportion of "property"-type relations (descriptive adjective-noun pairs, common in naturally-written encyclopedic text) were being scored unfairly low by the judge, even when the actual extractions were completely correct. The original 20K dataset didn't show this pattern, but the vast majority of Wikipedia sentences fell into exactly this "property-dense" category — meaning the bias was hitting real Wikipedia data especially hard.

The fix: two carefully chosen examples were added to the judge's prompt — one showing that a property-dense sentence can and should still score well when the extraction itself is correct, and one showing what an actual property-relation logic error looks like, so the judge could tell the difference between "naturally descriptive" and "genuinely wrong." This single change raised the rate of Wikipedia sentences scoring high enough for validation from about 8.5% to 68.8% — a meaningful, measured improvement that directly increased how much real, high-quality Wikipedia data could go into the validation set.

Other real fixes made during this scoring pass: raising the judge's output length limit, since responses were occasionally being cut off mid-answer; making the resume logic safe against duplicate counting if a scoring job was interrupted and restarted; and running the scoring job in parallel chunks for speed. In total, 12,234 unique Wikipedia sentences were scored.

Resolving Coreference

Wikipedia sentences are pulled as standalone lines, but Hindi — like most languages — frequently uses pronouns that refer back to something named in a previous, unavailable sentence, which can make a triple's subject genuinely ambiguous on its own.

Every validation-candidate sentence flagged for containing a pronoun was handled with a three-way classification: resolved, where the real referent could be determined and the sentence rewritten with the actual name substituted, followed by fresh re-extraction; self-contained, where a demonstrative pronoun directly attached to a noun (like "this city" or "that temple") is actually a perfectly valid, checkable subject on its own and didn't need to be excluded; and genuinely ambiguous, where a bare pronoun with no anchor at all was excluded from the validation set entirely, since it couldn't be reliably graded either way.

This careful three-way handling — rather than simply discarding every sentence containing a pronoun — meant genuinely recoverable examples were kept rather than lost, landing at 1,817 final validation candidates.

Assembling the Final Dataset

Everything came together this week into the two files actually used for training. Every example follows a consistent "slug" format — subject | relation | object, one triplet per line, with the literal word NONE when a sentence has no extractable facts. Two relation types appear throughout: core relations (the sentence's main fact) and property relations (descriptive breakdowns of multi-word phrases). Two trace types also exist for every example — a short "optimal" version with just the direct answer, and a longer chain-of-thought version that reasons through the extraction step by step before answering.

A real schema bug found and fixed: the combined training file mixed entries from different sources that didn't all share the same fields, which crashed the data-loading library partway through. This was fixed by normalizing every entry to a consistent schema before combining, using type-consistent placeholders for any missing fields rather than nulls, which had been causing a second, subtler version of the same crash.

Final dataset sizes: 79,242 total training traces and 3,634 validation traces, both confirmed at 0 invalid entries.

Training Configuration and the Smoke Test

Training settings are managed through Hydra configuration files rather than hardcoded, with every run logged to Weights & Biases for tracking. The base model is fine-tuned via 4-bit QLoRA, comparing two learning rates directly, with evaluation running every quarter-epoch.

Before committing to a multi-day full run, a small smoke test (50 examples, 1 epoch) confirmed the entire pipeline works end to end. Several real issues surfaced and were fixed during this process:

The original environment was too old to run the required library versions for the base model, fixed by building a fresh Python 3.10 environment. The schema mismatch from dataset assembly needed the same fix described above. The most significant issue was a crash in the custom evaluation code that has the model actually generate a test answer — traced, after a couple of intermediate attempts, to a confirmed, still-open bug in the underlying library's built-in generation function specifically affecting this model's cache handling. The real fix was writing a manual, step-by-step generation loop instead, giving full explicit control over tensor shapes. The first version of that manual loop was very slow, since it wasn't reusing previously computed work between steps — fixed by properly reusing the computation cache between steps, which also made progress visible rather than appearing to hang.

Real output from the smoke test, on a sentence about tweeters being found in home stereo systems: after only 50 training examples, the model already captured the general shape of the task correctly — right relation, roughly right entities — while still adding an unrequested explanation and missing some of the finer property-level detail. Entirely expected at this very early stage, and a good sign the model was learning in the right direction: loss dropped steadily and token accuracy rose across the four test steps, with all four steps and evaluations completing without a single crash.

Dataset Statistics and a Timing Estimate

Measuring token length directly on the final training set: an average of 327 tokens, a maximum of 1,087, with only 7 out of 79,242 examples (0.01%) exceeding the model's context window — negligible. From the smoke test's real measured timing, one full epoch was estimated at roughly 2.5–3 days, putting a single complete learning-rate run at around 8–9.5 days, and both planned runs combined at roughly 16–19 days on the available hardware.
