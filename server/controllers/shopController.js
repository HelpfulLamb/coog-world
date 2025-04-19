const db = require('../config/db');

exports.getUserShopPurchases = async (req, res, id) => {
    try {
        const [purchases] = await db.query(`
            SELECT 
                pp.product_id,
                pp.purchase_created AS date,
                pp.purchase_price AS price,
                i.Item_name AS item
            FROM product_purchases pp
            JOIN inventory inv ON pp.product_id = inv.Inventory_ID
            JOIN items i ON inv.Item_ID = i.Item_ID
            WHERE pp.Transaction_ID IN (
                SELECT Transaction_ID FROM transactions WHERE Visitor_ID = ?
            ) AND pp.product_type = 'Merchandise'
            ORDER BY pp.purchase_created DESC
        `, [id]);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ purchases }));
    } catch (error) {
        console.error('Error fetching shop purchases:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Error fetching purchases' }));
    }
};