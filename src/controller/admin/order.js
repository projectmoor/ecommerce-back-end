const Order = require("../../models/order");

exports.updateOrder = (req, res) => {
    /*  
        req.body:
        {
            "userId": "",
            "type": "packed"
        }
    */

    Order.updateOne(
        { _id: req.body.orderId, "orderStatus.type": req.body.type}, // look for particular type (it's weird to use userId to query an order)
        {
            $set: {
                "orderStatus.$": [{ type: req.body.type, date: new Date(), isCompleted: true }],
            },
        }, {new: true}
    ).exec((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
            res.status(201).json({ order });
        }
    });
}

exports.getCustomerOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate("items.productId", "name")
        .exec();
    res.status(200).json({ orders });
}