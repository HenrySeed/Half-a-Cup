import os
import xml.etree.ElementTree
import json



class Recipe():
    def __init__(self, titleStr, tagsStr, subtitleStr, ingredientsStr, stepsStr):
        self.title = titleStr
        self.subtitle = subtitleStr

        self.tags = tagsStr.split(',')
        self.ingredients = ingredientsStr.split('\n')
        self.steps = stepsStr.split('\n')

        self.cleanup()


    def cleanup(self):
        ''' Cleans up some of the values
        '''
        # capitalises all the tags
        for i in range(0, len(self.tags)):
            self.tags[i] = self.tags[i].title()

        # remove empty steps in ingredients or steps
        cleanedSteps = []
        cleanedIngredients = []
        cleanedTags = []

        for step in self.steps:
            if step.strip() != "":
                cleanedSteps.append(step.replace('\n', ''))

        for ingredient in self.ingredients:
            if ingredient.strip() != "":
                cleanedIngredients.append(ingredient.replace('\n', ''))

        for tags in self.tags:
            if tags.strip() != "":
                cleanedTags.append(tags.replace('\n', ''))

        self.subtitle = self.subtitle.replace('\n', '').strip()

        self.steps = cleanedSteps;
        self.ingredients = cleanedIngredients
        self.tags = cleanedTags




    def __str__(self):
        ''' Nicely prints the recipe in an easy to read format
        '''
        _retString = ""

        _retString += "\n+--------------------------------------------------------+\n"

        _retString += self.title.strip() + "\n"
        _retString += self.subtitle.strip() + "\n\n"

        _retString += ', '.join(self.tags).strip() + '\n\n'

        _retString += "Ingredients\n  "
        _retString += '\n  '.join(self.ingredients).strip() + '\n\n\n'

        _retString += "Steps\n  "
        _retString += '\n  '.join(self.steps).strip() + '\n\n'

        _retString += "+--------------------------------------------------------+\n"

        return _retString



allRecipes = {}


# loads all recipes from the recipes_rawfolder
directory = os.fsencode("./recipes_raw")

for file in os.listdir(directory):
    filename = "./recipes_raw/" + str(os.fsdecode(file))

    if filename.endswith(".xml"): 
        e = xml.etree.ElementTree.parse(filename).getroot()

        # sets up params for the recipe objects
        title = e.findall('title')[0].text.strip()
        subtitle = e.findall('subtitle')[0].text
        tags = e.findall('category')[0].text
        ingredients = e.findall('ingredients')[0].text
        steps = e.findall('steps')[0].text

        # addds the recipe to allRecipes with the title as the key
        allRecipes[title] = Recipe(title, tags, subtitle, ingredients, steps)

outputStr = "["
# Nicely prints all the recipes
for key in allRecipes.keys():
    outputStr += json.dumps(allRecipes[key].__dict__) + ", "

outputStr += "]"

os.system("touch ./allRecipes.json")

outputFile = open("./allRecipes.json", 'w')
outputFile.write(outputStr)