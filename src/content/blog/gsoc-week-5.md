---
title: "Week 5: The Marathon Nobody Warned Me About"
description: "Smoke test failures, a crash inside the model's own generation code, and finally hitting go on the real training run."
pubDate: 2026-06-30T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "fine-tuning"]
layout: ../../layouts/post.astro
---

This week, I learned that training an AI model is a bit like baking a very large, very slow cake — and you don't get to open the oven and check on it whenever you want.

## Nothing went smoothly at first

I ran what's called a "smoke test" — a tiny practice run to make sure everything works before committing to the real thing. It did not go smoothly. Over several attempts, I hit one wall after another: an environment that was too outdated to even load the model, a dataset that confused the loading system because different parts of it were shaped slightly differently, and — the trickiest one — a bug in the model's own underlying code that caused it to crash the moment it tried to actually generate an answer.

That last one took real detective work. I ended up writing my own custom generation logic — instead of asking the model to write its whole answer in one go (which is where the crash happened), I made it write one word at a time, checking in after each one. Slower, but bulletproof. It felt a bit like teaching someone to walk before letting them run.

## Reshaping the plan

Feedback from a mentor sync reshaped the whole approach: instead of training on everything, including some unusually long and complicated examples, we'd start with a clean, focused subset first — establish a solid baseline, then build up from there.

I filtered the dataset down, discovered something convenient (every single "clean" example was comfortably short, meaning zero extra filtering was needed), and reduced the model's working memory window to match — which, as a nice side effect, made training noticeably faster.

## Finally hitting go

By the end of the week, I finally started the real training run — and this time, it actually ran.
