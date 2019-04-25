import itertools

unitsList = [
    ['c', 'cup', 'cups'],
    ['tsp', 'tsps', 'teaspoon', 'teaspoons'],
    ['tbsp', 'tbsps', 'tablespoon', 'tablespoons'],
    ['lb', 'lbs', 'pound', 'pounds'],
    ['oz', 'ounce', 'ounces'],
    ['pint', 'pints'],
    ['kg', 'kilogram', 'kilograms'],
    ['g', 'gram', 'grams'],
    ['mg', 'miligram', 'miligrams'],
    ['ml', 'mililitre', 'mililitres'],
    ['l', 'litre', 'litres'],
]


units = list(itertools.chain.from_iterable(unitsList))

packets = ["packet", "packets", 'box', 'boxes', 'packages', 'package', 'tin', 'tins', 'dash', 'pinch', 'rasher', 'rashers', 'head', 'can', 'cans', 'packs', 'blocks', 'pack', 'block']
qualifiers = ['big', 'large', 'rounded', 'small', 'medium', 'approximately', 'heaped', 'fresh', 'packed', 'lightly', 'optional']
instructions = ['finely', 'chopped', 'minced', 'peeled', 'coarsely', 'very', 'soft', 'cooked', 'drained', 'diced', 'unbaked', 'prepared', 'cored', 'thinly', 'sliced', 'grated', 'cut', 'into', 'and', 'skinned', 'crushed', 'halved', 'hulled', 'but', 'pliable', 'cold', 'cm', 'cubes', 'frozen', 'shredded', 'toasted', ]

trimWords = qualifiers + packets + instructions + ['of']