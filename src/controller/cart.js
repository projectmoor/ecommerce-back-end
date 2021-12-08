const Cart = require("../models/cart");

function runUpdate(condition, action) {
    return new Promise((resolve, reject) => {
        Cart.findOneAndUpdate(condition, action, { upsert: true })
            .then(result => resolve())
            .catch(err => reject(err))
    })
}

exports.addItemToCart = (req, res) => {
  console.log(req.body.cartItems)
  Cart.findOne({ user: req.user._id }) // return one found object
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        // if cart already exist, update cart
        let promiseArray = [];

        req.body.cartItems.forEach((cartItem) => {
          const product = cartItem.product;
          const item = cart.cartItems.find((c) => c.product == product);
          let condition, action;

          // if item alreay in cart
          if (item) {
            condition = { user: req.user._id, "cartItems.product": product };
            action = {
              $set: {
                "cartItems.$": cartItem
              }
            };
            console.log('add to sever based on each cartItem:', cartItem)
          } else {
            condition = { user: req.user._id };
            action = {
              $push: {
                "cartItems": cartItem
              }
            };
          }

          promiseArray.push(runUpdate(condition, action));
        });

        Promise.all(promiseArray)
            .then(response => res.status(201).json({ response }))
            .catch(error => res.status(400).json({ error }))

      } else {
        // if cart not exist, create cart
        const cart = new Cart({
          user: req.user._id,
          cartItems: req.body.cartItems,
        });

        cart.save((error, cart) => {
          if (error) return res.status(400).json({ error });
          if (cart) {
            return res.status(201).json({ cart });
          }
        });
      }
    });
};

exports.getCartItems = (req, res) => {
    const user = req.user;
    if(user){
        Cart.findOne({ user: user._id })
        .populate('cartItems.product', '_id name price productPictures')
        .exec((error, cart) => {
            if(error) return res.status(400).json({ error });
            if(cart){
                let cartItems = {};
                cart.cartItems.forEach((item, index) => {
                    cartItems[item.product._id.toString()] = {
                        _id: item.product._id.toString(),
                        name: item.product.name,
                        img: item.product.productPictures[0].img,
                        price: item.product.price,
                        qty: item.quantity
                    }
                })
                res.status(200).json({ cartItems })
            }
        })
    }
}

exports.removeCartItem = (req, res) => {
  const { productId } = req.body.payload;
  if(productId){
    Cart.update(
      {user: req.user._id},
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if(error) return res.status(400).json({ error });
      if(result) {
        res.status(202).json({ result });
      }
    });
  }
}