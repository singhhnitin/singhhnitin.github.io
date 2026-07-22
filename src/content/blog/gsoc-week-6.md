---
title: "Week 6: Watching Paint Dry, But Make It Suspenseful"
description: "Two training runs, two learning rates, and what happens when a model gets too comfortable with its own homework."
pubDate: 2026-07-07T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "training"]
---

Training an AI model for real, at full scale, takes a long time. Like, "check back tomorrow" long. This week was less about building new things and more about watching, waiting, and learning to read the tea leaves of a slowly evolving graph.

## Two runs, two personalities

I set up two identical training runs, differing only in one setting: how big a step the model takes each time it learns from a mistake. One took bold, confident steps. The other took small, cautious ones. Think of it as the difference between someone adjusting a recipe by dumping in extra spice versus someone adding it a pinch at a time.

The bold version learned fast — its error rate plummeted almost immediately, and it started acing its own training examples with startling confidence. But when I checked how it did on new sentences it had never seen before, its performance quietly plateaued, even dipped slightly, while it kept getting better and better at the sentences it had already memorized. That's the textbook signature of a model getting a little too comfortable with its homework instead of genuinely learning the subject.

The cautious version told a different story. It never got quite as confident on its training data, but it held up just a touch better on brand-new sentences it had never encountered. Small steps, it turns out, sometimes age better than big ones.

## The result

Both runs finished successfully after roughly a day and a half each — no crashes, no disasters, just two very different personalities emerging from the exact same starting point and the exact same data.
