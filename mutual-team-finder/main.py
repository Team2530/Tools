from tbapy import TBA

tba = TBA("KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw")

regional_one = input("TBA Key for Regional #1: ")
regional_two = input("TBA Key for Regional #2: ")

teams_at_regional_one = set([team.team_number for team in tba.event_teams(regional_one)])
teams_at_regional_two = set([team.team_number for team in tba.event_teams(regional_two)])

print(teams_at_regional_one.intersection(teams_at_regional_two))
