# github_scout

This program harvests information from a team's github repository for a specific year.

## Usage

### Requirements

Rust must be installed in order to use this tool. Please install it at <https://rustup.rs/>.

### Running the program

After rust is installed and you are in the project folder, using this tool is as simple as typing `cargo run -- https://github.com/Team2530/RobotCode2024 2530` into your terminal. Make sure to replace our repository and team number with those of the targetted team.

### Installation

You can also install this tool on a system by running `cargo install --path .`. This makes it available everywhere through the binary `github_scout`. Try running `github_scout --help` to get a list of available options.

### Command line interface

```
Usage: github_scout <URL> <TEAM_NUMBER>

Arguments:
  <URL>          Git URL
  <TEAM_NUMBER>  Target team number

Options:
  -h, --help     Print help
  -V, --version  Print version
```
