import json
from pprint import pprint
import re
from units import units, trimWords, qualifiers
import operator
from testIngredients import testIngredients


recipesRawJSON = open("allRecipes.json").read()
recipes = json.loads(recipesRawJSON)

'''
Takes an ingredient string and removes common words from the front or the back
'''
def prune_string(name):
    measurement = None
    charsToReplace = list(",.[]\{\}()_=+*&^%$#@!~`;:<>?\\|")

    # Remove anything after a comma
    name = name.split(',')[0]

    # check name for qualifiers and strip it
    if name.split(' ')[0] in trimWords + ["or"]:
        name = " ".join(name.split(' ')[1:])
    # check name for measurement and strip it
    elif name.split(' ')[0] in units:
        measurement = name.split(' ')[0]
        name = " ".join(name.split(' ')[1:])
    
    # Globally remove any words on the trimWords list
    tempName = []
    for word in name.strip().split(' '):
        word = word.strip()
        if word not in trimWords and not (word[0] == '(' and word[-1] == ")"):
            tempName.append(word)

    name = " ".join(tempName)

    # Remove any non approved chars, like +, -, ;, :, _
    for char in charsToReplace:
        name = name.replace(char, '')

    return {"measurement": measurement, "name": name}


'''
Splits the ingredient line string into a quantity and the ingredient name
'''
def split_num_ingredient(str):
    # check name for qualifiers and strip it
    if str.split(' ')[0].lower() in qualifiers:
        quantifier = str.split(' ')[0]
        str = " ".join(str.split(' ')[1:])

    # handles the matches
    r = re.compile(r'((?:\d+ (?:\d+\/\d+))|(?:\d+ \d+)|(?:(?:\d+|\d+\/\d+) - (?:\d+|\d+\/\d+))|(?:\d\/\d)|\d+)((?:(?: ?\(.+\))|(?: ?[A-z,.\-\(\)]+))+)')
    name = str.lower()
    num = None
    measurement = None

    # Check for no match
    if r.match(name):
        num = r.match(name).group(1)
        if num != None:
            num = num.strip()
        name = r.match(name).group(2).strip()

    oldStr = ""
    while name != oldStr:
        oldStr = name
        obj = prune_string(name)
        if obj['measurement'] != None:
            measurement = obj['measurement']
        name = obj['name']

    return {"num": num, "measurement": measurement, "name": name}


#  make a dictionary of common ingredients and their frequency
# ingredientFreq = {}
# FoundEmpty = []

# for ingredient in testIngredients:
#     # Trim the quantity from the ingredient
#     split = split_num_ingredient(ingredient)

#     if  split["name"].strip() == "":
#         FoundEmpty.append(ingredient)
        
#     if split['name'] in ingredientFreq:
#         ingredientFreq[split['name']] += 1
#     else:
#         ingredientFreq[split['name']] = 1

#     print("{:40}  ->  {} : {} : {}".format(ingredient, split["num"], split["measurement"], split["name"]))

# for ing, freq in reversed(sorted(ingredientFreq.items(), key=operator.itemgetter(1))):
#     print(ing)
# if FoundEmpty != []:
#     print("WARNING FOUND EMPTY INGREDIENT NAME", FoundEmpty)




testIngredients = ["2 cups self-raising flour", "1/2 cup castor sugar", "1/2 cup chocolate chips", "1/2 tsp salt", "100g butter", "1 cup milk", "1 large egg", "1 tsp vanilla", "1 cup (2-3) mashed bananas"]
testSteps = [
    "Heat oven to 220\u00b0C (210\u00b0C fanbake), with the rack just below the middle.", 
    "With a fork, stir the flour, castor sugar, chocolate chips and salt together in a large bowl.", 
    "Melt the butter in another large bowl, remove from the heat, then add the milk, egg and vanilla and beat well.", 
    "Mash and measure the bananas, then stir them into the liquid.", 
    "Tip all the flour mixture into the bowl with the liquid mixture.", 
    "Fold everything together carefully until all the flour is dampened, stopping before the mixture is smooth", 
    "Spray 12 regular muffin pans with nonstick spray. Put about 1/4 cup of mixture into each cup.", 
    "Bake for 12\u00e2\u20ac\u201d15 minutes, until muffins spring back when pressed in the centre."
]

ingredients = []
for i in testIngredients:
    ingredients.append(split_num_ingredient(i))

# Gets the ingredients used in this step
def getIngredientsForStep(step):
    global ingredients
    usedIngr = []
    newIngredients = []

    # For each ingredient 
    for ingr in ingredients:
        name = ingr["name"]

        if name in step:
            usedIngr.append(ingr)
        else:
            for word in name.split(' '):
                if word in step:
                    usedIngr.append(ingr)
        
        if ingr not in usedIngr:
            newIngredients.append(ingr)
    
    ingredients = newIngredients
    return usedIngr



for step in testSteps:
    ingr = getIngredientsForStep(step)
    ingrs = ""
    for ingrObj in ingr:
        ingrs += "{} {} {}\n".format(ingrObj["num"], ingrObj["measurement"], ingrObj["name"])

    print(step)    
    print("")
    print(ingrs)    
    print('-----------------------------\n')


