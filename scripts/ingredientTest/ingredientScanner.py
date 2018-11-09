import json
from pprint import pprint
import re
from units import units, packets, qualifiers
import operator


recipesRawJSON = open("allRecipes.json").read()
recipes = json.loads(recipesRawJSON)

'''
Splits the ingredient line string into a quantity and the ingredient name
'''
def split_num_ingredient(str):
    # check name for qualifiers and strip it
    if str.split(' ')[0].lower() in qualifiers:
        quantifier = str.split(' ')[0]
        str = " ".join(str.split(' ')[1:])

    # handles the following matches
    # 1/4 tsp salt
    # 2 1/4 tsp salt
    # 2 tsp salt
    # 1 15 gram pkg of yeast
    r = re.compile(r'((?:\d+ (?:\d+\/\d+))|(?:\d+ \d+)|(?:(?:\d+|\d+\/\d+) - (?:\d+|\d+\/\d+))|(?:\d\/\d)|\d+)((?: ?[A-z-,]+)+)')
    name = str.lower()
    num = None
    measurement = None

    # Check for no match
    if r.match(name):
        num = r.match(name).group(1)
        if num != None:
            num = num.strip()
        name = r.match(name).group(2).strip().replace('.', '').replace(',', '')

    oldStr = ""

    while name != oldStr:
        oldStr = name
        # check name for qualifiers and strip it
        if name.split(' ')[0] in qualifiers:
            measurement = name.split(' ')[0]
            name = " ".join(name.split(' ')[1:])

        # check name for measurement and strip it
        if name.split(' ')[0] in units:
            name = " ".join(name.split(' ')[1:])

        # check name for package and strip it
        if name.split(' ')[0] in packets:
            name = " ".join(name.split(' ')[1:])

        # check for 'of' participle
        if name.split(' ')[0] == "of":
            name = " ".join(name.split(' ')[1:])

    return {"num": num, "measurement": measurement, "name": name}


#  make a dictionary of common ingredients and their frequency
ingredientFreq = {}

for recipe in recipes:
    for ingredient in recipe["ingredients"]:
        # Trim the quantity from the ingredient
        split = split_num_ingredient(ingredient)

        # If we didnt recognise the ingredient format, error
        # if split["num"] == None :
        #     print("ERROR", split["name"])
            
        if split['name'] in ingredientFreq:
            ingredientFreq[split['name']] += 1
        else:
            ingredientFreq[split['name']] = 1

        

for ing, freq in reversed(sorted(ingredientFreq.items(), key=operator.itemgetter(1))):
    # if freq < 2:
    #     break
    print(ing, "=>", freq)

# print(split_num_ingredient("Pinch of Salt"))
