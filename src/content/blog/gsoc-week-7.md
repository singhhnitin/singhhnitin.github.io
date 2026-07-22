---
title: "GSoC Week 7: Fixing a Broken Evaluation Script and Building a Fairer Scoring Method"
description: "An evaluation that initially showed 0% correct turned out to be a bug in the scoring script, not the model — and the fairer scoring method built afterward."
pubDate: 2026-07-14T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "evaluation"]
---

This week centered on evaluating the fine-tuned models properly, which surfaced a bug in the evaluation process itself before it surfaced anything about the models.

## An evaluation that showed 0% correct

I built a proper evaluation set — 150 sentences pulled from three different sources — to check whether the fine-tuned model was actually extracting triples correctly. The first results came back at 0% correct across almost every category.

Rather than treating that number at face value, I read through the actual model outputs directly instead of relying on the aggregate score. The model's answers were frequently correct, but the output didn't stop there — it kept generating text after the correct answer, eventually repeating itself until it ran out of space. The evaluation script wasn't detecting the token the model uses to signal it's finished answering, so it let the model keep generating past that point, then scored the entire rambling output — correct answer included — as wrong.

## Fixing the evaluation script

Once the evaluation script was updated to detect the model's actual stop signal, the results changed substantially: the model went from producing outputs that scored as unusable to producing correctly-formatted answers close to 100% of the time.

## A fairer scoring method

Even after that fix, a second issue remained: the scoring was doing an exact string match against a reference answer, which marked correct extractions as wrong whenever the model produced the same facts in a different order or grouping. I built a fact-level scoring method instead — it checks whether each individual extracted fact is correct, independent of the order or structure the model presented them in.

## Where things stand

By the end of the week, there were two fully trained models and a working evaluation system that measures fact-level correctness rather than exact string matches — plus a clear reminder that an evaluation script needs to be checked as carefully as the thing it's evaluating.
