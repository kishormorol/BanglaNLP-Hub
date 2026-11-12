// Run from the repository root:
// mkdir -p .tmp/checks && rustc --edition=2024 --test tests/hot-paths.rs -o .tmp/checks/hot-paths && .tmp/checks/hot-paths
use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
};

const BIB: &str = r#"# Synthetic ingestion fixtures, never published.
@inproceedings{2025.blp-1.1,
 title = "{B}angla Sentiment Alpha",
 url = "https://doi.org/mixedcase",
 year = "2025",
 author = "Author, Fixture and Other, Person",
 booktitle = "Workshop on Bangla Language Processing (BLP-2025)",
}
@inproceedings{2023.blp-1.2,
 title = "Bangla Sentiment Alpha",
 url = "https://source.test/shadow",
 year = "2023",
 author = "Author, Fixture",
 booktitle = "Workshop on Bangla Language Processing (BLP-2023)",
}
@article{2026.other-1.3,
 title = {Bengali Named Entity Recognition},
 url = {https://source.test/braced},
 year = {2026},
 author = {Uzuner, {\"O}zlem},
 journal = {Custom Workshop ({CH}i{PSAL}2026)},
}
"#;

#[test]
fn catalog_schemas_preserve_validation_and_defaults() {
    let result = Command::new("node")
        .args(["--import", "tsx", "--input-type=module", "-e", r#"
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { DatasetSchema, ModelSchema, ContributionSchema } from './src/lib/schemas.ts';
const dataset = parse(readFileSync('data/datasets/sentiment.yaml', 'utf8'))[0];
const model = parse(readFileSync('data/models.yaml', 'utf8'))[0];
assert.equal(DatasetSchema.safeParse(dataset).success, true);
assert.equal(ModelSchema.safeParse(model).success, true);
assert.equal(DatasetSchema.safeParse({ ...dataset, link: 'javascript:invalid' }).success, false);
assert.equal(DatasetSchema.safeParse({ ...dataset, verified: '2026-02-30' }).success, false);
assert.equal(ModelSchema.safeParse({ ...model, tasks: [] }).success, false);
assert.equal(ModelSchema.safeParse({ ...model, tasks: [model.tasks[0], model.tasks[0]] }).success, false);
assert.equal(ModelSchema.safeParse({ ...model, stage: 'unknown' }).success, false);
const contribution = { title: 'Schema fixture', task: 'sentiment', authors: 'Fixture author', issue: 1 };
assert.equal(ContributionSchema.parse(contribution).kind, 'paper');
assert.equal(ContributionSchema.safeParse({ ...contribution, issue: undefined }).success, false);
"#])
        .output()
        .unwrap();
    assert!(
        result.status.success(),
        "{}",
        String::from_utf8_lossy(&result.stderr)
    );
}

fn setup(name: &str) -> (PathBuf, PathBuf) {
    let repo = std::env::current_dir().unwrap();
    let dir = repo.join(format!(".tmp/hot-path-tests/{}-{name}", std::process::id()));
    for sub in ["data/papers", "data/datasets", "data/inbox"] {
        fs::create_dir_all(dir.join(sub)).unwrap();
    }
    fs::write(dir.join("anthology.bib"), BIB).unwrap();
    fs::write(
        dir.join("data/papers/known.yaml"),
        "- title: Bengali published\n  link: https://known.test/Keep?x=1#part\n",
    )
    .unwrap();
    fs::write(dir.join("data/inbox/candidates.yaml"), "# Keep this warning.\n- source: acl\n  kind: paper\n  title: Queued A\n  link: https://source.test/queued\n- source: acl\n  kind: paper\n  title: Queued B\n  link: https://source.test/queued\n- source: acl\n  kind: paper\n  title: Published alias\n  link: https://www.known.test/Keep?x=1#part\n").unwrap();
    (repo, dir)
}

fn discover(
    repo: &Path,
    dir: &Path,
    scripts: &Path,
    args: &[&str],
    env: &[(&str, &str)],
) -> (String, String) {
    fs::write(dir.join("events.log"), "").unwrap();
    let result = Command::new("node")
        .current_dir(dir)
        .arg("--import")
        .arg(repo.join("tests/fixtures/discovery-fetch.mjs"))
        .arg("--import")
        .arg(repo.join("node_modules/tsx/dist/loader.mjs"))
        .arg(scripts.join("discover.ts"))
        .args(args)
        .envs(env.iter().copied())
        .output()
        .unwrap();
    assert!(
        result.status.success(),
        "{}",
        String::from_utf8_lossy(&result.stderr)
    );
    (
        fs::read_to_string(dir.join("data/inbox/candidates.yaml")).unwrap(),
        fs::read_to_string(dir.join("events.log")).unwrap(),
    )
}

#[test]
fn discovery_preserves_data_and_overlaps_independent_requests() {
    let (repo, dir) = setup("discovery");
    let scripts = repo.join("scripts");
    let (inbox, events) = discover(&repo, &dir, &scripts, &[], &[]);
    let first_finish = events.find("finish ").unwrap();
    for source in ["acl", "arxiv", "datasets", "models", "openalex"] {
        assert!(
            events.find(&format!("start {source}")).unwrap() < first_finish,
            "{events}"
        );
    }
    assert!(
        !events.contains("delay "),
        "No delay belongs after a final page: {events}"
    );
    assert_eq!(inbox.matches("- source:").count(), 10);
    assert_eq!(inbox.matches("title: Bangla Sentiment Alpha").count(), 1);
    assert!(inbox.contains("title: Bangla Shadow Speech"));
    assert!(!inbox.contains("Bangla DOI alias") && !inbox.contains("Published alias"));
    assert!(inbox.contains("/Case") && inbox.contains("/case") && inbox.contains("Keep?x=2#part"));
    assert_eq!(inbox.matches("title: Queued").count(), 2);
    assert!(!inbox.contains("/queued-title") && !inbox.contains("Bangla malformed alias"));
    assert_eq!(inbox.matches("title: fixture/BanglaCorpus").count(), 2);
    if let Ok(baseline) = std::env::var("HOT_PATH_BASELINE") {
        let (_, old_dir) = setup("baseline");
        let (old_inbox, _) = discover(&repo, &old_dir, Path::new(&baseline), &[], &[]);
        assert_eq!(inbox, old_inbox, "Discovery output changed");
    }
    for (name, args, env, delay) in [
        (
            "arxiv-pages",
            vec!["--source", "arxiv", "--limit", "101"],
            vec![],
            "delay 3500",
        ),
        (
            "openalex-pages",
            vec!["--source", "openalex", "--limit", "2"],
            vec![("FIXTURE_PAGES", "1")],
            "delay 300",
        ),
    ] {
        let (_, paged) = setup(name);
        let (_, log) = discover(&repo, &paged, &scripts, &args, &env);
        assert_eq!(log.matches(delay).count(), 1, "{log}");
        assert_eq!(
            log.matches("start ").count(),
            2,
            "--source or pagination changed: {log}"
        );
    }
    for failure in ["acl", "datasets", "hf-status"] {
        let (_, failed) = setup(failure);
        let (output, _) = discover(
            &repo,
            &failed,
            &scripts,
            &[],
            &[("FIXTURE_FAILURE", failure)],
        );
        assert!(
            output.contains("Bangla Upper"),
            "Another provider was discarded"
        );
        assert_eq!(
            output.matches("title: fixture/BanglaCorpus").count(),
            if failure == "datasets" {
                0
            } else if failure == "hf-status" {
                1
            } else {
                2
            }
        );
    }
}

#[test]
fn promotion_preserves_bibtex_fields_and_venue_rules() {
    let (repo, dir) = setup("promotion");
    fs::write(dir.join("data/tasks.yaml"), "- id: sentiment\n- id: ner\n").unwrap();
    let queued = "# Keep this warning.\n- { source: acl, kind: paper, link: 'https://doi.org/mixedcase' }\n- { source: acl, kind: paper, link: 'https://source.test/braced' }\n";
    fs::write(dir.join("data/inbox/candidates.yaml"), queued).unwrap();
    let run = |script: PathBuf, dry: bool| {
        let mut command = Command::new("node");
        command
            .current_dir(&dir)
            .arg("--import")
            .arg(repo.join("node_modules/tsx/dist/loader.mjs"))
            .arg(script)
            .args(["--bib", "anthology.bib"]);
        if dry {
            command.arg("--dry");
        }
        let result = command.output().unwrap();
        assert!(
            result.status.success(),
            "{}",
            String::from_utf8_lossy(&result.stderr)
        );
        String::from_utf8(result.stdout).unwrap()
    };
    let report = run(repo.join("scripts/promote.ts"), true);
    if let Ok(baseline) = std::env::var("HOT_PATH_BASELINE") {
        assert_eq!(report, run(Path::new(&baseline).join("promote.ts"), true));
    }
    assert_eq!(
        fs::read_to_string(dir.join("data/inbox/candidates.yaml")).unwrap(),
        queued
    );
    run(repo.join("scripts/promote.ts"), false);
    let sentiment = fs::read_to_string(dir.join("data/papers/sentiment.yaml")).unwrap();
    let ner = fs::read_to_string(dir.join("data/papers/ner.yaml")).unwrap();
    assert!(sentiment.contains("BLP @ IJCNLP-AACL") && sentiment.contains("Author et al."));
    assert!(ner.contains("CHiPSAL") && ner.contains("Uzuner") && !ner.contains("{B}"));
    assert!(
        fs::read_to_string(dir.join("data/inbox/candidates.yaml"))
            .unwrap()
            .starts_with("# Keep this warning.")
    );
}
