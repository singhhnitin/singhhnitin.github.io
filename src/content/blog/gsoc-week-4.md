---
title: "Week 4: Teaching a Machine to Read Between the Lines"
description: "Recalibrating a biased scoring judge, rescuing data from a pronoun problem, and building a clean dataset for fine-tuning."
pubDate: 2026-06-23T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "dataset"]
---

If you've ever played a game of "spot the difference," you'll appreciate what I spent this week doing — except the differences were hiding inside thousands of Hindi sentences, and the stakes were a little higher than a puzzle book.

The mission: take real Hindi sentences from Wikipedia and teach an AI model to pull out the core facts hidden in them — who did what, to whom, and how. Sounds simple until you actually try it.

## The judge had a bias

My first real surprise came when I noticed something strange in my scoring results. Sentences from Wikipedia — real, natural writing — were consistently scoring worse than artificially generated ones, even when they seemed just as good, sometimes better. Why would real writing score lower than fake writing?

Turns out, the judge I was using to grade quality had a bias. Wikipedia sentences are naturally full of little descriptive details — think "the ancient temple" or "the newly built stadium." My scoring system was accidentally penalizing sentences for having too much rich detail, treating description as a flaw instead of a feature. Once I spotted this and recalibrated the judge with a handful of carefully chosen examples, the results flipped dramatically — the pass rate for good sentences jumped from under 10% to nearly 70%.

## The pronoun problem

Then came a puzzle that felt almost linguistic: pronouns. "He went to the market" is a fine sentence — until you realize nobody told you who "he" is. I had to teach the pipeline to recognize three very different situations: pronouns that could be traced back to a name, pronouns that were actually fine standing alone (like "this city," which doesn't need a real name to make sense), and pronouns that were genuine dead ends, with no way to know who or what they referred to.

Sorting these apart, rather than throwing them all away, rescued a meaningful chunk of usable data that would otherwise have been lost.

## Where things stand

By the end of the week, I had a clean, well-organized dataset ready — and a newfound respect for how much hidden nuance sits inside "simple" sentences.
