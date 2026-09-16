---
license: mit
language:
  - bn
  - en
task_categories:
  - text-classification
  - translation
  - question-answering
  - summarization
tags:
  - bangla
  - bengali
  - low-resource
  - catalog
  - metadata
  - nlp-resources
size_categories:
  - {{sizeCategory}}
configs:
  - config_name: papers
    data_files: papers.jsonl
  - config_name: datasets
    data_files: datasets.jsonl
  - config_name: models
    data_files: models.jsonl
  - config_name: tools
    data_files: tools.jsonl
---

# Bangla NLP Catalog

A machine-readable catalog of Bangla (Bengali) NLP resources: **{{papers}} papers, {{datasets}} datasets, {{models}} models, and {{tools}} tools** across {{tasks}} tasks, each tagged by task and carrying a source link.

This is the data behind [BanglaNLP Hub](https://kishormorol.github.io/BanglaNLP-Hub/). It is metadata about resources, not the resources themselves: no corpora or model weights are redistributed here, only structured records pointing at them.

## Why this exists

Bangla is spoken by roughly 240 million people and is still treated as low-resource in practice, largely because the work that does exist is scattered across venues, personal pages, and dead links. This catalog is an attempt to make it countable and searchable, so that a researcher can see what already exists before rebuilding it.

## Configs

| Config | Rows | What a row is |
|---|---|---|
| `papers` | {{papers}} | A published paper, with `title`, `authors`, `venue`, `year`, `link`, and `task` |
| `datasets` | {{datasets}} | A dataset, with `name`, `desc`, `size`, `license`, `link`, and `bibtex` where known |
| `models` | {{models}} | A released model, with `arch`, `params`, `tasks`, `stage`, and `link` |
| `tools` | {{tools}} | A library or tool, with `lang`, `install`, `author`, and a `verified` flag |

```python
from datasets import load_dataset

papers = load_dataset("kishormorol/bangla-nlp-catalog", "papers", split="train")
datasets_ = load_dataset("kishormorol/bangla-nlp-catalog", "datasets", split="train")
```

## How it is maintained

Entries are added and corrected through pull requests on [the GitHub repo](https://github.com/kishormorol/BanglaNLP-Hub), where links are checked in CI. This dataset is a snapshot of that catalog; the repo is the source of truth.

## Limitations

Coverage is best for tasks with active published work (classification, MT, NER, QA) and thinner elsewhere. `license` fields reflect what the source stated at the time of entry and should be re-checked before you rely on them. Corrections are welcome as PRs or as a discussion here.

## Citation

```bibtex
@software{morol_banglanlp_hub,
  author  = {Morol, Md Kishor},
  title   = {BanglaNLP Hub: A Catalog of Bangla NLP Resources},
  url     = {https://github.com/kishormorol/BanglaNLP-Hub},
  license = {MIT}
}
```
