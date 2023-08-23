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
- All code that needs to be changed will be under the following line...
  
  ```python
  ...
  if __name__ == "__main__":
  ...
  ```
- Input the event code to the "event_code" variable which is found in the url on TBA's website (example)\
   thebluealliance.com/event/ --> ****2023mndu**** <-- #event-insights
- 'wanted_keys_2023' is where you will put the keys that you would like to make the table on, these are provided by the 'print_selected_keys()' method, which will output all keys, and the ones selected (by putting their corresponding number in the array) in green
- 'shortened_key_names' provides a place to put key names that are smaller and more readable. These <em>MUST</em> match with what is entered in 'wanted_keys_2023' or the table will be labeled incorrectly. If you are putting OPR in the 3rd spot in one array, put it in the 3rd in the second array.
- 'get_top_teams()' gets the top teams in any selected category, as long as they are within the number passed in in any of the selected categories. You can also just put teams into the array inside single quotes to compare their stats as well.
- 'sort_table_by()' will sort the table based on the passed in key, which is the actual key from TBA. Use the exact key for the category that you are looking for that is retuned by the 'print_selected_keys()' method
