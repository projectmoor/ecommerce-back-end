const Product = require('../models/product')
const shortid = require('shortid')
const slugify = require('slugify')
const Category = require('../models/category') // we need it to find category id based on slug
const product = require('../models/product')

exports.createProduct = (req, res) => {
   
    const {name, price, quantity, description,  category } = req.body

    let productPictures = [] // [{"_id": "", "img": ""}]

    if(req.files.length > 0) {
        productPictures = req.files.map(file => { // req.files is an array
            return { img: file.filename }
        })
    }

    const product = new Product({
        name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy: req.user._id
    })

    product.save((error, product) => {
        if(error) return res.status(400).json({error})
        if(product) {
            res.status(201).json({ product })
        }
    })
}

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params
    Category.findOne({ slug: slug })
    .select('_id type')
    .exec((error, category) => {
        if(error){
            return res.status(400).json({error})
        }
        if(category){
            Product.find({ category: category._id })
            .exec((error, products) => {
                if(error){
                    return res.status(400).json({error})
                }
                if(category.type){
                    if(products.length > 0){
                        res.status(200).json({
                            products,
                            priceRange: {
                                under3h: 300,
                                under5h: 500,
                            },
                            productsByPrice: {
                                under3h: products.filter(product => product.price <= 300),
                                under5h: products.filter(product => product.price >300 && product.price <= 500)
                            }
                        })
                    }
                } else {
                    res.status(200).json({ products })
                }
            })
        }
    })
}

exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if(productId){
        Product.findOne({_id: productId})
        .exec((error, product) => {
            if(error) return res.status(400).json({error});
            if(product){
                res.status(200).json({productDetails: product});
            }
        })
    }else{
        return res.status(400).json({ error: 'Params required' });
    }
}

// new update
exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
      Product.deleteOne({ _id: productId }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      });
    } else {
      res.status(400).json({ error: "Params required" });
    }
  };
  
  exports.getProducts = async (req, res) => {
    const products = await Product.find({ createdBy: req.user._id })
      .select("_id name price quantity slug description productPictures category")
      .populate({ path: "category", select: "_id name" })
      .exec();
  
    res.status(200).json({ products });
  };