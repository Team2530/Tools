import json
import requests
from termcolor import colored

def getTeams(event_code):
    tba = requests.get("https://www.thebluealliance.com/event/" + event_code + "#event-insights")
    data = tba.text.split("const coprs = JSON.parse('")
    data = data[1].split("\');")
    return json.loads(data[0])

def printKeys():
    for key in all_data:
        print(key)

def print_selected_keys():
    for key in enumerate(all_data):
        if(wanted_keys_2023.count(key[0]) == 1):
            print(colored(key, 'green'))
        else:
            print(key)

def is_unique(lst, num):
    for i in lst:
        if i == num:
            return False
    return True

def spaces(num):
    return "".ljust(num)

def print_key_reminder():
    keys = ""
    for key in shortened_key_names:
        if len(key) > 12:
            keys += "\'" + key  + "\', "
    if keys.count(",") == 1:
        keys = keys[:-2]
    if len(keys) > 0:
        print(keys + " is/are greater than 12 charecters, so you may want to shorten it")

def sort_table_by(key_name):
    sorted_teams = []
    for team in all_data[key_name]:
        if is_unique(top_teams, team[0]) == False:
            sorted_teams.append(team[0])
    print(sorted_teams)
    return sorted_teams

def get_top_teams(num_teams):
    top_teams = []
    for key in key_names:
        for team in enumerate(all_data[key]):
            if (team[0] < num_teams + 1) and is_unique(top_teams, team[1][0]):
                top_teams.append(team[1][0])
    return top_teams

def get_key_names():
    key_names = []
    for key in enumerate(all_data):
        if(wanted_keys_2023.count(key[0]) == 1):
            key_names.append(key[1])
    return key_names

def build_table():
    print_string = "      "
    for data_name in shortened_key_names:
        print_string += data_name + "\t   "
    print(print_string)

    line_length = len(print_string)

    print_string = ""
    index = 0
    rank_offset = 0
    for team in top_teams:
        print_string += team.ljust(4) + "| "
        for key in key_names:
            for rank in enumerate(all_data[key]):
                if rank[1][0] == team:
                    if rank[0] > 9: rank_offset += 1
                    if rank[0] <= 9: rank_offset -= 1
                    colored_string = str(rank[0] + 1) + " (" + str(rank[1][1])[0:4] + ")\t   "
                    if rank[0] == 0: colored_string = colored(colored_string, 'yellow')
                    if rank[0] < 3: colored_string = colored(colored_string, 'green')
                    if rank[0] < 7 and rank[0] > 2: colored_string = colored(colored_string, "blue")
                    if rank[0] > 30: colored_string = colored(colored_string, "red")
                    print_string += colored_string
                    index += 1

        print(print_string)
        print("-" * (line_length + 10))
        print_string = ""
        index = 0
        rank_offset = 0


if __name__ == "__main__":
    # Event code which consists of year and an event code
    # Comes right after www.theblue.../event/
    event_code = "2023mndu"

    # Fetch TBA HTML and JSON data
    all_data = getTeams(event_code)

    #! If changes are made to the list of wanted_keys, it must be updated also
    #! in shortened_key_names, otherwise the data will be displayed
    #! in the wrong order!
    wanted_keys_2023 = [0, 1, 2, 3, 10, 15, 29] # Use numbers printed next to key when print_selected_keys is called
    shortened_key_names = ["OPR", "Total Pieces", "Total Pts.", "Fouls", "Auto Pts.", "Teleop Pts.", "Ranking Pts."]

    # Get key names that were selected
    key_names = get_key_names()

    # Get top n teams, so 10 will get all teams with any top 10 position
    # in a selected key
    top_teams = get_top_teams(10)

    # Prints selected keys in green (Others are in white)
    print_selected_keys() 

    # Sorts table by given key
    top_teams = sort_table_by("Foul Count Received")

    #? Builds final table
    build_table()

    #? Look for keys over 12 charecters, because they are long, and will make the table look a little off
    print_key_reminder()