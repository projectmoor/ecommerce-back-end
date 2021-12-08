//import Category model
const Category = require('../models/category')
const slugify = require('slugify')
const shortid = require('shortid')

exports.addCategory = (req, res) => {

    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`
    }

    if(req.file){
        categoryObj.categoryImage = process.env.API + '/public/' + req.file.filename
    }

    if(req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj)
    cat.save((error, category) => {
        if(error) return res.status(400).json({ error })
        if(category) return res.status(201).json({ category })
    })
}

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined)
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories, cate._id),
            type: cate.type,
            parentId: cate.parentId
        })
    }

    return categoryList
}

exports.getCategory = (req, res) => {
    Category.find({})
    .exec((error, categories) => {
        if(error) return res.status(400).json({ message: 'Something went wrong'})
        if(categories){
            const categoryList = createCategories(categories);

            return res.status(200).json({ categoryList })
        } 
    })
}

exports.updateCategories = async (req, res) => {

    const {_id, name, parentId, type} = req.body;
    const updatedCategories = [];
    // if we got an array
    if(name instanceof Array){
        for(let i=0; i<name.length; i++){
            const category = {
                name: name[i],
                type: type[i],
            }
            if(parentId[i] !== ""){
                category.parentId = parentId[i];
            }
            const updatedCategory = await Category.findOneAndUpdate({_id: _id[i]}, category, {new: true}) // return the updated category
            updatedCategories.push(updatedCategory);
        }
        return res.status(201).json({ updatedCategories })
    }else { // if not an array
        const category = {
            name,
            type
        };
        if(parentId !== ""){
            category.parentId = parentId;
        }
        const updatedCategory = await Category.findOneAndUpdate({_id}, category, {new: true}) // return the updated category
        return res.status(201).json({ updatedCategory })
    }
}

exports.deleteCategories = async (req, res) => {
    const { ids } = req.body.payload;
    const deletedCategories = []
    for(let i = 0; i < ids.length; i++){
        const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id })
        deletedCategories.push(deleteCategory)
    }
    // verify all delete successfully
    if(deletedCategories.length == ids.length){
        res.status(201).json({message: 'Categoreis removed'})
    } else {
        res.status(400).json({message: 'Something went wrong'})
    }
}