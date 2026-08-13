---
title: "GSoC Week 7: Streamlining the Training Pipeline"
description: "GSoC 2026 progress update."
pubDate: 2026-07-14
tags: []
---

GSoC Week 7: Streamlining the Training Pipeline and a Close Qualitative Look at Real Outputs

This week combined two things: making the training pipeline itself faster and more efficient, and taking a genuinely close, honest look at what the model was actually producing on real sentences — not just aggregate scores, but line-by-line comparison against the correct answer.

Streamlining the Dataset and Training Pipeline

The training data was filtered down to "optimal"-trace examples only, removing the longer chain-of-thought traces that weren't the intended training format for this stage. This produced a cleaner set of 39,621 examples, and checking token length directly confirmed all of them comfortably fit under a much smaller context window than originally configured — allowing the block size to be reduced from 1024 to 512 tokens, a real efficiency gain with no downside once verified.

The expensive generation-based evaluation that had been running every quarter-epoch was removed, since it was adding significant overhead for relatively little signal this early in training. In its place, a single baseline evaluation was added at step zero, giving a clean "before training" reference point without the ongoing cost. Automatic checkpoint-resume logic was also added to the training script, so an interrupted run can pick back up from its last saved point instead of restarting from scratch.

A Close Look at Real Model Output

To really understand what the fine-tuned model (lr=2e-4 checkpoint) was doing, I ran it on 150 real sentences — 50 each from clean Wikipedia validation data, the external BenchIE benchmark, and the training data itself — and went through model predictions against the correct answer line by line, not just as an aggregate score.

A clear, consistent pattern emerged across nearly every example: the overwhelming majority of "failures" under strict exact-match scoring were not actually wrong in any meaningful sense — they were genuine, reasonable formatting and structural differences that preserved the correct underlying meaning. A few representative real cases:

One sentence about soldiers achieving success through regular military practice: both core relations were correctly identified, with only minor differences in exactly where a phrase's boundary was drawn — the real content was right.
One sentence about chlorine being found in soil: the model's main line was a perfect exact match to the gold answer; the only difference was one additional, reasonable property-relation line the model added that gold didn't happen to include.
One sentence naming three actors as the lead cast: gold split the three names into three separate triplet lines, while the model combined all three into a single subject in one line — arguably just as valid a way to represent the same fact, simply a different structural choice.

A smaller, genuinely useful minority of cases showed real content differences worth knowing about, rather than being smoothed over: a couple of examples showed the model outputting a literal "NONE" for an object where a real answer existed in the gold data — a genuine miss, not just a formatting difference. A few other examples showed subject and object roles reversed relative to gold, rather than simply restructured — a real content difference worth tracking as the project continues, not a phrasing choice.

Overall assessment: across all 15 closely-examined examples, every single one had valid, correctly-formatted output — confirming that an earlier generation-stopping fix was working exactly as intended — and while every one technically failed strict exact-match scoring, most of those "failures" reflect reasonable structural choices rather than actual errors. This distinction between formatting differences and genuine content errors is an important one to keep in mind when reading raw F1 numbers, and it's part of why later evaluation work moved toward LLM-as-judge scoring, which can tell the two apart the way a human reading the output naturally would.
