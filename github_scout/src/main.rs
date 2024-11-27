use clap::Parser;
use git2::Repository;
use std::{error::Error, fs, path::Path};

#[derive(Parser, Clone)]
#[command(version, about, long_about = None)]
struct Args {
    /// Git URL
    url: String,

    /// Target team number
    team_number: i16,
}

fn main() {
    let args = Args::parse();

    match Repository::clone(&args.url, format!("./{}/repo", args.team_number)) {
        Ok(repo) => repo,
        Err(e) => panic!("failed to clone: {}", e),
    };

    //TODO: extract more items & create a summary
    // list of vendordeps/components on robot, images of pathplanner routes, camera info

    extract_pathplanner(&args);

    // Delete the repo afterwards to save disk space
    fs::remove_dir_all(format!("./{}/repo", args.team_number)).expect("Failed to delete repo!");
}

fn extract_pathplanner(args: &Args) {
    copy_directory(
        Path::new(&format!(
            "./{}/repo/src/main/deploy/pathplanner",
            args.team_number
        )),
        Path::new(&format!("./{}/pathplanner", args.team_number)),
    ).expect("Failed to copy pathplanner info!");
}

fn copy_directory(src: &Path, dest: &Path) -> Result<(), Box<dyn Error>> {
    if !dest.exists() {
        fs::create_dir_all(dest)?;
    }

    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let src_path = entry.path();
        let dest_path = dest.join(entry.file_name());

        if src_path.is_dir() {
            copy_directory(&src_path, &dest_path)?;
        } else {
            fs::copy(&src_path, &dest_path)?;
        }
    }

    Ok(())
}