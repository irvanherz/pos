const order = require("../model/order")
const orderItem = require("../model/order-item")
const product = require("../model/product")
const helper = require("../helper/index")

module.exports = {
    gets: async (request, response) => {
        try {
            var resultOrders = await order.gets(request.query)
            console.log(resultOrders)
            for(var i=0; i<resultOrders.length; i++){
                resultOrders[i].orderItems = await orderItem.gets(resultOrders[i].invoice_id)
            }
            return helper.response(response,200,resultOrders)
        } catch (error) {
            console.log('aaaaaaaaaaaaa')
            return helper.response(response,400,error)
        }
    },
    get: async (request, response) => {
        try {
            const result = await order.get(request.params.id)
            result.orderItems = await orderItem.gets(result.invoice_id)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    post: async (request, response) => {
        try {
            randomId = ((min,max) => Math.floor(Math.random() * (max - min + 1)) + min)(1000000,9999999)

            const setItems = request.body.orderItems
            var resultItems = []
            var totalOrderPrice = 0
            var resultProducts = []
            //get selected products and checking selected product valid
            for(var i=0; i < setItems.length; i++){
                resultProducts.push(await product.get(setItems[i].product_id))
            }
            //insert order items and count total price
            for(var i=0; i < setItems.length; i++){
                setItems[i].price = resultProducts[i].price * setItems[i].qty
                totalOrderPrice += setItems[i].price
                const newItem = await orderItem.post(randomId, setItems[i])
                newItem.product = resultProducts[i]
                resultItems.push(newItem)
            }
            totalOrderPrice = totalOrderPrice + (totalOrderPrice * 10 / 100)
            setOrder = {cashier_id:request.user.id, invoice_id:randomId, price:totalOrderPrice}
            const resultOrder = await order.post(setOrder)
            result = {
                ...resultOrder,
                orderItems: resultItems
            }
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    put: async (request, response) => {
        try {
            const result = await order.put(request.params.id, request.body)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    delete: async (request, response) => {
        try {
            const result = await order.delete(request.params.id)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    }
}
