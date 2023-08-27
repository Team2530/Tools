# Tools - Assortment of FRC related tools.

## FRC-Timer

[The timer](./FRC-Timer) is for FRC matches, which will play sounds and has options for scoring (currently configured for Summer Camp).

- The allotted time can be changed in the [script.js](./FRC-Timer/script.js) file and finding the 'matchTime' variable which is the total match time in seconds.
- Use the buttons (Start, Stop, Reset) to do their respective actions to the timer
- Space can also start, and enter stop
- The number keys 1-8 are for keeping score, use 1/2 for adding/subtracting for the red alliance, and 3/4 for the blue alliance
- Keys 5/6 and 7/8 are for adding penalties for the red and blue alliance respectively
- Once a match has finished, click 'r' on the keyboard to reveal the final score and winner

## Scouting

[team-table.py](./Scouting/team-table.py) will construct and print to the terminal a table of the top teams at a given regional.

- You will need a working installation of python as well as the requests and termselectedColor modules
  install via <em>'pip install requests'</em> and <em>'pip install termselectedColor'</em> or <em>pip3</em> if you are using python3
- All code that needs to be changed will be under the following line...

  ```python
  ...
  if __name__ == "__main__":
  ...
  ```

- Input the event code to the "event_code" variable which is found in the url on TBA's website (example)\
   thebluealliance.com/event/ --> \***\*2023mndu\*\*** <-- #event-insights
- 'wanted_keys_2023' is where you will put the keys that you would like to make the table on, these are provided by the 'print_selected_keys()' method, which will output all keys, and the ones selected (by putting their corresponding number in the array) in green
- 'shortened_key_names' provides a place to put key names that are smaller and more readable. These <em>MUST</em> match with what is entered in 'wanted_keys_2023' or the table will be labeled incorrectly. If you are putting OPR in the 3rd spot in one array, put it in the 3rd in the second array.
- 'get_top_teams()' gets the top teams in any selected category, as long as they are within the number passed in in any of the selected categories. You can also just put teams into the array inside single quotes to compare their stats as well.
- 'sort_table_by()' will sort the table based on the passed in key, which is the actual key from TBA. Use the exact key for the category that you are looking for that is retuned by the 'print_selected_keys()' method

## Game-Planner

[Game planner](./Game-Planner) is designed to be a tool for using when planning strategy before a match. You can download the source and run it locally, or use the link below to access it remotely.

- The background comes from [Path Planner](https://github.com/mjansen4857/pathplanner) which is from their amazing path generation tool! Check it out!
- You can use the [web version here](https://team2530.github.io/Game-Planner/) If the field doesn't show up right away, refresh the page, that seems to bring it up. May not be completely up to date as of now, when major changes occur, it will be updated.

### Tools
- Pen Tool: select to use a pen to draw on the field
- Eraser Tool: select to erase drawings on the field
- Piece Tool: Click to place cones/cubes on the field. When active, click again to switch which piece you're placing
- Arrow Tool: Use to draw arrows. Click to start arrow, and release to draw endpoint where you released
- Color circles: Select a color circle to use it for your pen and arrow color

### Features in development
- Different modes for Auto, teleop, and endgame
- Robot tool for placing robots on field
- Zone tool for marking areas
- Polygon tool for marking areas
- Reset for resetting all fields (auto, teleop, and endgame)
