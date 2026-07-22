---
title: "Week 7: The Case of the Suspiciously Bad Grades"
description: "Zero percent correct across every category, a broken scorekeeper, and the lesson that sometimes a bad-looking number is just a bug in a scary costume."
pubDate: 2026-07-14T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "evaluation"]
---

This week started with a genuine scare.

## Zero percent correct

I built a proper evaluation — 150 sentences pulled from three different sources, specifically designed to answer one question: is this model actually learning anything real?

The first results came back and they were bad. Not "needs improvement" bad — zero percent correct bad, across almost every category. My stomach dropped a little. Had all this work led nowhere?

I did what any good detective would do: I stopped trusting the scoreboard and went and read the actual evidence myself, line by line. And there it was — the model's answers were often genuinely correct, sitting right there in plain sight... immediately followed by a strange glitch where it kept talking long after it should have stopped, eventually spiraling into repeating itself over and over until it ran out of room.

The model wasn't failing. My scorekeeper was broken.

## The real bug

It turned out the model has a very specific way of signaling "I'm done answering," and my evaluation script simply wasn't listening for that exact signal — so it let the model ramble on into nonsense, and then judged the whole rambling mess as one big wrong answer, even though the real answer, buried at the top, was correct.

Fixing that one detail flipped the results almost overnight — the model went from "producing garbage" to "producing clean, correctly-formatted answers" essentially 100% of the time.

## Building a fairer scoring system

Even after that fix, I noticed something more subtle: a strict word-for-word grading system still marked many good answers as "wrong," simply because the model organized its answer slightly differently than the reference — same facts, different arrangement.

So I built a fairer way of scoring: instead of demanding an exact match, it checks whether each individual fact the model extracted was actually correct, regardless of order or grouping. It's the difference between grading an essay only if every word matches a rubric exactly, versus actually reading it for whether the ideas are right.

## Where things stand

By week's end, I had two fully trained models, a properly working evaluation system, and a much better sense of a lesson that I suspect will keep coming back throughout this project: sometimes the hardest bugs to find aren't in the thing you built — they're in the thing you built to check your work.
