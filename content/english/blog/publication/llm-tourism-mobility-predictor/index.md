---
title: "Understanding and Predicting Tourist Behavior through Large Language Models"
description: "Investigation into the potential of Large Language Models (LLMs) in interpreting and predicting tourist movements using real-world data from Verona, Italy."
slug: llm-tourism-mobility-predictor
date: 2024-12-15
image: cover.webp
draft: false
categories: ["publications"]
tags:
    - Large Language Models
    - Tourism Prediction
    - Recommender Systems
    - High-Performance Computing
    - Next POI Prediction
    - Verona
    - Smart Cities
    - Artificial Intelligence

comments: false

links:
  - title: Pre-print Paper
    description: Read the full research paper
    website: /docs/paper.pdf
  - title: GitHub Repository
    description: Access the complete open-source codebase and documentation
    website: https://github.com/4nnina/llm_tourist_trajectories
---

## Abstract

Understanding and predicting how tourists move through a city is a challenging task, as it involves a complex interplay of spatial, temporal, and social factors. Traditional recommender systems often rely on structured data, trying to capture the nature of the problem. However, recent advances in Large Language Models (LLMs) open up new possibilities for reasoning over richer, text-based representations of user context.

In this study, we investigate the potential of LLMs in interpreting and predicting tourist movements using a real-world application scenario involving tourist visits to Verona, a municipality in Northern Italy, between 2014 and 2023. We propose an incremental prompt engineering approach that gradually enriches the model input, from spatial features alone to richer behavioral information, including visit histories and user-cluster patterns. The approach is evaluated using six open-source models, enabling us to compare their accuracy and efficiency across various levels of contextual enrichment.

Results show that incorporating contextual factors improves predictions, resulting in better overall performance while maintaining computational efficiency. The analysis of the model-generated explanations suggests that LLMs mainly reason through geospatial proximity and the popularity of points of interest. Overall, the study demonstrates the potential of LLMs to integrate multiple contextual dimensions for tourism mobility, highlighting the possibility for a more text-oriented and adaptive recommender system.

## Introduction

Tourist Recommender Systems (T-RSs) have gained increased attention, supported by the availability of User Generated Content (UGC) and advanced analysis tools. Predicting future movements is crucial for producing meaningful suggestions, but it involves complex spatial, temporal, and social factors. Traditional approaches often rely on structured data and models like Recurrent Neural Networks (RNNs) or Transformers.

This paper investigates the potential of LLMs in interpreting and forecasting tourist movements in a Next-PoI prediction task. We compare six open-source LLM models and experiment with an incremental prompt engineering approach. The study uses a real-world dataset of tourist visits to Verona, Italy, from 2014 to 2023.

## Methodology

### Pipeline Overview
The methodology involves:
1.  **Trajectory Reconstruction**: aggregating historical visits.
2.  **Filtering**: selecting relevant trajectories.
3.  **Tourist Preferences**: identifying preferences via k-means clustering.
4.  **Prompt Construction**: creating prompts with varying context levels (Base, Spatial, Spatio-temporal, +Popularity, +Preference).
5.  **LLM Prediction**: obtaining suggestions and explanations.

### Prompt Design
We defined five incremental prompting strategies:
-   **(A) Base strategy**: Chronological sequence of visited PoIs.
-   **(B) Spatial strategy**: Adds coordinates and nearest PoIs.
-   **(C) Spatio-temporal strategy**: Adds visit duration and current time context.
-   **(D) Spatio-temporal-popularity strategy**: Integrates cluster-based most popular PoIs.
-   **(E) Spatio-temporal-preference strategy**: Integrates cluster-based preference lists.

### Evaluation Metrics
-   **Acc@1 (Top-1 Accuracy)**: Exact match of the first recommendation.
-   **HR@5 (Top-5 Hit Rate)**: Correct item appears in the top-5 recommendations.
-   **MRR (Mean Reciprocal Rank)**: Rank position of the correct item.

## Experiments

### Experimental Setup
Experiments were conducted on the **Leonardo** supercomputer (CINECA), using the Booster module equipped with NVIDIA A100 GPUs.
-   **Models**: Llama 3.1 8B, Qwen 2.5 (7B, 14B), Mixtral 8x7B, Mistral 7B, DeepSeek Coder 33B.
-   **Dataset**: VeronaCard dataset (2014-2023), ~2.7M visits, 570K tourists.

### Results
The strategy integrating tourist preferences (Strategy E) achieved the best performance.
-   **Mixtral 8x7B** achieved the highest **Acc@1 (34.27%)** with the middle anchor point.
-   **Qwen 2.5 14B** achieved the best **HR@5 (73.92%)** and **MRR (49.01%)**.

All LLM-based models consistently outperformed baselines (Random, Nearest, Popular), particularly in HR@5 and MRR, highlighting their capability to incorporate contextual information.

### Computational Performance
-   Average inference time remains acceptable even with complex prompts.
-   Larger models (Mixtral 8x7B, DeepSeek Coder 33B) show higher latency but provide better reasoning.

### Reasoning Analysis
Analysis of the 'reason' field in model outputs reveals:
-   **Geospatial reasoning** dominates most models.
-   **DeepSeek Coder 33B** shows stronger **temporal reasoning**.
-   **Popularity reasoning** plays a secondary role.

## Conclusion

This work demonstrates that LLMs can effectively understand and predict tourist movements when provided with enriched contextual prompts. The integration of spatial, temporal, and clustering-based preference information significantly improves accuracy. Future work will explore adding more context sources like weather and real-time crowding.

## Acknowledgments
We acknowledge ISCRA for awarding this project access to the **LEONARDO** supercomputer, owned by the EuroHPC Joint Undertaking, hosted by CINECA (Italy).

## Citation

```bibtex
@article{dallavecchia2024understanding,
  title={Understanding and Predicting Tourist Behavior through Large Language Models},
  author={Dalla Vecchia, Anna and Mattioli, Simone and Migliorini, Sara and Quintarelli, Elisa},
  journal={arXiv preprint},
  year={2024}
}
```