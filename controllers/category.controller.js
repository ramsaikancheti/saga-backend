const Category = require('../models/category.model');

const addCategory = async (req, res) => {
    try {
        const highestCategoryId = await Category.findOne().sort({ categoryId: -1 }).limit(1);
        const newCategoryId = highestCategoryId ? highestCategoryId.categoryId + 1 : 1;

        const highestTypesId = await Category.aggregate([
            { $unwind: '$types' },
            { $sort: { 'types.typesId': -1 } },
            { $limit: 1 },
        ]);

        const newTypesId = highestTypesId.length > 0 ? highestTypesId[0].types.typesId + 1 : 1;

        const newCategory = new Category({
            categoryId: newCategoryId,
            name: req.body.name,
            image: req.body.image,
            types: req.body.types.map((type, index) => {
                const sizes = type.sizes.map((size, sizeIndex) => ({
                    sizeId: index * type.sizes.length + sizeIndex + 1,
                    name: size.name,
                    description: size.description,
                    symbol: size.symbol,
                }));

                return {
                    typesId: newTypesId + index,
                    name: type.name,
                    image: type.image,
                    sizes: sizes,
                };
            }),
        });
         const savedCategory = await newCategory.save();
        res.json({ success: true, message: 'Category saved' });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

 
const getCategories = async (req, res) => {
    try {
        let query = {};

        if (req.params.categoryId) {
            query.categoryId = parseInt(req.params.categoryId);
        }

        if (req.params.typesId) {
            query['types.typesId'] = parseInt(req.params.typesId);
        }

        if (!req.params.categoryId) {
            const allCategories = await Category.find();
            return res.json(allCategories);
        }

        const category = await Category.findOne(query);

        if (!category) {
            return res.status(404).json({ error: 'Category or Type not found' });
        }
    

        if (req.params.categoryId && req.params.typesId) {
            const matchingType = category.types.find((type) => type.typesId === parseInt(req.params.typesId));

            if (matchingType) {
                category.types = [matchingType];
                res.json(category);
            } else {
                res.status(404).json({ error: 'Type not found in the specified category' });
            }
        } else {
            const categoriesWithSize = category.toObject();
            categoriesWithSize.types.forEach((type) => {
                type.sizes = type.sizes || [];
            });
            res.json(categoriesWithSize);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

         const updatedCategory = {
            name: req.body.name,
            image: req.body.image,
            types: req.body.types.map(type => ({
                name: type.name,
                size: type.size || null,  
                image: type.image,
            })),
             newField: req.body.newField,
        };

        const result = await Category.findOneAndUpdate(
            { categoryId: categoryId },
            { $set: updatedCategory },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category updated successfully', category: result });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addCategory, getCategories, updateCategory };

