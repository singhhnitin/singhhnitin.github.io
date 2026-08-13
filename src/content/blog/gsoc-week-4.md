---
title: "GSoC Week 4: Embedding Model Evaluation and Building the Review Tool"
description: "GSoC 2026 progress update."
pubDate: 2026-06-23
---

GSoC Week 4: Embedding Model Evaluation, Building the Review Tool, and Noisy Data Generation

Four real threads came together this week: evaluating a newer embedding model as a potential upgrade, building the first version of the human review interface, generating a deliberately noisy training dataset for staged learning, and working out an honest compute cost estimate for the fine-tuning runs ahead.

Evaluating a Newer Embedding Model

The ontology alignment layer currently runs on a multilingual MiniLM model. A newer, larger model was evaluated as a potential replacement, to see whether its extra scale would improve the alignment rate.

What the alignment layer does, simply: a Hindi relation phrase needs to be matched to the closest real DBpedia property. The embedding model's job is to convert both the Hindi phrase and every DBpedia property description into a vector, then find the closest match by similarity — a phrase-matching problem at its core.

Result, tested four different ways:

Model	Aligned (of 198 verified test triples)	Precision (manually checked)
Current model (baseline)	35 (17.7%)	100% — every match checked was correct
Newer model (candidate)	32 (16.2%)	~69% — about 1 in 3 matches checked was wrong

The candidate model matched fewer triples and got more of them wrong — worse on both measures that matter. Each of the four attempts to make it work failed for a specific, understandable technical reason: naive usage matched almost everything but mostly incorrectly; finding its correct confidence threshold brought the match count down to a reasonable level but accuracy stayed poor; its own recommended usage mode actually made results worse; and the specific technical feature it needed to perform well conflicted with the rest of the software stack in ways that caused real compatibility problems.

In plain terms: the newer model is more powerful on paper, but the existing model was specifically trained for exactly this kind of short-phrase matching task, while the newer one was built for a different kind of matching (long questions against long answer passages). The mismatch showed up clearly and consistently across every method tried. The existing model was kept.

Building the First HITL Review Interface

I built the first working version of the human review tool as a Streamlit web app.

For every extracted fact, a reviewer sees three options: Accept, if the suggested DBpedia property is correct; Modify, if the reviewer knows the correct property and can select or enter it; and Reject, with a required reason chosen from a set of defined error categories, for extractions that are fundamentally wrong.

Design choices made: color-coded confidence badges using an already-validated threshold, so a reviewer can tell at a glance how confident the system was; automatic connection to real pipeline data when available, falling back to a small demo set so the tool always works even before it's fully wired in; a proper, branded interface with an "About this tool" explanation and clear setup instructions; and permanent, public hosting via GitHub and Streamlit Community Cloud, so the tool has a stable link that works without needing any setup on the viewer's end.

Status at the end of the week: built, tested with no errors, and deployed live — running in demo mode with a small sample set, ready to be connected to the full real dataset.

Generating a Noisy Training Dataset

Per the project's staged-training plan, a second, deliberately noisy dataset was needed — data containing realistic mistakes, so the model first learns the general shape of the task before being refined on clean data.

Method: the same generation model tier originally used for the base dataset, seeded specifically with real flawed examples (ones that had scored below 8 out of 10 in the earlier quality pass) as few-shot demonstrations for the kind of mistake to imitate, reusing the same generation templates and structure as the original dataset so the new data matches its format and style.

Verified characteristics: roughly 15,000–16,000 examples generated at this point, with generation ongoing; an 86% success rate per batch; zero duplicate sentences; zero empty-triplet examples; and the same JSON structure as the original dataset, making it fully compatible for training without any reformatting.

Estimating Compute Cost

To plan the fine-tuning runs responsibly, I worked out a real, honest GPU cost estimate. The methodology: take the time for one clean training run, multiply by 3 (to cover training with three random seeds for reliable, reproducible results), then add a buffer of 5 more run-equivalents for debugging and experimentation — 8x the base single-run time in total.

For a QLoRA fine-tuning run on the target model and dataset size, one clean run was estimated at roughly 5 hours on an A100-class GPU, giving 40 total GPU-hours needed. At current rental rates, this came out to roughly ₹4,438 — genuinely less than the equivalent estimate using a slower, cheaper GPU class, since the faster GPU finishes each run in a fraction of the time despite the higher hourly rate. This is a fully self-funded estimate covering only the training compute itself; the noisy dataset generation this week used a free-tier API and cost nothing.
