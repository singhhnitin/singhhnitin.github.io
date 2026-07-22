---
title: "GSoC Week 6: Comparing Two Learning Rates Across Fine-Tuning Runs"
description: "Two training runs, two learning rates, and what a model overfitting to its own training data looks like in practice."
pubDate: 2026-07-07T00:00:00.000Z
tags: ["gsoc", "dbpedia", "hindi-nlp", "training"]
---

With the pipeline working, this week was spent running full-scale training and comparing results, rather than building anything new.

## Two runs, different learning rates

I set up two identical training runs that differed only in the learning rate — how large a step the model takes when updating its weights after each mistake. One used a higher learning rate, the other a lower one.

The higher learning rate run improved quickly: its error rate on training examples dropped fast, and it reached high accuracy on the data it was trained on. But when evaluated on sentences it hadn't seen during training, its performance plateaued and dipped slightly, even as its training accuracy kept improving. That pattern — improving on training data while validation performance stalls or drops — is a standard sign of overfitting, where the model is starting to memorize specific training examples rather than learning generalizable patterns.

The lower learning rate run showed a different pattern: it didn't reach quite as high an accuracy on its own training data, but it held up slightly better on new, unseen sentences.

## Result

Both training runs completed successfully in roughly a day and a half each, with no crashes. The comparison is what determines which learning rate to carry forward for the next round of fine-tuning.
