module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = (item, id, price, naziv) =>{
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: price, naziv: naziv };
        }
        storedItem.qty++;
        storedItem.price = price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.price;
    };

    this.generateArray = () =>{
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};