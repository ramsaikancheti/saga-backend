const Category = require('../models/category.model');
const Product = require('../models/product.model');
 

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
            status: req.body.status || 1,
            types: req.body.types.map((type, index) => {
                const sizes = type.sizes.map((size, sizeIndex) => ({
                    sizeId: Math.floor(Math.random() * 1000) + 1, 
                    name: size.name,
                    description: size.description,
                    symbol: size.symbol,
                    status: size.status || 1,
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


const updateStatus = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const newStatus = req.body.status;  

        const result = await Category.findOneAndUpdate(
            { categoryId: categoryId },
            { $set: { status: newStatus } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Category not found' });
        }

        let message = '';
        if (newStatus === 0) {
            message = 'Category updated as out of stock';
        } else if (newStatus === 1) {
            message = 'Category updated as in stock';
        }

        res.json({ message, category: result });

    } catch (error) {
        console.error('Error updating category status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTypeStatus = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const typeId = req.params.typesId;
        const newStatus = req.body.status;

         const result = await Category.findOneAndUpdate(
            { categoryId: categoryId, 'types.typesId': typeId },
            { $set: { 'types.$.status': newStatus } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Category or Type not found' });
        }

         const updatedCategory = await Category.findOneAndUpdate(
            { categoryId: categoryId, 'types.typesId': typeId },
            { $set: { 'types.$.status': newStatus } }
        );

        let message = '';
        if (newStatus === 0) {
            message = 'Type updated as out of stock';
        } else if (newStatus === 1) {
            message = 'Type updated as in stock';
        }

        res.json({ message, category: updatedCategory });
    } catch (error) {
        console.error('Error updating type status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateSizeStatus = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const typeId = req.params.typesId;
        const sizeId = req.params.sizeId;
        const newStatus = req.body.status;

        const result = await Category.findOneAndUpdate(
            { categoryId: categoryId, 'types.typesId': typeId, 'types.sizes.sizeId': sizeId },
            { $set: { 'types.$[type].sizes.$[size].status': newStatus } },
            { arrayFilters: [{ 'type.typesId': typeId }, { 'size.sizeId': sizeId }] }
        );

        if (!result) {
            return res.status(404).json({ error: 'Category, Type, or Size not found' });
        }

        let message = '';
        if (newStatus === 0) {
            message = 'Size updated as out of stock';
        } else if (newStatus === 1) {
            message = 'Size updated as in stock';
        }

        res.json({ message, category: result });
    } catch (error) {
        console.error('Error updating size status:', error);
        res.status(500).json({ success: false, message: error.message });
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


const getTypesById = async (req, res) => {
    try {
        const { typesId } = req.params;

         const category = await Category.findOne({ 'types.typesId': parseInt(typesId) });

        if (!category) {
            return res.status(404).json({ error: 'Type not found' });
        }

         const matchingType = category.types.find((type) => type.typesId === parseInt(typesId));

        if (matchingType) {
            res.json(matchingType);
        } else {
            res.status(404).json({ error: 'Type not found in the specified category' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

         const existingCategory = await Category.findOne({ categoryId: categoryId });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

         existingCategory.name = req.body.name || existingCategory.name;
        existingCategory.image = req.body.image || existingCategory.image;
        existingCategory.status = req.body.status || existingCategory.status;

         if (req.body.types && Array.isArray(req.body.types)) {
            existingCategory.types = req.body.types.map((type, index) => {
                const sizes = type.sizes.map((size, sizeIndex) => ({
                    sizeId: size.sizeId || Math.floor(Math.random() * 1000) + 1,
                    name: size.name,
                    description: size.description,
                    symbol: size.symbol,
                    status: size.status || 1,
                }));

                return {
                    typesId: type.typesId || existingCategory.types[index].typesId,
                    name: type.name,
                    image: type.image,
                    sizes: sizes,
                };
            });
        }

         const updatedCategory = await existingCategory.save();

        res.json({ success: true, message: 'Category updated', category: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateTypes = async (req, res) => {
    try {
        const typesId = req.params.typesId;

        const existingCategory = await Category.findOne({ 'types.typesId': typesId });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Types not found' });
        }

        existingCategory.types.forEach((type) => {
            if (type.typesId == typesId) {
                type.name = req.body.name || type.name;
                type.image = req.body.image || type.image;
                type.status = req.body.status || type.status;
            }
        });

        const updatedCategory = await existingCategory.save();

        res.json({ success: true, message: 'Types updated', category: updatedCategory });
    } catch (error) {
        console.error('Error updating types:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTypeStatusId = async (req, res) => {
    try {
        const typesId = req.params.typesId;
        const newStatus = req.body.status;

        const existingCategory = await Category.findOne({ 'types.typesId': typesId });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Types not found' });
        }

        const typeToUpdate = existingCategory.types.find(type => type.typesId == typesId);

        if (!typeToUpdate) {
            return res.status(404).json({ error: 'Type not found within the category' });
        }

        typeToUpdate.status = newStatus;

        const updatedCategory = await existingCategory.save();

        res.json({ success: true, message: 'Type status updated', category: updatedCategory });
    } catch (error) {
        console.error('Error updating type status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// const updateCategory = async (req, res) => {
//     try {
//         const categoryId = req.params.categoryId;

//          const updatedCategory = {
//             name: req.body.name,
//             image: req.body.image,
//             types: req.body.types.map(type => ({
//                 name: type.name,
//                 size: type.size || null,  
//                 image: type.image,
//             })),
//              newField: req.body.newField,
//         };

//         const result = await Category.findOneAndUpdate(
//             { categoryId: categoryId },
//             { $set: updatedCategory },
//             { new: true }
//         );

//         if (!result) {
//             return res.status(404).json({ error: 'Category not found' });
//         }

//         res.json({ message: 'Category updated successfully', category: result });
//     } catch (error) {
//         console.error('Error updating category:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };




const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const result = await Category.findOneAndDelete({ categoryId: categoryId });

        if (!result) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully', category: result });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteType = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const typeId = req.params.typesId;

        const result = await Category.findOneAndUpdate(
            { categoryId: categoryId },
            { $pull: { types: { typesId: typeId } } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Category or Type not found' });
        }

        res.json({ message: 'Type deleted successfully', category: result });
    } catch (error) {
        console.error('Error deleting type:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTypeById = async (req, res) => {
    try {
        const typeId = req.params.typesId;

        const result = await Category.updateMany(
            { 'types.typesId': typeId },
            { $pull: { types: { typesId: typeId } } },
            { new: true }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Type not found' });
        }

        res.json({ message: 'Type deleted successfully' });
    } catch (error) {
        console.error('Error deleting type:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addCategory, getCategories, getTypesById, updateCategory, updateTypes, updateStatus, updateTypeStatus,updateTypeStatusId, updateSizeStatus, deleteCategory, deleteType, deleteTypeById };
