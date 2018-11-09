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

# Temporary units, need to be replaced in recipes
tempUnitList = [
    'pkg','ts', 'tbs', 'lg', 'tb', 't'
]

units = list(itertools.chain.from_iterable(unitsList)) + tempUnitList
packets = ["packet", "packets", 'box', 'boxes', 'packages', 'package', 'tin', 'tins', 'dash', 'pinch', 'rasher', 'rashers']
qualifiers = ['big', 'large', 'rounded', 'small', 'medium', 'approximately', 'heaped', 'fresh']